// import type { AppDispatch, RootState } from "@/redux/store";
// import {
//   type TypedUseSelectorHook,
//   useDispatch,
//   useSelector,
// } from "react-redux";
// // import type { AppDispatch, RootState } from './store';

// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import type { RootState } from "@/redux/store";
import { type TypedUseSelectorHook, useSelector } from "react-redux";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
