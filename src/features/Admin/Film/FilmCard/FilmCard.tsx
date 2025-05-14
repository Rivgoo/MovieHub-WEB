import './FilmCard.css';
import AdminActions from '../../AdminActions/AdminActions';
import { FaClock, FaStar } from 'react-icons/fa';

type FilmCardProps = {
  title?: string;
  duration?: string;
  rating?: number;
  imageUrl?: string;
  onEdit: ()=> void;
  onDelete?: () => void;
  onClick: ()=> void;
};

const FilmCard = ({ 
  title = "", 
  duration = "", 
  rating = 0,  
  imageUrl = "",
  onEdit,
  onDelete,
  onClick,
}: FilmCardProps) => {
  const ratingInStars = Math.round(rating / 20); 

   return (
    <div className="film-card"> 
      <img src={imageUrl} alt={title} className="film-image" onClick={onClick} />
      <div className="film-content">
        <h3 className="film-title">{title}</h3>
        <div className="film-rating">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} color={i < ratingInStars ? "#f97316" : "#9ca3af"} />
          ))}
        </div>
        <div className="film-footer">
          <span className="film-duration"><FaClock /> {duration}</span>
          <AdminActions
            onEdit={onEdit}
            onDelete={onDelete ?? (() => {})}
          />
        </div>
      </div>
    </div>  
  );
};

export default FilmCard;




