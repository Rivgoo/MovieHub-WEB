import { Box } from "@mui/material";
import AdminLayout from "../AdminLayout";
import "./ActorManagerPage.css";
import React, { useState, useEffect } from "react";
import ActorCard from "./ActorCard/ActorCard";
import ActorModal from "./ActorModal/ActorModal";
import { actorApi } from "../../../core/api/actorApi";
import { ActorDto } from "../../../core/api/types/types.actor";
import ConfirmModal from '../../ConfirmModal/ConfirmModal';
import { useLocation, useNavigate } from "react-router-dom";
import StandardPagination from "../../../shared/components/Pagination/StandardPagination";
import { debounce } from "lodash";

const ActorManagerPage: React.FC = () => {
  const [actors, setActors] = useState<ActorDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentActor, setCurrentActor] = useState<ActorDto | null>(null);
  const [isPhotoStep, setIsPhotoStep] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actorIdToDelete, setActorIdToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 30;
  
useEffect(() => {
  loadActors(currentPage);
  window.scrollTo({ top: 0, behavior: "auto" });
}, [currentPage]);


const buildUrlQuery = (params: Record<string, any>): string => {
  const query = new URLSearchParams();
  for (const key in params) {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      String(params[key]).trim() !== '' &&
      params[key] !== 'all'
    ) {
      query.append(key, String(params[key]));
    }
  }
  return query.toString();
};

const parseUrlQuery = (search: string): Record<string, any> => {
  const params = new URLSearchParams(search);
  const result: Record<string, any> = {};
  params.forEach((value, key) => {
    if (key === 'PageIndex') result[key] = parseInt(value, 10) || 1;
    else result[key] = value;
  });
  return result;
};

const location = useLocation();
const navigate = useNavigate();

const [searchTerm, setSearchTerm] = useState('');

const debouncedSearch = React.useRef(
  debounce((search: string) => {
    const query = buildUrlQuery({ PageIndex: 1, SearchTerms: search });
    navigate(`${location.pathname}?${query}`);
  }, 400)
).current;

useEffect(() => {
  debouncedSearch(searchTerm);
}, [searchTerm]);

useEffect(() => {
  const params = parseUrlQuery(location.search);
  const page = params.PageIndex || 1;
  const search = params.SearchTerms || '';
  setSearchTerm(search);
  setCurrentPage(page);
  loadActors(page, search);
  window.scrollTo({ top: 0, behavior: "auto" });
}, [location.search]);


 const loadActors = async (page: number = 1, search: string = '') => {
  try {
    const response = await actorApi.filter({ 
      pageIndex: page, 
      pageSize, 
      searchTerms: search 
    });
    setActors(response.items || []);
    setTotalPages(Math.ceil((response.totalCount || 0) / pageSize));
  } catch (error) {
    setActors([]);
  }
};

  const handleEdit = (id: number) => {
    const actorToEdit = actors.find((actor) => actor.id === id);
    if (actorToEdit) {
      setCurrentActor(actorToEdit);
      setIsPhotoStep(false); 
      setIsModalOpen(true);
    }
  };

const handleDelete = (id: number) => {
    setActorIdToDelete(id);
    setIsConfirmModalOpen(true);
};

const confirmDelete = async () => {
    if (actorIdToDelete !== null) {
      try {
        await actorApi.delete(actorIdToDelete);
        await loadActors();
      } catch (error) {
      } finally {
        setActorIdToDelete(null);
        setIsConfirmModalOpen(false);
      }
    }
};
  
const cancelDelete = () => {
    setActorIdToDelete(null);
    setIsConfirmModalOpen(false);
};

const handleAddActor = async (newActor: { name: string; surname: string }) => {
  try {
    const createRequest = {
      firstName: newActor.name,
      lastName: newActor.surname,
};

const created = await actorApi.create(createRequest);

setCurrentPage(1); 
await loadActors(1); 
const tempActor: ActorDto = {
      id: created.id,
      firstName: newActor.name,
      lastName: newActor.surname,
      photoUrl: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
};
    setCurrentActor(tempActor);
    setIsPhotoStep(true);
  } catch (error) {}
};

  const handleActorPhotoSubmit = async (base64Image: string | undefined) => {
    try {
      if (!currentActor) {
        return;
      }
      if (!base64Image) {
        return;
      }
      const actorId = currentActor.id;
      const cleanedBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
  
    //   @ts-ignore
      const response = await actorApi.uploadPhoto(actorId, {
        base64Image: cleanedBase64,
      });
  
      await loadActors();
      setIsModalOpen(false);
      setIsPhotoStep(false);
    } catch (error) {
    }
  };

  const handleUpdateNameSurname = async (updated: { name: string; surname: string }) => {
    try {
      if (!currentActor) return;
  
      const updateRequest = {
        firstName: updated.name,
        lastName: updated.surname,
      };
      await actorApi.update(currentActor.id, updateRequest);
      setActors((prev) =>
        prev.map((actor) =>
          actor.id === currentActor.id
            ? { ...actor, firstName: updated.name, lastName: updated.surname }
            : actor
        )
      );
      setIsPhotoStep(true);
    } catch (error) {
    }
  };

  const handleSubmit = async (data: { name: string; surname: string }) => {
    if (currentActor) {
      await handleUpdateNameSurname(data);
      setIsPhotoStep(true); 
    } else {
      await handleAddActor(data);
      setIsPhotoStep(true); 
    }
  };
 
  return (
    <AdminLayout pageTitle="Керування акторами">
      <Box>
        <div className="actors-page">
          <div className="actors-page-header">
            <h2>Актори</h2>
            <button
              className="actors-page-add-button"
              onClick={() => {
                setCurrentActor(null);
                setIsPhotoStep(false);
                setIsModalOpen(true);
              }}
            >
              Додати нового актора 
            </button>
          </div>
          <div className="actors-page-search-input-wrapper" style={{ marginBottom: '1rem' }}>
            <input
            type="text"
            placeholder="Пошук актора..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="actors-page-search-input"
            />
    </div>
          <div className="actors-grid">
          {[...actors]
 .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  .map((actor) => (
    <ActorCard
      key={actor.id}
      name={`${actor.firstName} ${actor.lastName}`}
      image={actor.photoUrl}
      onEdit={() => handleEdit(actor.id)}
      onDelete={() => handleDelete(actor.id)}
    />
))}
          </div>
          <StandardPagination
            sx={{ marginTop: "1rem" }}
            count={totalPages}
            page={currentPage}
            onChange={(_event, page) => {
                const query = buildUrlQuery({
                PageIndex: page,
                SearchTerms: searchTerm,
                });
                navigate(`${location.pathname}?${query}`);
            }}
              />
        </div>
        <ActorModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentActor(null);
            setIsPhotoStep(false);
          }}
          onSubmit={handleSubmit}
          onSubmitPhoto={handleActorPhotoSubmit} 
          actor={currentActor}
          isPhotoStep={isPhotoStep}
          onNextStep={() => setIsPhotoStep(true)}
        />

{isConfirmModalOpen && (
  <ConfirmModal
    message="Ви впевнені, що хочете видалити цього актора?"
    onConfirm={confirmDelete}
    onCancel={cancelDelete}
  />
)}
      </Box>
    </AdminLayout>
  );
};

export default ActorManagerPage;

