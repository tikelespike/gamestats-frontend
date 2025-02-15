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
  version: number
  name: string
  ownerId: number | null
}

export interface AddPlayerRequest {
  name: string
  ownerId: number | null
}

export enum CharacterType {
  Townsfolk = "townsfolk",
  Outsider = "outsider",
  Minion = "minion",
  Demon = "demon",
  Traveller = "traveller",
}

export interface Character {
  id: number
  version: number
  name: string
  scriptToolIdentifier: string | null
  type: CharacterType
  wikiPageUrl: string | null
  imageUrl: string | null
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
    timeout: 5000,
  }),
  tagTypes: ["Players", "Characters"],
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
    characters: builder.query<Character[], void>({
      query: () => "/characters",
      providesTags: ["Characters"],
    }),
  }),
})

export const {
  useLoginMutation,
  usePlayersQuery,
  useAddPlayerMutation,
  useDeletePlayerMutation,
  useCharactersQuery,
} = apiSlice
