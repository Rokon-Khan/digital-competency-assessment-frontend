import type { UserRole } from "@/types/common";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: UserRole | null;
  supervisorApproved?: boolean;
  isApproved?: boolean;
  initialized: boolean;
}

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";
const ROLE_COOKIE = "role";

const initialState: AuthState = {
  accessToken: Cookies.get(ACCESS_COOKIE) || null,
  refreshToken: Cookies.get(REFRESH_COOKIE) || null,
  role: (Cookies.get(ROLE_COOKIE) as UserRole) || null,
  supervisorApproved: undefined,
  isApproved: undefined,
  initialized: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
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
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
      state.supervisorApproved = undefined;
      state.isApproved = undefined;
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
    },
  },
});

export const { setCredentials, logout, updateApproval } = authSlice.actions;
export default authSlice.reducer;
