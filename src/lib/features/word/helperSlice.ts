import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NamedColor } from "./named-color";

type Word = {
  value: string;
  colors: NamedColor[];
};

type Color = {
  name: NamedColor;
  colorState: ColorState;
};

type ColorState = "open" | "active" | "lockable" | "locked";

type HelperState = {
  words: Word[];
  colors: Color[];
};

const initialState: HelperState = {
  words: [],
  colors: [
    { name: NamedColor.YELLOW, colorState: "open" },
    { name: NamedColor.BLUE, colorState: "open" },
    { name: NamedColor.GREEN, colorState: "open" },
    { name: NamedColor.PURPLE, colorState: "open" },
  ],
};

export const helperSlice = createSlice({
  name: "helper",
  initialState,
  reducers: {
    initializeWords: (state, action: PayloadAction<{ words: string[] }>) => {
      return {
        ...state,
        words: action.payload.words.map((word) => ({
          value: word,
          colors: [],
        })),
      };
    },
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
          const colors = word.colors.includes(activeColor)
            ? word.colors.filter((color) => color !== activeColor)
            : [...word.colors, activeColor];
          return { ...word, colors };
        }),
      };
    },
    setActiveColor: (
      state,
      { payload }: PayloadAction<{ color: NamedColor }>
    ) => {
      return {
        ...state,
        colors: state.colors.map(({ name }) => ({
          name,
          colorState: name === payload.color ? "active" : "open",
        })),
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
    })
  },
});

export const { initializeWords, toggleActiveColor, setActiveColor, resetBoard } =
  helperSlice.actions;
export default helperSlice.reducer;
