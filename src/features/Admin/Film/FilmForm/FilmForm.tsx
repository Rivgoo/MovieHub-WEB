import {
  Box,
  Button,
  TextField,
  Typography,
  Popper,
  Rating,
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useState, useEffect} from 'react';
import './FilmForm.css';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import Autocomplete from '@mui/material/Autocomplete';
import { getAllGenres} from '../../../../core/api/genreApi';
import { GenreDto } from '../../../../core/api/types/types.genre';
import { actorApi as getActorById } from '../../../../core/api/actorApi'; 
import { ActorWithFullName } from '../../../../core/api/types/types.actor';

type FilmFormProps = {
  initialData?: Partial<FilmData>;
  onSubmit: (data: FilmData) => void;
  onCancel: () => void;
  mode?: 'add' | 'edit';
};

export type FilmData = {
  title: string;
  description: string;
  duration: string;
  releaseYear: string;
  rating: number | undefined;
  trailerUrl?: string | null;
  poster?: string | null;
  ageRating: string;
  directorFullName: string;
  banner?: string| null;
  genres: GenreDto[]; 
  actors: ActorWithFullName[]; 
  genreIds?: number[]; 
  actorIds?: number[]; 
};

const FilmForm = ({ initialData = {}, onSubmit, onCancel, mode = 'add' }: FilmFormProps) => {
    const initialRatingForDisplay = initialData.rating !== undefined ? initialData.rating / 10 : undefined;
  const [formData, setFormData] = useState<FilmData>({
    title: initialData.title || '',
    description: initialData.description || '',
    duration: initialData.duration || '',
    releaseYear: initialData.releaseYear || '',
    rating: initialData.rating !== undefined ? Math.max(1, Math.min(10, initialData.rating)) : undefined,
    trailerUrl: initialData.trailerUrl || '',
    poster: initialData.poster || null,
    ageRating: initialData.ageRating || '',
    directorFullName: initialData.directorFullName || '',
    banner: initialData.banner || null,
    genres: [],
    actors: [],
  });

  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [actors, setActors] = useState<ActorWithFullName[]>([]);
  const [displayRating, setDisplayRating] = useState<number | undefined>(initialRatingForDisplay);
  const [selectedGenres, setSelectedGenres] = useState<GenreDto[]>([]);
  const [selectedActors, setSelectedActors] = useState<ActorWithFullName[]>([]);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(initialData.banner || null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState<string | null>(initialData.poster || null);
  
useEffect(() => {
  const fetchInitialData = async () => {
    if (initialData.genreIds?.length) {
      try {
        const allGenres = await getAllGenres();
        const selected = allGenres.filter(g => initialData.genreIds!.includes(g.id));
        setSelectedGenres(selected);
      } catch (e) {
      }
    }
    if (initialData.actorIds?.length) {
  try {
    const response = await getActorById.filter({ pageIndex: 1, pageSize: 1000 });
    const allActors = (response.items || []).map(actor => ({
      ...actor,
      fullName: `${actor.firstName} ${actor.lastName}`,
    }));
    const selected = initialData.actorIds.map(actorId => {
      const actorFromAll = allActors.find(a => a.id === actorId);
      const actorFromInitial = (initialData.actors || []).find(a => a.id === actorId);
      return {
        ...actorFromAll,
        RoleName: actorFromInitial?.RoleName || '',
      } as ActorWithFullName;
    });
    setActors(allActors);
    setSelectedActors(selected);
  } catch (e) { 
  }
}};

 
  fetchInitialData();
}, [initialData.genreIds, initialData.actorIds, initialData.actors]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getAllGenres();
        setGenres(data);
      } catch (error) {
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await  getActorById.filter({ pageIndex: 1, pageSize: 1000 });
        const actorsWithFullName: ActorWithFullName[] = (response.items || []).map(actor => ({
          ...actor,
          fullName: `${actor.firstName} ${actor.lastName}`,
          RoleName: "",
        }));
        setActors(actorsWithFullName);
      } catch (error) {
      }
    };
    fetchActors();
  }, []);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleRatingChange = (newValue: number | null) => {
        setDisplayRating(newValue !== null ? newValue : undefined);
        setFormData((prev) => ({ ...prev, rating: newValue !== null ? newValue * 10 : undefined }));
    };

    const handleRatingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setDisplayRating(isNaN(value) ? undefined : Math.max(1, Math.min(10, value)));
        setFormData((prev) => ({ ...prev, rating: isNaN(value) ? undefined : Math.max(1, Math.min(10, value)) * 10 }));
    };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [name]: reader.result as string }));
        if (name === 'banner') {
          setBannerPreviewUrl(reader.result as string);
        } else if (name === 'poster') {
          setPosterPreviewUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      if (name === 'banner') setBannerPreviewUrl(null);
      else if (name === 'poster') setPosterPreviewUrl(null);
    }
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const formattedActors = selectedActors.map(actor => ({
    id: actor.id,
    fullName: actor.fullName,
    RoleName: actor.RoleName,
    firstName: actor.firstName,
    lastName: actor.lastName,
  }));
  onSubmit({
    ...formData,
    genres: selectedGenres,
    actors: formattedActors,
    rating: formData.rating !== undefined ? formData.rating : 0,
  });
};

  const getYoutubeVideoId = (url: string | undefined | null): string | null => {
    if (!url) {
      return null;
    }
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

return (

  <Box component="form" onSubmit={handleSubmit} className="film-form">
  <Typography variant="h5" className="form-title">
    {mode === 'edit' ? 'Редагувати фільм' : 'Додати новий фільм'}
  </Typography>
  <div className="form-grid">
    <div className="form-col">
      <TextField
        label="Назва"
        name="title"
        value={formData.title}
        onChange={handleChange}
        fullWidth
       required
      />
    </div>
    <div className="form-col">
      <TextField
        label="Рік випуску"
        name="releaseYear"
        value={formData.releaseYear}
        onChange={handleChange}
        required
        fullWidth
      />
    </div>

      <div className="form-col wide">
    <Typography>Рейтинг (1-10)</Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Rating
            name="rating"
            value={displayRating !== undefined ? displayRating : 0}
            max={10}
            precision={0.5}
            onChange={(_, newValue) => {
                handleRatingChange(newValue);
            }}
            emptyIcon={<StarBorderIcon style={{ color: 'white' }} />}
        />
        <TextField
            type="number"
            inputProps={{ min: 1, max: 10, step: 0.5 }}
            value={displayRating}
            onChange={handleRatingInputChange}
            sx={{ width: '100px' }}
        />
    </Box>

      <div className="form-col">
        <Autocomplete
          multiple
          options={genres}
          getOptionLabel={(option) => option.name}
          value={selectedGenres}
          onChange={(_, newValue) => {
            setSelectedGenres(newValue);
          }}
          filterSelectedOptions
          disableClearable
          componentsProps={{
            popper: {
              modifiers: [
                { name: 'flip', enabled: false },
                { name: 'preventOverflow', options: { boundary: 'viewport' } },
                { name: 'offset', options: { offset: [0, 8] } },
              ],
            },
          }}
          PopperComponent={(props) => <Popper {...props} placement="bottom-start" />}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Жанри"
              fullWidth
              sx={{
                '& .MuiAutocomplete-endAdornment .MuiSvgIcon-root': {
                  color: 'white',
                },
              }}
            />
          )}
        />
      </div>

      <Autocomplete
        multiple
        options={actors}
        getOptionLabel={(option) => option.fullName || ''}
        value={selectedActors.map((actor) => ({
          id: actor.id,
          fullName: actor.fullName,
          RoleName: actor.RoleName || '',
        }))}
        onChange={(_, newValue) => {
          const updatedActorsWithRole = newValue.map((item) => {
            const original = actors.find((a) => a.id === item.id);
            const existing = selectedActors.find((a) => a.id === item.id);
            return {
              id: item.id,
              fullName: item.fullName,
              RoleName: existing?.RoleName || '',
              firstName: original?.firstName || '',
              lastName: original?.lastName || '',
            };
          });
           console.log("🆕 Оновлений список акторів:", updatedActorsWithRole);

          setSelectedActors(updatedActorsWithRole);
          setFormData((prev) => ({
            ...prev,
            actors: updatedActorsWithRole,
          }));
        }}
        filterSelectedOptions
        disableClearable
        componentsProps={{
          popper: {
            modifiers: [
              { name: 'flip', enabled: false },
              { name: 'offset', options: { offset: [0, 8] } },
            ],
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Акторський склад"
            fullWidth
            sx={{
              '& .MuiAutocomplete-endAdornment .MuiSvgIcon-root': {
                color: 'white',
              },
            }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Box
              key={option.id}
              sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}
            >
              <Typography sx={{ width: 120 }}>{option.fullName}</Typography>
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  const inputElement = e.currentTarget.querySelector('input');
                  if (inputElement) inputElement.focus();
                }}
              >
                <TextField
                  {...getTagProps({ index })}
                  label="Роль"
                  value={option.RoleName || ''}
                  onChange={(e) => {
                    const updatedSelectedActors = selectedActors.map((actor) =>
                      actor.id === option.id ? { ...actor, RoleName: e.target.value } : actor
                    );
                    setSelectedActors(updatedSelectedActors);
                    setFormData((prev) => ({
                      ...prev,
                      actors: updatedSelectedActors,
                    }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' || e.key === 'Delete') {
                      e.stopPropagation();
                    }
                  }}
                  size="small"
                  sx={{ marginLeft: 2, height: '40px', width: 150 }}
                  InputLabelProps={{ style: { fontSize: '0.6rem !important' } }}
                />
              </Box>
            </Box>
          ))
        }
      />
    </div>

    <div className="form-col wide">
      <Typography className="upload-label">Завантажити постер</Typography>
      <Box className="poster-box">
        <input
          type="file"
          accept="image/*"
          name="poster"
          onChange={handleFileChange}
          className="hidden-input"
          id="poster-upload"
        />
        <label htmlFor="poster-upload" className="poster-placeholder">
          {posterPreviewUrl ? (
            <img src={posterPreviewUrl} alt="Попередній перегляд постера" className="image-preview" />
          ) : (
            <PhotoCameraIcon fontSize="large" />
          )}
        </label>
      </Box>
    </div>

    <div className="form-col fixed-width">
      <Typography className="upload-label">Завантажити банер</Typography>
      <Box className="banner-box">
        <input
          type="file"
          accept="image/*"
          name="banner"
          onChange={handleFileChange}
          className="hidden-input"
          id="banner-upload"
        />
        <label htmlFor="banner-upload" className="banner-placeholder">
          {bannerPreviewUrl ? (
            <img src={bannerPreviewUrl} alt="Попередній перегляд банера" className="image-preview" />
          ) : (
            <PhotoCameraIcon fontSize="large" />
          )}
        </label>
      </Box>
    </div>

    <div className="form-col fixed-width">
      <TextField
        name="trailerUrl"
        label="Посилання на трейлер"
        value={formData.trailerUrl}
        onChange={handleChange}
        fullWidth
      />
      <div style={{ marginTop: '17px', position: 'relative', cursor: 'pointer' }}>
        {getYoutubeVideoId(formData.trailerUrl) ? (
          <iframe
            width="100%"
            height="200"
            src={`https://www.youtube.com/embed/${getYoutubeVideoId(formData.trailerUrl)}`}
            title="Трейлер фільму"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: '8px' }}
          ></iframe>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: 200,
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed #ccc',
            }}
          >
            <PlayCircleFilledIcon style={{ fontSize: '64px', color: 'rgb(119 119 119)' }} />
          </Box>
        )}
      </div>
    </div>

    <div className="form-col wide-on-desktop">
      <div className="form-col">
        <TextField
          label="Тривалість(хв)"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          fullWidth
          required
        />
      </div>

      <div className="form-col">
        <TextField
          label="Режисер"
          name="directorFullName"
          value={formData.directorFullName}
          onChange={handleChange}
          fullWidth
          required
        />
      </div>

      <div className="form-col">
        <TextField
          label="Мінімальний вік перегляду"
          name="ageRating"
          value={formData.ageRating}
          onChange={handleChange}
          fullWidth
          required
        />
      </div>
    </div>

    <div className="form-col wide-on-desktop description-container">
      <TextField
        label="Опис"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={4}
        required
        fullWidth
      />
    </div>
  </div>

  <Box className="add-film-button-container" sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, margin: '0 auto' }}>
    <Button type="submit" variant="contained" className="film-submit-btn">
      {mode === 'edit' ? 'Зберегти зміни' : 'Додати фільм'}
    </Button>
    <Button variant="outlined" color="secondary" className="film-submit-btn cancel" onClick={onCancel}>
      Скасувати
    </Button>
  </Box>
</Box>
  
    );
 };

 export default FilmForm;
