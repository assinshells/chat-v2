export const COLOR_MAP = {
  black: "#000000",
  blue: "#0d6efd",
  green: "#198754",
  purple: "#6f42c1",
  orange: "#fd7e14",
};

export const getColorHex = (colorValue) => {
  return COLOR_MAP[colorValue] || COLOR_MAP.black;
};

export const COLOR_OPTIONS = [
  { value: "black", label: "Чёрный", hex: COLOR_MAP.black },
  { value: "blue", label: "Синий", hex: COLOR_MAP.blue },
  { value: "green", label: "Зелёный", hex: COLOR_MAP.green },
  { value: "purple", label: "Фиолетовый", hex: COLOR_MAP.purple },
  { value: "orange", label: "Оранжевый", hex: COLOR_MAP.orange },
];
