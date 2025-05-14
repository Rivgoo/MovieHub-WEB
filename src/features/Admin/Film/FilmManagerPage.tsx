import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import AdminLayout from '../AdminLayout';
import Header from '../Header/Header';
import FilmCard from './FilmCard/FilmCard';
import './FilmManagerStyles.css';
import FilmForm, { FilmData } from './FilmForm/FilmForm';
import { contentApi } from '../../../core/api/contentApi';
import { actorApi } from '../../../core/api/actorApi';
import { ContentDto } from '../../../core/api/types/types.content';
import ConfirmModal from '../../ConfirmModal/ConfirmModal';
import StandardPagination from '../../../shared/components/Pagination/StandardPagination';

const FilmManagerPage = () => {
  const [films, setFilms] = useState<ContentDto[]>([]);
  const [isAddingFilm, setIsAddingFilm] = useState(false);
  const [editingFilm, setEditingFilm] = useState<ContentDto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [_, setIsFormOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [filmIdToDelete, setFilmIdToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const pageSize = 12;

  const loadFilms = async (page: number = currentPage) => {
    try {
      const params: Record<string, any> = {
        pageIndex: page,
        pageSize,
      };

      if (searchTerm) {
        params.SearchTerms = searchTerm;
      }

      if (filterValues['MinРік випуску']) {
        params.MinReleaseYear = parseInt(filterValues['MinРік випуску']);
      }

      if (filterValues['MaxРік випуску']) {
        params.MaxReleaseYear = parseInt(filterValues['MaxРік випуску']);
      }

      if (filterValues['MaxРейтинг']) {
        params.MaxRating = parseFloat(filterValues['MaxРейтинг']);
      }

      if (filterValues['MinРейтинг']) {
        params.MinRating = parseFloat(filterValues['MinРейтинг']);
      }

      if (filterValues['MaxРейтинг']) {
        params.MaxRating = parseFloat(filterValues['MaxРейтинг']);
      }

      if (filterValues['MinТривалість']) {
        params.MinDurationMinutes = parseInt(filterValues['MinТривалість']);
      }

      if (filterValues['MaxТривалість']) {
        params.MaxDurationMinutes = parseInt(filterValues['MaxТривалість']);
      }

      const response = await contentApi.filter(params);
      setFilms(response.items || []);
      setTotalPages(Math.ceil((response.totalCount || 0) / pageSize));
    } catch (error) {
      setFilms([]);
    }
  };

  useEffect(() => {
    loadFilms();
  }, [currentPage, searchTerm, filterValues]);

  const handleAddFilm = () => {
    setEditingFilm(null);
    setIsAddingFilm(true);
    setIsFormOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilterValues({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleDeleteFilm = (id: number) => {
    setFilmIdToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (filmIdToDelete !== null) {
      try {
        await contentApi.delete(filmIdToDelete);
        await loadFilms();
      } catch (error) {
      } finally {
        setFilmIdToDelete(null);
        setIsConfirmModalOpen(false);
      }
    }
  };

  const cancelDelete = () => {
    setFilmIdToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const handleEditFilm = async (film: ContentDto) => {
    try {
      const actorIds = film.actorIds || [];
      const actorsPromises = actorIds.map(async (actorId) => {
        const actorDetails = await actorApi.getActorInContent(actorId, film.id);
        return {
          id: actorDetails?.id,
          firstName: actorDetails?.firstName,
          lastName: actorDetails?.lastName,
          fullName: `${actorDetails?.firstName} ${actorDetails?.lastName}`,
          RoleName: actorDetails?.roleName,
        };
      });
      const actors = await Promise.all(actorsPromises);
      const enrichedFilm = {
        ...film,
        actors,
      };
      setEditingFilm(enrichedFilm);
      setIsAddingFilm(true);
      setIsFormOpen(true);
    } catch (error) {
      console.error(
        'Помилка при отриманні повної інформації про акторів:',
        error
      );
    }
  };

  const handleFilmFormSubmit = async (data: FilmData) => {
    try {
      const isEditMode = !!editingFilm;
      let contentId = editingFilm?.id;
      if (isEditMode && contentId) {
        await contentApi.update(contentId, {
          title: data.title,
          description: data.description,
          rating: data.rating ?? 0,
          releaseYear: parseInt(data.releaseYear),
          trailerUrl: data.trailerUrl || '',
          durationMinutes: parseInt(data.duration),
          ageRating: parseInt(data.ageRating),
          directorFullName: data.directorFullName,
          genreIds: data.genres.map((g) => g.id),
          actorIds: data.actors.map((a) => a.id),
        });

        const content = await contentApi.getGenres(contentId);
        const existingGenres: number[] = content.genreIds;
        const existingActorIds: number[] = content.actorIds;

        const genreIdsToKeep = data.genres.map((g) => g.id);

        const genreIdsToRemove = existingGenres.filter(
          (existing) => !genreIdsToKeep.includes(existing)
        );

        for (const genreId of genreIdsToRemove) {
          try {
            await contentApi.removeGenre(contentId, genreId);
          } catch (error) {
            console.error(`Не вдалося видалити жанр ${genreId}`, error);
          }
        }

        for (const genre of data.genres) {
          try {
            await contentApi.addGenre(contentId, genre.id);
          } catch (error: any) {
            if (error?.response?.data?.code === 'ContentGenre.AlreadyExists') {
              try {
                await contentApi.removeGenre(contentId, genre.id);
                await contentApi.addGenre(contentId, genre.id);
              } catch (removeError) {
                console.error(
                  `Не вдалося переприв'язати жанр ${genre.id}`,
                  removeError
                );
              }
            } else {
              throw error;
            }
          }
        }

        const actorIdsToKeep = data.actors.map((a) => a.id);
        const actorIdsToRemove = existingActorIds.filter(
          (existing) => !actorIdsToKeep.includes(existing)
        );

        for (const actorId of actorIdsToRemove) {
          try {
            await contentApi.removeActor(contentId, actorId);
          } catch (error) {
            console.error(`Не вдалося видалити актора ${actorId}`, error);
          }
        }

        for (const actor of data.actors) {
          try {
            await contentApi.addActor(
              contentId,
              actor.id,
              actor.RoleName || ''
            );
          } catch (error: any) {
            if (error?.response?.data?.code === 'ContentActor.AlreadyExists') {
              try {
                await contentApi.removeActor(contentId, actor.id);
                await contentApi.addActor(
                  contentId,
                  actor.id,
                  actor.RoleName || ''
                );
              } catch (removeError) {
                console.error(
                  `Не вдалося переприв'язати актора ${actor.id}`,
                  removeError
                );
              }
            } else {
              throw error;
            }
          }
        }

        if (
          data.poster &&
          typeof data.poster === 'string' &&
          data.poster.startsWith('data:')
        ) {
          const cleanedBase64Poster = data.poster.replace(
            /^data:image\/\w+;base64,/,
            ''
          );
          await contentApi.uploadPoster(contentId, {
            base64Image: cleanedBase64Poster,
          });
        }

        if (
          data.banner &&
          typeof data.banner === 'string' &&
          data.banner.startsWith('data:')
        ) {
          const cleanedBase64Banner = data.banner.replace(
            /^data:image\/\w+;base64,/,
            ''
          );
          await contentApi.uploadBanner(contentId, {
            base64Image: cleanedBase64Banner,
          });
        }
      } else {
        const createRes = await contentApi.create({
          title: data.title,
          description: data.description,
          rating: data.rating ?? 0,
          releaseYear: parseInt(data.releaseYear),
          trailerUrl: data.trailerUrl || '',
          durationMinutes: parseInt(data.duration),
          ageRating: parseInt(data.ageRating),
          directorFullName: data.directorFullName,
          genreIds: [],
          actorIds: [],
        });
        contentId = createRes.id;

        if (
          data.poster &&
          typeof data.poster === 'string' &&
          data.poster.startsWith('data:')
        ) {
          const cleanedBase64Poster = data.poster.replace(
            /^data:image\/\w+;base64,/,
            ''
          );
          await contentApi.uploadPoster(contentId, {
            base64Image: cleanedBase64Poster,
          });
        }

        if (
          data.banner &&
          typeof data.banner === 'string' &&
          data.banner.startsWith('data:')
        ) {
          const cleanedBase64Banner = data.banner.replace(
            /^data:image\/\w+;base64,/,
            ''
          );
          await contentApi.uploadBanner(contentId, {
            base64Image: cleanedBase64Banner,
          });
        }

        for (const genre of data.genres) {
          await contentApi.addGenre(contentId, genre.id);
        }

        for (const actor of data.actors) {
          await contentApi.addActor(contentId, actor.id, actor.RoleName || '');
        }
      }
      await loadFilms();
      setIsAddingFilm(false);
      setEditingFilm(null);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Помилка при збереженні фільму:', error);
    }
  };

  return (
    <AdminLayout>
      <Box className="film-page-container">
        <div>
          {!isAddingFilm && (
            <Header
              filters={['Рейтинг', 'Рік випуску', 'Тривалість']}
              onSearch={handleSearch}
              onApplyFilters={(filters) => setFilterValues(filters)}
              onReset={handleResetFilters}
              onAdd={handleAddFilm}
            />
          )}
          {isAddingFilm ? (
            <>
              <FilmForm
                mode={editingFilm ? 'edit' : 'add'}
                initialData={
                  editingFilm
                    ? {
                        ...editingFilm,
                        releaseYear: String(editingFilm.releaseYear),
                        ageRating: String(editingFilm.ageRating),
                        duration: String(editingFilm.durationMinutes),
                        banner: editingFilm.bannerUrl,
                        poster: editingFilm.posterUrl,
                        actors:
                          editingFilm.actors?.map((actor) => ({
                            id: actor.id,
                            RoleName: actor.RoleName || '',
                            fullName:
                              actor.fullName ||
                              `${actor.firstName ?? ''} ${actor.lastName ?? ''}`.trim(),
                            firstName: actor.firstName ?? '',
                            lastName: actor.lastName ?? '',
                          })) ?? [],
                      }
                    : undefined
                }
                onSubmit={handleFilmFormSubmit}
                onCancel={() => {
                  setIsAddingFilm(false);
                  window.scrollTo(0, 0);
                }}
              />
            </>
          ) : null}
          {!isAddingFilm && (
            <>
              <Box className="film-grid">
                {films.map((film) => (
                  <FilmCard
                    key={film.id}
                    title={film.title}
                    duration={`${film.durationMinutes} хв`}
                    rating={film.rating}
                    imageUrl={film.posterUrl}
                    onEdit={() => {
                      handleEditFilm(film);
                    }}
                    onDelete={() => handleDeleteFilm(film.id)}
                    onClick={() => handleEditFilm(film)}
                  />
                ))}
              </Box>

              <StandardPagination
                sx={{ marginTop: '1em' }}
                count={totalPages}
                page={currentPage}
                onChange={(_event, page) => setCurrentPage(page)}
              />
            </>
          )}
        </div>

        {isConfirmModalOpen && (
          <ConfirmModal
            message="Ви впевнені, що хочете видалити цей фільм?"
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </Box>
    </AdminLayout>
  );
};

export default FilmManagerPage;
