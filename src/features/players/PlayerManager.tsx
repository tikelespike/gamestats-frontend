import { IconPencil, IconTrash } from "@tabler/icons-react"
import {
  ActionIcon,
  Button,
  Group,
  Notification,
  Table,
  Text,
} from "@mantine/core"
import { usePlayersQuery } from "../api/apiSlice"
import React from "react"

export default function PlayerManager() {
  const { isError, error, data, isLoading } = usePlayersQuery()

  if (isLoading) {
    return <Text>Loading...</Text>
  }
  if (isError || data === undefined) {
    return (
      <Notification color="red" mt="md">
        {error && "data" in error && (error.data as { detail: string }).detail
          ? "Error: " + (error.data as { detail: string }).detail
          : "Failed to fetch players"}
      </Notification>
    )
  }

  const rows = data.map(player => (
    <Table.Tr key={player.id}>
      <Table.Td>
        <Group gap="sm">
          {/*Re-enable once profile pictures are implemented in backend*/}
          {/*<Avatar size={30} src={item.avatar} radius={30} />*/}
          <Text fz="sm" fw={500}>
            {player.name}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{player.ownerId ? player.ownerId.toString() : "-"}</Text>
      </Table.Td>

      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray">
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red">
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <Table.ScrollContainer minWidth={800}>
      <Button size={"md"}>Add Player</Button>
      <Table verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Associated Account</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
