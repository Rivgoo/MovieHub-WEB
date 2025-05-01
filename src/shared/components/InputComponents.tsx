import { TextField, TextFieldProps } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// --- Базовий стиль (Приклад: трохи змінений Outlined) ---
export const StandardInput = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& label.Mui-focused': {
    color: theme.palette.primary.main, // Колір лейбла при фокусі
  },
  '& .MuiInputLabel-root': {
     color: theme.palette.primary.light, // Базовий колір лейбла
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.85rem', // Округлення як у кнопок
    color: theme.palette.primary.light, // Колір тексту
    '& fieldset': {
      borderColor: alpha(theme.palette.primary.light, 0.5), // Колір рамки
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light, // Колір рамки при наведенні
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main, // Колір рамки при фокусі
      borderWidth: '1px', // Товщина рамки при фокусі
    },
     // Стилі для стану помилки
    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.error.main, // Червона рамка при помилці
    },
    '&.Mui-error label.Mui-focused': {
        color: theme.palette.error.main, // Червоний лейбл при фокусі та помилці
    },
     '&.Mui-error .MuiInputLabel-root': {
        color: theme.palette.error.main, // Червоний лейбл при помилці
    },
  },
    // Прибираємо стандартний синій для автозаповнення браузера
  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: theme.palette.primary.light, // Колір тексту автозаповнення
        transition: 'background-color 5000s ease-in-out 0s',
        boxShadow: `inset 0 0 20px 20px ${theme.palette.background.default}`, // Фон автозаповнення
    },
}));

// --- Інпут з анімованим підкресленням (використовує variant="standard") ---
export const UnderlineFocusInput = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& label.Mui-focused': {
    color: theme.palette.primary.main,
  },
   '& .MuiInputLabel-root': {
     color: theme.palette.primary.light,
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: alpha(theme.palette.primary.light, 0.5), // Колір базового підкреслення
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottomColor: theme.palette.primary.light, // Колір підкреслення при наведенні
     borderBottomWidth: '2px',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: theme.palette.primary.main, // Колір підкреслення при фокусі
    transition: 'transform 0.3s ease', // Анімація появи
  },
   '& .MuiInputBase-input': {
      color: theme.palette.primary.light, // Колір тексту
  },
    // Прибираємо стандартний синій для автозаповнення браузера
  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: theme.palette.primary.light,
        transition: 'background-color 5000s ease-in-out 0s',
        // Стандартний варіант не має фону за замовчуванням, тому boxShadow не потрібен
  },
}));

// --- Інпут з неоновою рамкою (модифікація Outlined) ---
export const NeonOutlineInput = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& label.Mui-focused': {
    color: theme.palette.primary.main,
    textShadow: `0 0 5px ${alpha(theme.palette.primary.main, 0.5)}`, // Тінь для лейбла
  },
   '& .MuiInputLabel-root': {
     color: theme.palette.primary.light,
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.85rem',
    color: theme.palette.primary.light,
    transition: 'box-shadow 0.3s ease',
    '& fieldset': {
      borderColor: alpha(theme.palette.primary.light, 0.3),
      transition: 'border-color 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: alpha(theme.palette.primary.light, 0.7),
    },
    '&.Mui-focused': {
       boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}, 0 0 15px ${alpha(theme.palette.primary.main, 0.3)}`, // Неонова тінь
       '& fieldset': {
            borderColor: theme.palette.primary.main, // Яскрава рамка
       }
    },
  },
     // Прибираємо стандартний синій для автозаповнення браузера
  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: theme.palette.primary.light,
        transition: 'background-color 5000s ease-in-out 0s',
        boxShadow: `inset 0 0 20px 20px ${theme.palette.background.default}`,
    },
}));

// --- Інпут з заповненим фоном при наведенні/фокусі (використовує variant="filled") ---
export const FilledHoverInput = styled(TextField)<TextFieldProps>(({ theme }) => ({
   '& .MuiInputLabel-root': {
     color: theme.palette.primary.light,
     '&.Mui-focused': {
        color: theme.palette.primary.main,
     }
  },
  '& .MuiFilledInput-root': {
    borderRadius: '0.85rem 0.85rem 0 0', // Округлення тільки зверху для Filled
    backgroundColor: alpha(theme.palette.secondary.main, 0.7), // Трохи прозорий фон
    color: theme.palette.primary.light,
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.secondary.main, 0.9), // Темніший фон при наведенні
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.secondary.main, // Непрозорий фон при фокусі
    },
    // Прибираємо підкреслення у Filled варіанту
    '&:before, &:after': {
      display: 'none',
    },
  },
   // Прибираємо стандартний синій для автозаповнення браузера
  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: theme.palette.primary.light,
        transition: 'background-color 5000s ease-in-out 0s',
        boxShadow: `inset 0 0 20px 20px ${alpha(theme.palette.secondary.main, 0.7)}`, // Фон автозаповнення
        borderTopLeftRadius: '0.85rem', // Потрібно для коректного відображення фону в Chrome
        borderTopRightRadius: '0.85rem',
    },
}));

// --- Мінімалістичний інпут (схожий на standard, але менш помітний) ---
export const MinimalInput = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& label': {
     color: alpha(theme.palette.primary.light, 0.6),
     fontSize: '0.9rem', // Трохи менший лейбл
     '&.Mui-focused': {
        color: theme.palette.primary.main,
     }
  },
  '& .MuiInput-underline:before': {
    borderBottom: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`, // Дуже тонка лінія
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottom: `1px solid ${alpha(theme.palette.primary.light, 0.7)}`,
  },
  '& .MuiInput-underline:after': {
    borderBottom: `1.5px solid ${theme.palette.primary.main}`, // Тонка лінія при фокусі
  },
   '& .MuiInputBase-input': {
      color: theme.palette.primary.light,
      paddingTop: theme.spacing(1.5), // Трохи більше відступу зверху
  },
      // Прибираємо стандартний синій для автозаповнення браузера
  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: theme.palette.primary.light,
        transition: 'background-color 5000s ease-in-out 0s',
  },
}));

// --- Інпут з тінню при фокусі (модифікація Outlined) ---
export const ShadowFocusInput = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& label.Mui-focused': {
    color: theme.palette.primary.main,
  },
   '& .MuiInputLabel-root': {
     color: theme.palette.primary.light,
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.85rem',
    color: theme.palette.primary.light,
    transition: 'box-shadow 0.3s ease, border-color 0.3s ease', // Додаємо анімацію тіні
    backgroundColor: theme.palette.background.default, // Щоб тінь була помітна
    '& fieldset': {
      borderColor: alpha(theme.palette.primary.light, 0.4),
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused': {
      boxShadow: theme.shadows[4], // Додаємо тінь при фокусі
      '& fieldset': {
         borderColor: theme.palette.primary.main,
      }
    }
  },
      // Прибираємо стандартний синій для автозаповнення браузера
  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: theme.palette.primary.light,
        transition: 'background-color 5000s ease-in-out 0s',
        boxShadow: `inset 0 0 20px 20px ${theme.palette.background.default}`,
    },
}));