import GameCard from "./GameCard"
import { useGamesQuery } from "../api/apiSlice"
import { Button, Center, Group, Loader, Stack } from "@mantine/core"
import ErrorDisplay from "../../components/ErrorDisplay"
import React from "react"
import { modals } from "@mantine/modals"
import DeleteGameModal from "./DeleteGameModal"
import { IconPlus } from "@tabler/icons-react"

const GameManager = () => {
  const games = useGamesQuery()
  const [hasNewCard, setHasNewCard] = React.useState(false)

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

  const handleAddGame = () => {
    setHasNewCard(true)
  }

  const handleCancelNew = () => {
    setHasNewCard(false)
  }

  const handleCreateSuccess = () => {
    setHasNewCard(false)
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
      <Group justify="flex-start" mb={"sm"}>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleAddGame}
          disabled={hasNewCard}
        >
          Add Game
        </Button>
      </Group>
      {hasNewCard && (
        <GameCard
          isNew
          onCancel={handleCancelNew}
          onCreateSuccess={handleCreateSuccess}
        />
      )}
      {games.data
        .toSorted((g1, g2) => g2.id - g1.id) // newest games on top
        .map(game => (
          <GameCard
            key={game.id}
            game={game}
            onDelete={() => handleDeleteGame(game.id)}
          />
        ))}
    </Stack>
  )
}

export default GameManager
