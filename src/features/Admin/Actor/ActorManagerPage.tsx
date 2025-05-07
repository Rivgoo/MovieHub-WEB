import { Box } from "@mui/material";
import AdminLayout from "../AdminLayout";
import "./ActorManagerPage.css";
import React, { useState, useEffect } from "react";
import ActorCard from "./ActorCard/ActorCard";
import ActorModal from "./ActorModal/ActorModal";
import { actorApi } from "../../../core/api/actorApi";
import { ActorDto } from "../../../core/api/types/types.actor";
import ConfirmModal from '../../ConfirmModal/ConfirmModal';

const ActorManagerPage: React.FC = () => {
  const [actors, setActors] = useState<ActorDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentActor, setCurrentActor] = useState<ActorDto | null>(null);
  const [isPhotoStep, setIsPhotoStep] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actorIdToDelete, setActorIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadActors();
  }, []);

  const loadActors = async () => {
    try {
      const response = await actorApi.filter({ pageIndex: 1, pageSize: 100 });
      setActors(response.items || []);
    } catch (error) {
      console.error("Помилка при завантаженні акторів", error);
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
        console.error("Помилка при видаленні актора", error);
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
      console.error("Помилка при створенні актора", error);
    }
  };

  const handleActorPhotoSubmit = async (base64Image: string | undefined) => {
    console.log("Submitting new image: ", base64Image);  // Для перевірки
  
    try {
      if (!currentActor) {
        alert("Актор не вибраний");
        return;
      }
      if (!base64Image) {
        alert("Нове фото не вибрано");
        return;
      }
      const actorId = currentActor.id;
      const cleanedBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
  
      // @ts-ignore
      const response = await actorApi.uploadPhoto(actorId, {
        base64Image: cleanedBase64,
      });
  
      await loadActors();
      setIsModalOpen(false);
      setIsPhotoStep(false);
    } catch (error) {
      console.error("Помилка при завантаженні фото", error);
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
      console.error("Помилка при оновленні імені-прізвища актора", error);
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

