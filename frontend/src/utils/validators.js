// frontend/src/utils/validators.js
export const validateLogin = (values) => {
  const errors = {};

  if (!values.login) {
    errors.login = "Введите никнейм или email";
  }

  if (!values.password) {
    errors.password = "Введите пароль";
  } else if (values.password.length < 6) {
    errors.password = "Пароль должен содержать минимум 6 символов";
  }

  return errors;
};

export const validateRegister = (values) => {
  const errors = {};

  if (!values.nickname) {
    errors.nickname = "Введите никнейм";
  } else if (values.nickname.length < 3) {
    errors.nickname = "Никнейм должен содержать минимум 3 символа";
  } else if (values.nickname.length > 30) {
    errors.nickname = "Никнейм не должен превышать 30 символов";
  }

  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
  ) {
    errors.email = "Неверный формат email";
  }

  if (!values.password) {
    errors.password = "Введите пароль";
  } else if (values.password.length < 6) {
    errors.password = "Пароль должен содержать минимум 6 символов";
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Пароли не совпадают";
  }

  return errors;
};

export const sanitizeUserInput = (input) => {
  if (typeof input !== "string") return "";

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

export const validateMessageColor = (color) => {
  const validColors = Object.values(MESSAGE_COLORS);
  return validColors.includes(color) ? color : MESSAGE_COLORS.BLACK;
};

export const validateGender = (gender) => {
  const validGenders = Object.values(GENDERS);
  return validGenders.includes(gender) ? gender : GENDERS.MALE;
};
