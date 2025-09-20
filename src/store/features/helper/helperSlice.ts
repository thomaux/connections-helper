import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { NamedColor } from "../../../types/named-color.ts";

type Word = {
  value: string;
  colors: NamedColor[];
};

type Color = {
  name: NamedColor;
  colorState: ColorState;
};

type ColorState = "open" | "active" | "locked";

type HelperState = {
  words: Word[];
  colors: Color[];
  lockedColorOrder: NamedColor[];
};

const initialState: HelperState = {
  words: import.meta.env.VITE_WORDS.split(",").map((word: string) => ({
    value: word,
    colors: [],
  })),
  colors: [
    { name: "yellow", colorState: "open" },
    { name: "blue", colorState: "open" },
    { name: "green", colorState: "open" },
    { name: "purple", colorState: "open" },
  ],
  lockedColorOrder: [],
};

export const helperSlice = createSlice({
  name: "helper",
  initialState,
  reducers: {
    toggleActiveColor: (state, action: PayloadAction<{ word: string }>) => {
      return {
        ...state,
        words: state.words.map((word) => {
          if (word.value !== action.payload.word) {
            return word;
          }
          const activeColor = state.colors.find(
            ({ colorState }) => colorState === "active"
          )?.name;

          if (word.colors.includes(activeColor)) {
            return {
              ...word,
              colors: word.colors.filter((color) => color !== activeColor),
            };
          }

          if (
            word.colors.some(
              (color) =>
                state.colors.find(({ name }) => name === color)?.colorState ===
                "locked"
            )
          ) {
            return word;
          }

          return word.colors.length < 2
            ? { ...word, colors: [...word.colors, activeColor] }
            : word;
        }),
      };
    },
    setActiveColor: (
      state,
      { payload }: PayloadAction<{ color: NamedColor }>
    ) => {
      return {
        ...state,
        colors: state.colors.map(({ name, colorState }) =>
          name === payload.color
            ? {
                name,
                colorState: "active",
              }
            : {
                name,
                colorState: colorState === "active" ? "open" : colorState,
              }
        ),
      };
    },
    resetBoard: (state) => ({
      words: state.words.map((word) => ({
        ...word,
        colors: [],
      })),
      colors: state.colors.map((color) => ({
        ...color,
        colorState: "open",
      })),
      lockedColorOrder: [],
    }),
    lockColor: (state, { payload }: PayloadAction<{ color: NamedColor }>) => ({
      ...state,
      colors: state.colors.map((color) => ({
        ...color,
        colorState: color.name === payload.color ? "locked" : color.colorState,
      })),
      words: state.words.map((word) =>
        word.colors.includes(payload.color)
          ? {
              ...word,
              colors: [payload.color],
            }
          : word
      ),
      lockedColorOrder: [...state.lockedColorOrder, payload.color],
    }),
    unlockColor: (
      state,
      { payload }: PayloadAction<{ color: NamedColor }>
    ) => ({
      ...state,
      colors: state.colors.map((color) => ({
        ...color,
        colorState: color.name === payload.color ? "open" : color.colorState,
      })),
      lockedColorOrder: state.lockedColorOrder.filter(
        (color) => color !== payload.color
      ),
    }),
    cleanColor: (state, { payload }: PayloadAction<{ color: NamedColor }>) => ({
      ...state,
      words: state.words.map((word) => ({
        ...word,
        colors: word.colors.filter((color) => color !== payload.color),
      })),
      colors: state.colors.map((color) => ({
        ...color,
        colorState: color.name === payload.color ? "open" : color.colorState,
      })),
    }),
  },
});

export const {
  toggleActiveColor,
  setActiveColor,
  resetBoard,
  lockColor,
  unlockColor,
  cleanColor,
} = helperSlice.actions;

// Selector to get words ordered by locked color order
export const selectWordsOrderedByLockedColors = (state: {
  helper: HelperState;
}) => {
  const { words, lockedColorOrder } = state.helper;

  // Sort words based on the locked color order
  return [...words].sort((a, b) => {
    const aColorIndex = lockedColorOrder.findIndex((color) =>
      a.colors.includes(color)
    );
    const bColorIndex = lockedColorOrder.findIndex((color) =>
      b.colors.includes(color)
    );

    // If both colors are in the locked order, sort by their position
    if (aColorIndex !== -1 && bColorIndex !== -1) {
      return aColorIndex - bColorIndex;
    }

    // If only one color is in the locked order, prioritize it
    if (aColorIndex !== -1) return -1;
    if (bColorIndex !== -1) return 1;

    // If neither color is in the locked order, maintain original order
    return 0;
  });
};
