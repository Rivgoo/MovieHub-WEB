import { Box } from "@mui/material";
import AdminLayout from "../AdminLayout";
import "./ActorManagerPage.css";
import React, { useState, useEffect } from "react";
import ActorCard from "./ActorCard/ActorCard";
import ActorModal from "./ActorModal/ActorModal";
import { actorApi } from "../../../core/api/actorApi";
import { ActorDto } from "../../../core/api/types/types.actor";
import ConfirmModal from '../../ConfirmModal/ConfirmModal';
import StandardPagination from "../../../shared/components/Pagination/StandardPagination";

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
  }, [currentPage]);

  const loadActors = async (page: number = currentPage) => {
    try {
      const response = await actorApi.filter({ pageIndex: page, pageSize });
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

      const tempActor: ActorDto = {
        id: created.id,
        firstName: newActor.name,
        lastName: newActor.surname,
        photoUrl: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setActors((prev) => [...prev, tempActor]);
      setCurrentActor(tempActor);
      setIsPhotoStep(true); 
    } catch (error) {
    }
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
    <AdminLayout>
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
          onChange={(_event, page) => setCurrentPage(page)}/>
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

