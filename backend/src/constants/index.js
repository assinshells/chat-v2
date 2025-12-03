// ==========================================
// src/constants/index.js
// ==========================================
export const MESSAGE_COLORS = ["black", "blue", "green", "purple", "orange"];
export const GENDERS = ["male", "female", "unknown"];
export const DEFAULT_ROOMS = [
  { name: "главная", displayName: "Главная", description: "Общий чат" },
  {
    name: "знакомства",
    displayName: "Знакомства",
    description: "Знакомства и общение",
  },
  {
    name: "беспредел",
    displayName: "Беспредел",
    description: "Свободное общение",
  },
];

export const GENDER_VERBS = {
  join: {
    male: "вошёл",
    female: "вошла",
    unknown: "влезло",
  },
  switch: {
    male: "перешёл",
    female: "перешла",
    unknown: "переполз",
  },
  leave: {
    male: "покинул",
    female: "покинула",
    unknown: "уполз из",
  },
};
