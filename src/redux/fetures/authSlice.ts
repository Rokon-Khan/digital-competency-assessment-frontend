import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserRole } from "../../types/common";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: UserRole | null;
  supervisorApproved?: boolean;
  isApproved?: boolean;
  initialized: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  role: null,
  supervisorApproved: undefined,
  isApproved: undefined,
  initialized: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadFromStorage(state) {
      const raw = localStorage.getItem("auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        state.accessToken = parsed.accessToken;
        state.refreshToken = parsed.refreshToken;
        state.role = parsed.role;
        state.supervisorApproved = parsed.supervisorApproved;
        state.isApproved = parsed.isApproved;
      }
      state.initialized = true;
    },
    setCredentials(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        role?: UserRole;
        supervisorApproved?: boolean;
        isApproved?: boolean;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      if (action.payload.role) state.role = action.payload.role;
      state.supervisorApproved = action.payload.supervisorApproved;
      state.isApproved = action.payload.isApproved;
      localStorage.setItem(
        "auth",
        JSON.stringify({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          role: state.role,
          supervisorApproved: state.supervisorApproved,
          isApproved: state.isApproved,
        })
      );
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
      state.supervisorApproved = undefined;
      state.isApproved = undefined;
      localStorage.removeItem("auth");
    },
    updateApproval(
      state,
      action: PayloadAction<{
        supervisorApproved?: boolean;
        isApproved?: boolean;
      }>
    ) {
      if (typeof action.payload.supervisorApproved !== "undefined")
        state.supervisorApproved = action.payload.supervisorApproved;
      if (typeof action.payload.isApproved !== "undefined")
        state.isApproved = action.payload.isApproved;
      const existing = localStorage.getItem("auth");
      if (existing) {
        const obj = JSON.parse(existing);
        obj.supervisorApproved = state.supervisorApproved;
        obj.isApproved = state.isApproved;
        localStorage.setItem("auth", JSON.stringify(obj));
      }
    },
  },
});

export const { loadFromStorage, setCredentials, logout, updateApproval } =
  slice.actions;
export default slice.reducer;
