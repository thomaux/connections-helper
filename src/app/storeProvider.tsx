"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../lib/store";
import { initializeWords } from "../lib/features/word/helperSlice";

type StoreProviderProps = {
  words: string[];
  children: React.ReactNode;
};

export default function StoreProvider({ words, children }: StoreProviderProps) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    storeRef.current.dispatch(initializeWords({ words }));
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
