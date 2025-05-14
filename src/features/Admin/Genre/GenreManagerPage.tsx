import React, { useState, useEffect } from 'react';
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
  const [editingGenre, setEditingGenre] = useState<number | null>(null);
  const [editedGenre, setEditedGenre] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [genreToDelete, setGenreToDelete] = useState<number | null>(null);

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

  const handleAddGenre = async () => {
    if (newGenre.trim() === '') return;
    try {
      const data = await createGenre({ name: newGenre });
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

  const confirmDeleteGenre = (index: number) => {
    setGenreToDelete(index);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (genreToDelete !== null) {
      const genreId = genres[genreToDelete].id;
      try {
        await deleteGenre(genreId);
        const updatedGenres = genres.filter((_, i) => i !== genreToDelete);
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

  const handleEditGenre = (index: number) => {
    if (editingGenre === index) {
      setEditingGenre(null);
      setEditedGenre('');
    } else {
      setEditingGenre(index);
      setEditedGenre(genres[index].name);
    }
  };

  const handleSaveEditedGenre = async () => {
    if (editedGenre.trim() === '') return;
    const genreId = genres[editingGenre!].id;
    try {
      await updateGenre(genreId, { name: editedGenre });

      const updatedGenres = genres.map((genre, index) =>
        index === editingGenre ? { ...genre, name: editedGenre } : genre
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
            <input
              className="search-input"
              type="text"
              placeholder=""
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
            />
            <button className="add-genre-btn" onClick={handleAddGenre}>
              Додати новий жанр
            </button>
          </div>
        </div>
        <div className="genres-list">
          {genres.map((genre, index) => (
            <div className="genre-item" key={genre.id}>
              {editingGenre === index ? (
                <input
                  type="text"
                  value={editedGenre}
                  onChange={(e) => setEditedGenre(e.target.value)}
                  onBlur={handleSaveEditedGenre}
                  onKeyDown={handleKeyDown}
                  className="edit-genre-input"
                  autoFocus
                />
              ) : (
                <span>{genre.name}</span>
              )}
              <AdminActions
                onEdit={() => handleEditGenre(index)}
                onDelete={() => confirmDeleteGenre(index)}
                />
            </div>
          ))}
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