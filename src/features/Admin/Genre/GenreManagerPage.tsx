import React, { useState, useEffect, useMemo } from 'react'; // Додали useMemo
import './GenreManagerPage.css';
import AdminLayout from '../AdminLayout';
import { GenreDto } from '../../../core/api/types/types.genre';
import ConfirmModal from '../../ConfirmModal/ConfirmModal';
import AdminActions from '../AdminActions/AdminActions';

import {
  getAllGenres,
  createGenre,
  updateGenre,
  deleteGenre,
} from '../../../core/api/genreApi';

const GenreManagerPage: React.FC = () => {
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [newGenre, setNewGenre] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(''); // Стан для пошукового запиту
  const [editingGenre, setEditingGenre] = useState<number | null>(null); // Зберігаємо id жанру для редагування
  const [editedGenre, setEditedGenre] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [genreToDelete, setGenreToDelete] = useState<number | null>(null); // Зберігаємо id жанру для видалення

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getAllGenres();
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  // Фільтруємо жанри на основі пошукового запиту
  const filteredGenres = useMemo(() => {
    if (!searchQuery) {
      return genres; // Якщо пошуковий запит порожній, показуємо всі жанри
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return genres.filter(genre =>
      genre.name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [genres, searchQuery]); // Перераховуємо, коли змінюється список жанрів або запит

  const handleAddGenre = async () => {
    if (newGenre.trim() === '') return;
    try {
      const data = await createGenre({ name: newGenre });
      // Додаємо новий жанр на початок списку та очищаємо поле вводу
      // Оновлюємо оригінальний список жанрів
      setGenres([
        {
          id: data.id,
          name: newGenre,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
        ...genres,
      ]);
      setNewGenre('');
    } catch (error) {
      console.error('Error adding genre:', error);
    }
  };

  // Приймаємо id жанру для видалення
  const confirmDeleteGenre = (genreId: number) => {
    setGenreToDelete(genreId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (genreToDelete !== null) {
      try {
        await deleteGenre(genreToDelete);
        // Фільтруємо оригінальний список за id
        const updatedGenres = genres.filter(genre => genre.id !== genreToDelete);
        setGenres(updatedGenres);
      } catch (error) {
        console.error('Error deleting genre:', error);
      } finally {
        setGenreToDelete(null);
        setShowModal(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setGenreToDelete(null);
    setShowModal(false);
  };

  // Приймаємо id жанру для редагування
  const handleEditGenre = (genreId: number) => {
    if (editingGenre === genreId) {
      // Якщо вже редагуємо цей жанр, скасовуємо редагування
      setEditingGenre(null);
      setEditedGenre('');
    } else {
      // Знаходимо жанр в оригінальному списку за id
      const genreToEdit = genres.find(genre => genre.id === genreId);
      if (genreToEdit) {
        setEditingGenre(genreId);
        setEditedGenre(genreToEdit.name);
      }
    }
  };

  const handleSaveEditedGenre = async () => {
    if (editedGenre.trim() === '' || editingGenre === null) return;

    try {
      // Оновлюємо жанр за його id
      await updateGenre(editingGenre, { name: editedGenre });

      // Оновлюємо оригінальний список жанрів
      const updatedGenres = genres.map(genre =>
        genre.id === editingGenre ? { ...genre, name: editedGenre } : genre
      );
      setGenres(updatedGenres);
      setEditingGenre(null);
      setEditedGenre('');
    } catch (error) {
      console.error('Error updating genre:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEditedGenre();
    }
  };

  return (
    <AdminLayout>
      <div className="genres-page">
        <div className="top-bar-wrapper">
          <h1 className="title">Жанри</h1>
          <div className="top-bar">
            {/* Поле вводу для пошуку */}
            <input
              className="search-input"
              type="text"
              placeholder="Пошук за назвою..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Поле вводу для додавання нового жанру */}
             <input
              className="new-genre-input" // Новий клас для поля додавання
              type="text"
              placeholder="Назва нового жанру"
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddGenre(); }} // Додаємо по Enter
            />
            <button className="add-genre-btn" onClick={handleAddGenre}>
              Додати новий жанр
            </button>
          </div>
        </div>
        <div className="genres-list">
          {/* Використовуємо відфільтрований список для рендерингу */}
          {filteredGenres.map((genre) => ( // Індекс більше не потрібен для ключів або логіки
            <div className="genre-item" key={genre.id}> {/* Використовуємо genre.id як key */}
              {/* Порівнюємо editingGenre (id) з поточним genre.id */}
              {editingGenre === genre.id ? (
                <input
                  type="text"
                  value={editedGenre}
                  onChange={(e) => setEditedGenre(e.target.value)}
                  onBlur={handleSaveEditedGenre} // Зберігаємо при втраті фокусу
                  onKeyDown={handleKeyDown} // Зберігаємо по Enter
                  className="edit-genre-input"
                  autoFocus
                />
              ) : (
                <span>{genre.name}</span>
              )}
              <AdminActions
                onEdit={() => handleEditGenre(genre.id)} // Передаємо id жанру
                onDelete={() => confirmDeleteGenre(genre.id)} // Передаємо id жанру
              />
            </div>
          ))}
          {/* Додаємо повідомлення, якщо немає результатів пошуку */}
           {filteredGenres.length === 0 && genres.length > 0 && searchQuery !== '' && (
              <div className="no-results">Нічого не знайдено за запитом "{searchQuery}"</div>
           )}
           {filteredGenres.length === 0 && genres.length === 0 && (
               <div className="no-genres">Жанрів ще немає. Додайте перший!</div>
           )}
        </div>

        {showModal && (
          <ConfirmModal
            message="Ви впевнені, що хочете видалити цей жанр?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default GenreManagerPage;