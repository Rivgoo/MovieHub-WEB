import React, { useEffect, useState } from "react";
import "./ActorCard.css";
import AdminActions from "../../AdminActions/AdminActions";

type ActorCardProps = {
  name: string;
  image: string;
  onEdit: () => void;
  onDelete: () => void;
};

const DEFAULT_IMAGE = "/default-user.webp";

const ActorCard: React.FC<ActorCardProps> = ({ name, image, onEdit, onDelete }) => {
  const [imgSrc, setImgSrc] = useState(DEFAULT_IMAGE);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => setImgSrc(image);
    img.onerror = () => setImgSrc(DEFAULT_IMAGE); 
  }, [image]);

  return (
    <div className="actor-card">
      <img
        className="actor-image"
        src={imgSrc}
        alt={name}
      />
      <p className="actor-name">{name}</p>
      <AdminActions onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};

export default ActorCard;