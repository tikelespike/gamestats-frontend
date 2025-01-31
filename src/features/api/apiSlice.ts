import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../../app/store"

export interface UserResponse {
  accessToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface Player {
  id: number
  name: string
  ownerId: number | null
}

export interface AddPlayerRequest {
  name: string
  ownerId: number | null
}

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL as string,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Players"],
  endpoints: builder => ({
    login: builder.mutation<UserResponse, LoginRequest>({
      query: credentials => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    players: builder.query<Player[], void>({
      query: () => "/players",
      providesTags: ["Players"],
    }),
    addPlayer: builder.mutation<Player, AddPlayerRequest>({
      query: request => ({
        url: "/players",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Players"],
    }),
    deletePlayer: builder.mutation<void, number>({
      query: id => ({
        url: `/players/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Players"],
    }),
  }),
})

export const {
  useLoginMutation,
  usePlayersQuery,
  useAddPlayerMutation,
  useDeletePlayerMutation,
} = apiSlice
