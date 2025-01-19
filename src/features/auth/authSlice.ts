import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
  token: string | null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null } as AuthState,
  reducers: {
    setToken: (
      state,
      {
        payload: { token },
      }: PayloadAction<{ token: string }>,
    ) => {
      state.token = token
    },
  },
})

export const { setToken } = authSlice.actions

export default authSlice.reducer
