import type React from "react"
import { useState } from "react"
import {
  Box,
  Button,
  Card,
  Center,
  Grid,
  Group,
  Loader,
  Modal,
  Progress,
  Select,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core"
import {
  type PlayerStats,
  usePlayersQuery,
  usePlayerStatsQuery,
  useUsersQuery,
} from "../api/apiSlice"
import { useAppSelector } from "../../app/hooks"

type StatOption = {
  value: string
  label: string
  getValue: (stats: PlayerStats) => number
  format: (value: number, stats: PlayerStats) => React.ReactNode
}

export default function PlayerStatsTable() {
  const { data: playerStats, isLoading: statsLoading } = usePlayerStatsQuery()
  const { data: players, isLoading: playersLoading } = usePlayersQuery()
  const { data: users, isLoading: usersLoading } = useUsersQuery()
  const [selectedStat, setSelectedStat] = useState<string>("wins")
  const currentUserId = useAppSelector(state => state.auth.userId)
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null)

  if (
    statsLoading ||
    playersLoading ||
    usersLoading ||
    !playerStats ||
    !players ||
    !users
  ) {
    return (
      <Center>
        <Loader top="40vh" color="blue" size="xl" type="bars" />
      </Center>
    )
  }

  // Create a map of player IDs to names for easy lookup
  const playerMap = new Map(players.map(player => [player.id, player.name]))

  // Find the current user's player ID
  const currentUser = users.find(user => user.id === currentUserId)
  const currentPlayerId = currentUser?.playerId

  const statOptions: StatOption[] = [
    {
      value: "wins",
      label: "Total Wins",
      getValue: stats => stats.totalWins,
      format: value => value.toString(),
    },
    {
      value: "winRate",
      label: "Win Rate",
      getValue: stats =>
        stats.totalGamesPlayed > 0
          ? (stats.totalWins / stats.totalGamesPlayed) * 100
          : 0,
      format: (value, stats) => {
        if (stats.totalGamesPlayed === 0) return "No games"

        return (
          <Tooltip
            label={`Wins: ${stats.totalWins} | Total: ${stats.totalGamesPlayed}`}
            position="top"
            withArrow
          >
            <Group gap="xs" align="center">
              <Progress size="sm" w={100} value={value} color="green" />
              <Text size="sm">{value.toFixed(1)}%</Text>
            </Group>
          </Tooltip>
        )
      },
    },
    {
      value: "gamesPlayed",
      label: "Games Played",
      getValue: stats => stats.totalGamesPlayed,
      format: value => value.toString(),
    },
    {
      value: "alignmentRatio",
      label: "Good/Evil Ratio",
      getValue: stats => {
        const total = stats.timesGood + stats.timesEvil
        return total > 0 ? (stats.timesGood / total) * 100 : 50
      },
      format: (value, stats) => {
        const total = stats.timesGood + stats.timesEvil
        if (total === 0) return "No games"

        return (
          <Tooltip
            label={`Good: ${stats.timesGood} | Evil: ${stats.timesEvil}`}
            position="top"
            withArrow
          >
            <Group gap="xs" align="center">
              <Progress size="sm" w={100} value={value} color="blue" bg="red" />
              <Text size="sm">{value.toFixed(1)}%</Text>
            </Group>
          </Tooltip>
        )
      },
    },
    {
      value: "survivalRate",
      label: "Survival Rate",
      getValue: stats => {
        const gamesAsPlayer = stats.totalGamesPlayed - stats.timesStoryteller
        return gamesAsPlayer > 0
          ? ((gamesAsPlayer - stats.timesDeadAtEnd) / gamesAsPlayer) * 100
          : 0
      },
      format: (value, stats) => {
        const gamesAsPlayer = stats.totalGamesPlayed - stats.timesStoryteller
        if (gamesAsPlayer === 0) return "No games as player"

        return (
          <Tooltip
            label={`Survived: ${gamesAsPlayer - stats.timesDeadAtEnd} | Total as Player: ${gamesAsPlayer}`}
            position="top"
            withArrow
          >
            <Group gap="xs" align="center">
              <Progress size="sm" w={100} value={value} color="green" />
              <Text size="sm">{value.toFixed(1)}%</Text>
            </Group>
          </Tooltip>
        )
      },
    },
    {
      value: "demonCount",
      label: "Times as Demon",
      getValue: stats => stats.characterTypeCounts["demon"] || 0,
      format: value => value.toString(),
    },
  ]

  const selectedOption =
    statOptions.find(opt => opt.value === selectedStat) || statOptions[0]

  // Sort players by the selected metric, then by name
  const sortedStats = [...playerStats].sort((a, b) => {
    const aValue = selectedOption.getValue(a)
    const bValue = selectedOption.getValue(b)
    const aName = playerMap.get(a.playerId) || ""
    const bName = playerMap.get(b.playerId) || ""

    // First sort by the selected metric
    if (aValue !== bValue) {
      return bValue - aValue
    }
    // If values are equal, sort alphabetically by name
    return aName.localeCompare(bName)
  })

  const renderStatWithProgress = (
    label: string,
    value: number,
    total: number,
    color: string,
    bg?: string,
  ) => (
    <Stack gap="xs">
      <Text>{label}</Text>
      <Group gap="xs" align="center">
        <Progress
          size="sm"
          w={100}
          value={(value / total) * 100}
          color={color}
          bg={bg}
        />
        <Text size="sm">
          {value} / {total} ({((value / total) * 100).toFixed(1)}%)
        </Text>
      </Group>
    </Stack>
  )

  let playerName: string = "Player"
  if (selectedPlayer && selectedPlayer.playerId) {
    playerName = playerMap.get(selectedPlayer.playerId) || "Player"
    playerName = playerName.split(" ")[0] // Use first name only
  }

  return (
    <div>
      <Box style={{ display: "inline-block" }}>
        <Card withBorder shadow="sm" p="lg">
          <Title order={3} mb="md">
            Player Statistics
          </Title>
          <Select
            label="Select Statistic"
            value={selectedStat}
            onChange={value => setSelectedStat(value || "wins")}
            data={statOptions.map(opt => ({
              value: opt.value,
              label: opt.label,
            }))}
            mb="md"
          />
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Rank</Table.Th>
                <Table.Th>Player</Table.Th>
                <Table.Th>{selectedOption.label}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sortedStats.map((stats, index) => (
                <Table.Tr
                  key={stats.playerId}
                  style={{
                    backgroundColor:
                      stats.playerId === currentPlayerId
                        ? "var(--mantine-color-blue-light)"
                        : undefined,
                  }}
                >
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td>
                    <UnstyledButton onClick={() => setSelectedPlayer(stats)}>
                      <Text
                        fw={index === 0 ? 600 : 400}
                        style={{ cursor: "pointer" }}
                      >
                        {playerMap.get(stats.playerId) || "Unknown Player"}
                        {index === 0 && " 🏆"}
                      </Text>
                    </UnstyledButton>
                  </Table.Td>
                  <Table.Td>
                    {selectedOption.format(
                      selectedOption.getValue(stats),
                      stats,
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Box>

      <Modal
        opened={selectedPlayer !== null}
        onClose={() => setSelectedPlayer(null)}
        title={selectedPlayer ? playerMap.get(selectedPlayer.playerId) : ""}
        size="lg"
      >
        {selectedPlayer && (
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <Card withBorder>
                  <Text fw={500} mb="md">
                    Game Statistics
                  </Text>
                  <Stack gap="md">
                    {renderStatWithProgress(
                      "Wins",
                      selectedPlayer.totalWins,
                      selectedPlayer.totalGamesPlayed,
                      "green",
                    )}
                    {renderStatWithProgress(
                      "Survival",
                      selectedPlayer.totalGamesPlayed -
                        selectedPlayer.timesStoryteller -
                        selectedPlayer.timesDeadAtEnd,
                      selectedPlayer.totalGamesPlayed -
                        selectedPlayer.timesStoryteller,
                      "green",
                    )}
                    <Text>
                      {playerName} has run {selectedPlayer.timesStoryteller}{" "}
                      game(s).
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={6}>
                <Card withBorder>
                  <Text fw={500} mb="md">
                    Alignment Statistics
                  </Text>
                  <Stack gap="md">
                    {renderStatWithProgress(
                      "Good/Evil Ratio",
                      selectedPlayer.timesGood,
                      selectedPlayer.timesGood + selectedPlayer.timesEvil,
                      "blue",
                      "red",
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        )}
        <Group justify="flex-end" mt="xl">
          <Button onClick={() => setSelectedPlayer(null)}>Close</Button>
        </Group>
      </Modal>
    </div>
  )
}
