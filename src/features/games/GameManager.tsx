import GameCard from "./GameCard"
import { useGamesQuery } from "../api/apiSlice"
import { Center, Loader, Stack } from "@mantine/core"
import ErrorDisplay from "../../components/ErrorDisplay"
import React from "react"
import { modals } from "@mantine/modals"
import DeleteGameModal from "./DeleteGameModal"

const GameManager = () => {
  const games = useGamesQuery()

  const handleDeleteGame = (gameId: number) => {
    const modalId = modals.open({
      title: "Delete Game",
      centered: true,
      children: (
        <DeleteGameModal
          gameId={gameId}
          onClose={() => modals.close(modalId)}
        />
      ),
    })
  }

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
    <Stack gap={"sm"}>
      {games.data.map(game => (
        <GameCard key={game.id} game={game} onDelete={() => handleDeleteGame(game.id)} />
      ))}
    </Stack>
  )
}

export default GameManager
