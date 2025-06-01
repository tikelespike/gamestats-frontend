import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../../app/store"

export interface LoginResponse {
  accessToken: string
  userId: number
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

export enum Alignment {
  Good = "good",
  Evil = "evil",
}

export enum CharacterType {
  Townsfolk = "townsfolk",
  Outsider = "outsider",
  Minion = "minion",
  Demon = "demon",
  Traveller = "traveller",
}

export namespace CharacterType {
  export function getDefaultAlignment(type: CharacterType): Alignment | null {
    switch (type) {
      case CharacterType.Townsfolk:
        return Alignment.Good
      case CharacterType.Outsider:
        return Alignment.Good
      case CharacterType.Minion:
        return Alignment.Evil
      case CharacterType.Demon:
        return Alignment.Evil
      default:
        return null
    }
  }
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

export interface PlayerParticipation {
  playerId: number | null
  initialCharacterId: number | null
  initialAlignment: Alignment | null
  endCharacterId: number | null
  endAlignment: Alignment | null
  isAliveAtEnd: boolean
}

export interface Game {
  id: number
  version: number
  name: string
  description: string | null
  scriptId: number | null
  storytellerIds: number[]
  winningAlignment: string | null
  winningPlayerIds: number[]
  participants: PlayerParticipation[]
}

export interface GameCreationRequest {
  name: string
  description: string | null
  scriptId: number
  storytellerIds: number[]
  winningAlignment: string | null
  winningPlayerIds: number[]
  participants: PlayerParticipation[]
}

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: (window as any).__APP_CONFIG__?.apiBaseUrl as string,
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
  tagTypes: ["Players", "Characters", "Scripts", "Games"],
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
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
      invalidatesTags: ["Players", "Games"],
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
    batchAddCharacters: builder.mutation<Character[], AddCharacterRequest[]>({
      query: requests => ({
        url: "/characters/batch",
        method: "POST",
        body: requests,
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
      invalidatesTags: ["Characters", "Scripts", "Games"], // Deleting a character will remove it from any scripts and games it was in
    }),
    batchDeleteCharacters: builder.mutation<void, number[]>({
      query: ids => ({
        url: `/characters/batch`,
        method: "DELETE",
        body: ids,
      }),
      invalidatesTags: ["Characters", "Scripts", "Games"],
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
      invalidatesTags: ["Scripts", "Games"],
    }),
    games: builder.query<Game[], void>({
      query: () => "/games",
      providesTags: ["Games"],
    }),
    deleteGame: builder.mutation<void, number>({
      query: id => ({
        url: `/games/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Games"],
    }),
    editGame: builder.mutation<Game, Game>({
      query: request => ({
        url: `/games/${request.id}`,
        method: "PUT",
        body: request,
      }),
      invalidatesTags: ["Games"],
    }),
    createGame: builder.mutation<Game, GameCreationRequest>({
      query: request => ({
        url: "/games",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Games"],
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
  useBatchAddCharactersMutation,
  useEditCharacterMutation,
  useDeleteCharacterMutation,
  useBatchDeleteCharactersMutation,
  useOfficialCharactersQuery,
  useScriptsQuery,
  useAddScriptMutation,
  useEditScriptMutation,
  useDeleteScriptMutation,
  useGamesQuery,
  useDeleteGameMutation,
  useEditGameMutation,
  useCreateGameMutation,
} = apiSlice
