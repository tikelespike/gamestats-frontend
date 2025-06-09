import React from "react"
import { Box, Card, Table, Text, Title } from "@mantine/core"

// Placeholder data - will be replaced with real data later
const playerStats = [
  { id: 1, name: "Alice", wins: 15 },
  { id: 2, name: "Bob", wins: 12 },
  { id: 3, name: "Charlie", wins: 10 },
  { id: 4, name: "David", wins: 8 },
  { id: 5, name: "Eve", wins: 7 },
  { id: 6, name: "Frank", wins: 5 },
]

const Dashboard = () => {
  return (
    <div>
      <Box style={{ display: "inline-block" }}>
        <Card withBorder shadow="sm" p="lg">
          <Title order={3} mb="md">
            Player Statistics
          </Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Rank</Table.Th>
                <Table.Th>Player</Table.Th>
                <Table.Th>Total Wins</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {playerStats.map((player, index) => (
                <Table.Tr key={player.id}>
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td>
                    <Text fw={index === 0 ? 600 : 400}>
                      {player.name}
                      {index === 0 && " 🏆"}
                    </Text>
                  </Table.Td>
                  <Table.Td>{player.wins}</Table.Td>
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
