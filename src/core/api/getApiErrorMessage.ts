import { ApiErrorResponse } from './types';

interface ErrorTranslations {
  [errorCode: string]: string;
}

const userErrorTranslations: ErrorTranslations = {
  'User.InvalidEmail': 'Надана адреса електронної пошти недійсна.',
  'User.InvalidPassword': 'Наданий пароль недійсний. Пароль має містити щонайменше 6 символів, одну велику літеру та одну цифру.',
  'User.InvalidPhoneNumber': 'Наданий номер телефону недійсний. Будь ласка, використовуйте формат, наприклад, +380XXXXXXXXX.',
  'User.UserWithAlreadyExists': 'Користувач з такою електронною поштою вже існує.',
};

export const getApiErrorMessage = (
  error: any,
  defaultMessage: string = 'Виникла невідома помилка. Спробуйте пізніше.'
): string => {
  if (error && error.response && error.response.data) {
    const apiError = error.response.data as ApiErrorResponse;
    if (apiError.code && userErrorTranslations[apiError.code]) {
      return userErrorTranslations[apiError.code];
    }
  }

  if (error && error.message) {
    if (error.message.toLowerCase().includes('network error')) {
      return 'Помилка мережі. Перевірте ваше інтернет-з\'єднання.';
    }
    if (error.message.toLowerCase().includes('timeout')) {
      return 'Час очікування відповіді сервера вичерпано.';
    }
  }

  return defaultMessage;
};