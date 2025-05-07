import React, { useEffect, useState } from "react";
import { ActorDto } from "../../../../core/api/types/types.actor";
import "./ActorModal.css";

export interface ActorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newActor: { name: string; surname: string }) => Promise<void>;
  onSubmitPhoto: (image: string | undefined) => Promise<void>;
  actor: ActorDto | null;
  isPhotoStep: boolean;
  onNextStep: () => void;
  onUpdatePhoto?: (image: string) => Promise<void>;
}

const ActorModal: React.FC<ActorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSubmitPhoto,
  actor,
  isPhotoStep,
  onNextStep,
}) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [image, setImage] = useState("");
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");

  const isEditing = !!actor;

  useEffect(() => {
    if (isOpen) {
      setName(actor?.firstName || "");
      setSurname(actor?.lastName || "");
      setImage(actor?.photoUrl || "");
      setNameError("");
      setSurnameError("");
    }
  }, [isOpen, actor]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains("actor-modal-backdrop")) {
      onClose();
    }
  };

  const handleSubmitNameSurname = async () => {
    let hasError = false;

    if (!name.trim()) {
      setNameError("Ім’я не може бути порожнім");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!surname.trim()) {
      setSurnameError("Прізвище не може бути порожнім");
      hasError = true;
    } else {
      setSurnameError("");
    }

    if (hasError) return;

    await onSubmit({ name, surname });
    onNextStep();
  };

  const handleSubmitPhoto = async () => {
    const photoUrl = actor?.photoUrl || "";
    const imageChanged = image !== photoUrl;
    const hasNewImage = image !== "";

    if (imageChanged && hasNewImage) {
      await onSubmitPhoto(image);
    } else {
      await onSubmitPhoto(undefined);
    }
    onClose();
  };

  const handleSubmit = async () => {
    if (isPhotoStep) {
      await handleSubmitPhoto();
    } else {
      await handleSubmitNameSurname();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="actor-modal-backdrop" onClick={handleBackdropClick}>
      <div className="actor-modal-window">
        <button className="actor-modal-close-button" onClick={onClose}>×</button>
        <div className="actor-modal-form">
          <div className="actor-modal-form-left">
            {!isPhotoStep ? (
              <>
                <label>Імʼя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введіть імʼя актора"
                  className={nameError ? "input-error-border" : ""}
                />
                <p className="input-error">{nameError || "\u00A0"}</p>

                <label>Прізвище</label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Введіть прізвище актора"
                  className={surnameError ? "input-error-border" : ""}
                />
                <p className="input-error">{surnameError || "\u00A0"}</p>
              </>
            ) : (
              <>
                <div
                  className="actor-modal-image-preview"
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  <img src={image || "/default-user.webp"} alt="actor" key={image} />
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </div>
                <div className="actor-modal-image-headline">
                  <p>Завантажити фото актора</p>
                </div>
              </>
            )}
          </div>
        </div>
        <button className="actor-modal-submit-button" onClick={handleSubmit}>
          {!isPhotoStep ? (isEditing ? "Оновити дані" : "Далі") : (isEditing ? "Додати фото" : "Додати актора")}
        </button>
      </div>
    </div>
  );
};

export default ActorModal;

