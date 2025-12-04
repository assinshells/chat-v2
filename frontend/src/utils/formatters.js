// frontend/src/utils/formatters.js

export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Сегодня";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Вчера";
  } else {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });
  }
};

export const getGenderIcon = (gender) => {
  const icons = {
    male: "bi-gender-male",
    female: "bi-gender-female",
    unknown: "bi-gender-ambiguous",
  };
  return icons[gender] || icons.male;
};
