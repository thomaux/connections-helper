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
};

const initialState: HelperState = {
  words: import.meta.env.VITE_WORDS.split(',').map((word: string) => ({
    value: word,
    colors: [],
  })),
  colors: [
    { name: 'yellow', colorState: "open" },
    { name: 'blue', colorState: "open" },
    { name: 'green', colorState: "open" },
    { name: 'purple', colorState: "open" },
  ],
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

          if(word.colors.includes(activeColor)) {
            return { ...word, colors: word.colors.filter((color) => color !== activeColor) };
          }

          if(word.colors.some((color) => state.colors.find(({ name }) => name === color)?.colorState === "locked")) {
            return word;
          }

          return word.colors.length < 2 ? { ...word, colors: [...word.colors, activeColor] } : word;
        }),
      };
    },
    setActiveColor: (
      state,
      { payload }: PayloadAction<{ color: NamedColor }>
    ) => {
      return {
        ...state,
        colors: state.colors.map(({ name, colorState }) => name === payload.color ? {
          name,
          colorState: "active",
        } : {
          name,
          colorState: colorState === "active" ? "open" : colorState,
        }),
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
    }),
    lockColor: (state, { payload }: PayloadAction<{ color: NamedColor }>) => ({
      ...state,
      colors: state.colors.map((color) => ({
        ...color,
        colorState: color.name === payload.color ? "locked" : color.colorState,
      })),
      words: state.words.map((word) => ( word.colors.includes(payload.color) ? {
        ...word,
        colors: [payload.color],
      } : word)),
    }),
    unlockColor: (state, { payload }: PayloadAction<{ color: NamedColor }>) => ({
      ...state,
      colors: state.colors.map((color) => ({
        ...color,
        colorState: color.name === payload.color ? "open" : color.colorState,
      })),
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

export const { toggleActiveColor, setActiveColor, resetBoard, lockColor, unlockColor, cleanColor } =
  helperSlice.actions;

