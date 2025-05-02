import React, { useState, useEffect } from 'react';
import './GenreManagerPage.css';
import AdminLayout from '../AdminLayout';
import { GenreDto } from '../../../core/api/types/types.genre';

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
        const response = await fetch('https://movieposter.runasp.net/api/v1/genres');
        const data: GenreDto[] = await response.json();
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
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error('No access token found');
            return;
        }
        const response = await fetch('https://movieposter.runasp.net/api/v1/genres', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, 
            },
            body: JSON.stringify({ name: newGenre }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGenres([{ id: data.id, name: newGenre,  createdAt: data.createdAt,  updatedAt: data.updatedAt   }, ...genres]);
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
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.error('No access token found');
          return;
        }
  
        await fetch(`https://movieposter.runasp.net/api/v1/genres/${genreId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
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
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found');
        return;
      }
  
      await fetch(`https://movieposter.runasp.net/api/v1/genres/${genreId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: editedGenre }),
      });
  
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
              
            <div className="actions">
                <div className="btn-wrapper">
                    <button className="edit-btn" onClick={() => handleEditGenre(index)}>
                    </button>
                </div>
                <div className="btn-wrapper">
                    <button className="delete-btn" onClick={() => confirmDeleteGenre(index)}>
                    </button>
                </div>
            </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <p>Ви впевнені, що хочете видалити цей жанр?</p>
              <div className="modal-actions">
                <button className="confirm-btn" onClick={handleConfirmDelete}>Так</button>
                <button className="cancel-btn" onClick={handleCancelDelete}>Скасувати</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GenreManagerPage;

