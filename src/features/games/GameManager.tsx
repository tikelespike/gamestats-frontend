import GameCard from "./GameCard"
import { useGamesQuery } from "../api/apiSlice"
import { Center, Loader } from "@mantine/core"
import ErrorDisplay from "../../components/ErrorDisplay"
import React from "react"

const GameManager = () => {
  const games = useGamesQuery()

  if (games.isLoading) {
    return (
      <Center>
        <Loader top="40vh" color="blue" size="xl" type="bars" />
      </Center>
    )
  }
  if (games.isError || games.data === undefined) {
    return <ErrorDisplay error={games.error} />
  }

  return (
    <div>
      {games.data.map(game => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}

export default GameManager
