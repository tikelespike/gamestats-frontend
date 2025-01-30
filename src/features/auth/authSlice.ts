import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

type AuthState = {
  token: string | null
}

export const authSlice = createSlice({
  name: "auth",
  initialState: { token: null } as AuthState,
  reducers: {
    setToken: (
      state,
      { payload: { token } }: PayloadAction<{ token: string }>,
    ) => {
      state.token = token
    },
    logout: state => {
      state.token = null
    },
  },
})

export const { setToken, logout } = authSlice.actions

export default authSlice.reducer
