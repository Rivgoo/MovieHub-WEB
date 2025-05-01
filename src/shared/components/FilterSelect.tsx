// src/shared/components/FilterSelect.tsx
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled, alpha } from '@mui/material/styles'; // Додано alpha для прозорості
// Імпортуємо тип опції з файлу констант
import { FilterOption } from '../constants/FilterOptions';

// --- ОНОВЛЕННЯ СТИЛІВ МЕНЮ ---
const StyledMenu = styled(Menu)(({ theme }) => {
    // Визначаємо кольори для темної теми меню (можна взяти з theme.palette)
    const menuBackgroundColor = '#505050'; // Трохи інший темний фон для контрасту
    const menuTextColor = '#F5F5F5'; // Світлий текст (LightGray з вашої теми)
    const selectedItemBg = alpha(theme.palette.primary.main, 0.15); // Напівпрозорий помаранчевий фон для вибраного
    const hoverItemBg = alpha('#FFFFFF', 0.08); // Напівпрозорий білий фон при наведенні
    const menuBorderColor = alpha('#FFFFFF', 0.12); // Колір рамки (як divider)

    return {
        '& .MuiPaper-root': { // Стилізуємо "папірець" меню
            borderRadius: 6,
            marginTop: theme.spacing(0.5), // Зменшено відступ зверху
            minWidth: 180,
            color: menuTextColor,           // <--- Застосовуємо колір тексту
            backgroundColor: menuBackgroundColor, // <--- Застосовуємо фон меню
            boxShadow: 'none', // Без тіні
            border: `1px solid ${menuBorderColor}`, // <--- Рамка меню
            '& .MuiMenu-list': {
                padding: '4px 0',
            },
            '& .MuiMenuItem-root': { // Стилізуємо пункти меню
                fontSize: '0.9rem',
                // Колір тексту вже успадкований від .MuiPaper-root
                '&:active': { // При кліку
                    backgroundColor: hoverItemBg, // Використовуємо той самий фон, що й при наведенні
                },
                '&.Mui-selected': { // Вибраний пункт
                    backgroundColor: selectedItemBg, // <--- Фон вибраного
                    fontWeight: 'bold',
                    '&:hover': { // Наведення на вибраний (залишаємо фон вибору)
                        backgroundColor: selectedItemBg,
                    }
                },
                '&:hover': { // Наведення на НЕвибраний
                    backgroundColor: hoverItemBg, // <--- Фон при наведенні
                }
            },
        },
    };
});
// --- КІНЕЦЬ ОНОВЛЕННЯ СТИЛІВ ---

// Пропси для компонента (без змін)
interface CustomFilterSelectProps {
    id: string;
    label: string;
    options: FilterOption[];
    selectedValue: string | number | null;
    onChange: (value: string | number | null) => void;
    buttonSx?: object;
    menuSx?: object; // menuSx тепер може бути менш потрібним
    allowReset?: boolean;
}

const FilterSelect: React.FC<CustomFilterSelectProps> = ({
    id,
    label,
    options,
    selectedValue,
    onChange,
    buttonSx,
    // menuSx, // Можна прибрати, якщо стилі меню тепер жорстко задані
    allowReset = true,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleMenuItemClick = (value: string | number | null) => {
        onChange(value);
        handleClose();
    };

    const selectedOptionLabel = options.find(option => option.value === selectedValue)?.label;
    const buttonText = selectedOptionLabel || label;

    const needsResetOption = allowReset && selectedValue !== null && selectedValue !== '' && selectedValue !== 0 && selectedValue !== 'all' && selectedValue !== 'any';
    const resetValue = options.find(opt => ['all', 'any', '', 0].includes(opt.value as any))?.value ?? null;

    return (
        <>
            <Button
                id={`${id}-button`}
                aria-controls={open ? `${id}-menu` : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{ /* ... існуючі стилі кнопки ... */
                    color: '#e2e8f0', textTransform: 'none', fontSize: '0.9rem', fontWeight: 400, p: '5px 8px', minWidth: 'auto',
                    '& .MuiButton-endIcon': { color: 'orange', ml: 0.5 },
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
                    ...buttonSx,
                }}
            >
                {buttonText}
            </Button>
            <StyledMenu // Використовуємо оновлене StyledMenu
                id={`${id}-menu`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: { // <-- Вказуємо слот 'list'
                      'aria-labelledby': `${id}-button`, // Передаємо ті ж самі пропси сюди
                    }
                  }}
                disableScrollLock={true}
            >
                {needsResetOption && (
                    <MenuItem onClick={() => handleMenuItemClick(resetValue)}>
                        <em>{options.find(opt => opt.value === resetValue)?.label || 'Скинути / Будь-який'}</em>
                    </MenuItem>
                )}
                {options.map((option) => (
                    <MenuItem
                        key={option.value}
                        selected={option.value === selectedValue}
                        onClick={() => handleMenuItemClick(option.value)}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </StyledMenu>
        </>
    );
}

export default FilterSelect;