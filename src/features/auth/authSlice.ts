import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

type AuthState = {
  token: string | null
  userId: number | null
}

export const authSlice = createSlice({
  name: "auth",
  initialState: { token: null, userId: null } as AuthState,
  reducers: {
    setUserInfo: (
      state,
      { payload: { token, userId } }: PayloadAction<AuthState>,
    ) => {
      state.token = token
      state.userId = userId
    },
    logout: state => {
      state.token = null
      state.userId = null
    },
  },
})

export const { setUserInfo, logout } = authSlice.actions

export default authSlice.reducer
