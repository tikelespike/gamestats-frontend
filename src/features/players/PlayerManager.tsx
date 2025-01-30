import { IconPencil, IconTrash } from "@tabler/icons-react"
import { ActionIcon, Group, Table, Text } from "@mantine/core"

const data = [
  {
    name: "Robert Wolfkisser",
    associatedAccount: "rob_wolf@gmail.com",
  },
  {
    name: "John Doe",
    associatedAccount: "johndoe@outlook.com",
  },
  {
    name: "Jane Doe",
    associatedAccount: "janedoe@outlook.com",
  },
  {
    name: "John Smith",
    associatedAccount: "john@smith.co.uk",
  },
  {
    name: "Greg Egan",
    associatedAccount: null,
  },
  {
    name: "John Doe",
    associatedAccount: "johndoe@outlook.com",
  },
  {
    name: "Jane Doe",
    associatedAccount: "janedoe@outlook.com",
  },
  {
    name: "John Smith",
    associatedAccount: "john@smith.co.uk",
  },
  {
    name: "Robert Wolfkisser",
    associatedAccount: "rob_wolf@gmail.com",
  },
  {
    name: "John Doe",
    associatedAccount: "johndoe@outlook.com",
  },
  {
    name: "Jane Doe",
    associatedAccount: "janedoe@outlook.com",
  },
  {
    name: "John Smith",
    associatedAccount: "john@smith.co.uk",
  },
]

const jobColors: Record<string, string> = {
  engineer: "blue",
  manager: "cyan",
  designer: "pink",
}

export default function PlayerManager() {
  const rows = data.map(item => (
    <Table.Tr key={item.name}>
      <Table.Td>
        <Group gap="sm">
          {/*Re-enable once profile pictures are implemented in backend*/}
          {/*<Avatar size={30} src={item.avatar} radius={30} />*/}
          <Text fz="sm" fw={500}>
            {item.name}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{item.associatedAccount}</Text>
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
      <Table verticalSpacing="sm">
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
