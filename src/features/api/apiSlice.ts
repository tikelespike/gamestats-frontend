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
  wikiPageLink: string | null
  imageUrl: string | null
}

export interface AddCharacterRequest {
  name: string
  scriptToolIdentifier: string | null
  type: CharacterType
  wikiPageLink: string | null
  imageUrl: string | null
}

export interface Script {
  id: number
  version: number
  name: string
  description: string | null
  wikiPageLink: string | null
  characterIds: number[]
}

export interface AddScriptRequest {
  name: string
  description: string | null
  wikiPageLink: string | null
  characterIds: number[]
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
  tagTypes: ["Players", "Characters", "Scripts"],
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
    addCharacter: builder.mutation<Character, AddCharacterRequest>({
      query: request => ({
        url: "/characters",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Characters"],
    }),
    editCharacter: builder.mutation<Character, Character>({
      query: request => ({
        url: `/characters/${request.id}`,
        method: "PUT",
        body: request,
      }),
      invalidatesTags: ["Characters"],
    }),
    deleteCharacter: builder.mutation<void, number>({
      query: id => ({
        url: `/characters/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Characters", "Scripts"], // Deleting a character will remove it from any scripts it was in
    }),
    batchDeleteCharacters: builder.mutation<void, number[]>({
      query: ids => ({
        url: `/characters/batch`,
        method: "DELETE",
        body: ids,
      }),
      invalidatesTags: ["Characters", "Scripts"],
    }),
    officialCharacters: builder.query<AddCharacterRequest[], void>({
      query: () => "/officialtool/characters",
    }),
    scripts: builder.query<Script[], void>({
      query: () => "/scripts",
      providesTags: ["Scripts"],
    }),
    addScript: builder.mutation<Script, AddScriptRequest>({
      query: request => ({
        url: "/scripts",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Scripts"],
    }),
    editScript: builder.mutation<Script, Script>({
      query: request => ({
        url: `/scripts/${request.id}`,
        method: "PUT",
        body: request,
      }),
      invalidatesTags: ["Scripts"],
    }),
    deleteScript: builder.mutation<void, number>({
      query: id => ({
        url: `/scripts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Scripts"],
    }),
  }),
})

export const {
  useLoginMutation,
  usePlayersQuery,
  useAddPlayerMutation,
  useDeletePlayerMutation,
  useCharactersQuery,
  useAddCharacterMutation,
  useEditCharacterMutation,
  useDeleteCharacterMutation,
  useBatchDeleteCharactersMutation,
  useOfficialCharactersQuery,
  useScriptsQuery,
  useAddScriptMutation,
  useEditScriptMutation,
  useDeleteScriptMutation,
} = apiSlice
