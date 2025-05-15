import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import {
    getAllCinemaHalls,
    createCinemaHall,
    updateCinemaHall,
    deleteCinemaHall,
} from '../../../core/api/requests/request.cinemahall.ts';
import { CinemaHallDto } from '../../../core/api/types/types.cinemahall.ts';
import AdminLayout from '../AdminLayout';
import AdminActions from '../AdminActions/AdminActions';
import ConfirmModal from '../../ConfirmModal/ConfirmModal';
import './CinemaHallManagerPage.css';
import { useState, useEffect } from 'react';

const CinemaHallManagerPage = () => {
    const [halls, setHalls] = useState<CinemaHallDto[]>([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [cinemahallToDelete, setHallToDelete] = useState<number | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [seatsPerRowInput, setSeatsPerRowInput] = useState('');
    const [selectedHall, setSelectedHall] = useState<Partial<CinemaHallDto>>({
        name: '',
        seatsPerRow: [],
    });
    const [nameError, setNameError] = useState('');
    const [seatsError, setSeatsError] = useState('');

    const fetchHalls = async () => {
        const data = await getAllCinemaHalls();
        setHalls(data.reverse());
    };

    useEffect(() => {
        fetchHalls();
    }, []);

    const handleOpen = (hall?: CinemaHallDto) => {
        if (hall) {
            setSelectedHall(hall);
            setSeatsPerRowInput(hall.seatsPerRow.join(', '));
            setEditMode(true);
        } else {
            setSelectedHall({ name: '', seatsPerRow: [] });
            setSeatsPerRowInput('');
            setEditMode(false);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedHall({ name: '', seatsPerRow: [] });
        setSeatsPerRowInput('');
        setNameError('');
        setSeatsError('');
    };

    const handleSeatsPerRowInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeatsPerRowInput(e.target.value);
    };

    const handleSubmit = async () => {
        let hasError = false;
        setNameError('');
        setSeatsError('');

        if (!selectedHall.name?.trim()) {
            setNameError('Назва кінозалу обовʼязкова');
            hasError = true;
        }

        if (!seatsPerRowInput.trim()) {
            setSeatsError('Вкажіть кількість місць у кожному ряді');
            hasError = true;
        }

        const seatsPerRow = seatsPerRowInput
            .split(',')
            .map((s) => parseInt(s.trim()))
            .filter((n) => !isNaN(n) && n > 0);

        if (seatsPerRow.length === 0) {
            setSeatsError('Некоректний формат. Введіть додатні числа через кому');
            hasError = true;
        }

        if (hasError) return;

        if (editMode && selectedHall.id) {
            await updateCinemaHall(selectedHall.id, {
                name: selectedHall.name!,
                seatsPerRow,
            });
        } else {
            await createCinemaHall({
                name: selectedHall.name!,
                seatsPerRow,
            });
        }

        await fetchHalls();
        handleClose();
    };

    const confirmDeleteHall = (index: number) => {
        setHallToDelete(index);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        if (cinemahallToDelete !== null) {
            const hallId = halls[cinemahallToDelete].id;
            try {
                await deleteCinemaHall(hallId);
                const updatedHalls = halls.filter((_, i) => i !== cinemahallToDelete);
                setHalls(updatedHalls);
            } catch (error) {
                console.error('Error deleting hall:', error);
            } finally {
                setHallToDelete(null);
                setShowModal(false);
            }
        }
    };

    const handleCancelDelete = () => {
        setHallToDelete(null);
        setShowModal(false);
    };

    return (
        <AdminLayout>
            <Box>
                <div className="cinema-container">
                    <div className="cinema-header">
                        <h2>Кінозали</h2>
                        <Button onClick={() => handleOpen()} className="hall-add-button" variant="contained">
                            Додати новий кінозал 
                        </Button>
                    </div>

                    <div className="hall-table-container">
                        <div className="hall-table-header">
                            <span className='hall-name'>Назва</span>
                            <span>Кількість рядів</span>
                            <span>Кількість місць у ряді</span>
                            <span>Макс.к-сть відвідувачів</span>
                            <span className="hall-actions-header">Дії</span>
                        </div>
                        {halls.map((hall, index) => (
                            <div key={hall.id} className="hall-table-row">
                                <span>{hall.name}</span>
                                <span>{hall.numberOfRows}</span>
                                <span>{hall.seatsPerRow.join(', ')}</span>
                                <span>{hall.totalCapacity}</span>
                                <span className="hall-actions">
                                    <AdminActions
                                        onEdit={() => handleOpen(hall)}
                                        onDelete={() => confirmDeleteHall(index)}
                                    />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <Dialog open={open} onClose={handleClose} fullWidth>
                    <DialogTitle>{editMode ? 'Редагувати кінозал' : 'Додати кінозал'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Назва"
                            fullWidth
                            value={selectedHall.name}
                            onChange={(e) => setSelectedHall({ ...selectedHall, name: e.target.value })}
                            error={!!nameError}
                            helperText={nameError}
                            margin="normal"
                            sx={{
                                '& .MuiInputLabel-root:not(.Mui-focused)': {
                                    color: 'white',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white',
                                },
                            }}
                        />
                        <TextField
                            label="Кількість місць у кожному ряді (через кому)"
                            fullWidth
                            value={seatsPerRowInput}
                            error={!!seatsError}
                            helperText={seatsError}
                            onChange={handleSeatsPerRowInputChange}
                            margin="normal"
                            sx={{
                                '& .MuiInputLabel-root:not(.Mui-focused)': {
                                    color: 'white',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'white',
                                },
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} className="cinemahall-cancel-button-style">Скасувати</Button>
                        <Button onClick={handleSubmit} className="cinemahall-add-button-style" variant="contained">
                            {editMode ? 'Оновити' : 'Додати'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {showModal && (
                    <ConfirmModal
                        message="Ви впевнені, що хочете видалити цей кінозал?"
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    />
                )}
            </Box>
        </AdminLayout>
    );
};

export default CinemaHallManagerPage;
