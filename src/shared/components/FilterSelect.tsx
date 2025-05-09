
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled, alpha } from '@mui/material/styles'; 

import { FilterOption } from '../constants/FilterOptions';


const StyledMenu = styled(Menu)(({ theme }) => {

    const menuBackgroundColor = '#505050'; 
    const menuTextColor = '#F5F5F5'; 
    const selectedItemBg = alpha(theme.palette.primary.main, 0.15);
    const hoverItemBg = alpha('#FFFFFF', 0.08); 
    const menuBorderColor = alpha('#FFFFFF', 0.12); 

    return {
        '& .MuiPaper-root': { 
            borderRadius: 6,
            marginTop: theme.spacing(0.5), 
            minWidth: 180,
            color: menuTextColor,        
            backgroundColor: menuBackgroundColor, 
            boxShadow: 'none', 
            border: `1px solid ${menuBorderColor}`, 
            '& .MuiMenu-list': {
                padding: '4px 0',
            },
            '& .MuiMenuItem-root': { 
                fontSize: '0.9rem',

                '&:active': { 
                    backgroundColor: hoverItemBg,
                },
                '&.Mui-selected': { 
                    backgroundColor: selectedItemBg, 
                    fontWeight: 'bold',
                    '&:hover': { 
                        backgroundColor: selectedItemBg,
                    }
                },
                '&:hover': { 
                    backgroundColor: hoverItemBg, 
                }
            },
        },
    };
});



interface CustomFilterSelectProps {
    id: string;
    label: string;
    options: FilterOption[];
    selectedValue: string | number | null;
    onChange: (value: string | number | null) => void;
    buttonSx?: object;
    menuSx?: object; 
    allowReset?: boolean;
}

const FilterSelect: React.FC<CustomFilterSelectProps> = ({
    id,
    label,
    options,
    selectedValue,
    onChange,
    buttonSx,

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
                sx={{ 
                    color: '#e2e8f0', textTransform: 'none', fontSize: '0.9rem', fontWeight: 400, p: '5px 8px', minWidth: 'auto',
                    '& .MuiButton-endIcon': { color: 'orange', ml: 0.5 },
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
                    ...buttonSx,
                }}
            >
                {buttonText}
            </Button>
            <StyledMenu 
                id={`${id}-menu`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: { 
                      'aria-labelledby': `${id}-button`, 
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