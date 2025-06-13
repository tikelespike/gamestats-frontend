import React, { useState } from "react"
import {
  Box,
  Card,
  Group,
  Progress,
  Select,
  Table,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
  useMantineColorScheme,
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

const Dashboard = () => {
  const { data: playerStats, isLoading: statsLoading } = usePlayerStatsQuery()
  const { data: players, isLoading: playersLoading } = usePlayersQuery()
  const { data: users, isLoading: usersLoading } = useUsersQuery()
  const [selectedStat, setSelectedStat] = useState<string>("wins")
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const currentUserId = useAppSelector(state => state.auth.userId)

  if (statsLoading || playersLoading || usersLoading || !playerStats || !players || !users) {
    return <div>Loading...</div>
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
      format: value => `${value.toFixed(1)}%`,
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
              <Progress
                size="sm"
                w={100}
                value={value}
                color="blue"
                bg="red"
              />
              <Text size="sm" c="dimmed">
                {value.toFixed(1)}%
              </Text>
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
            onChange={(value) => setSelectedStat(value || "wins")}
            data={statOptions.map(opt => ({ value: opt.value, label: opt.label }))}
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
                    backgroundColor: stats.playerId === currentPlayerId 
                      ? 'var(--mantine-color-blue-light)'
                      : undefined
                  }}
                >
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td>
                    <Text fw={index === 0 ? 600 : 400}>
                      {playerMap.get(stats.playerId) || "Unknown Player"}
                      {index === 0 && " 🏆"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    {selectedOption.format(selectedOption.getValue(stats), stats)}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Box>
    </div>
  )
}

export default Dashboard
