import { IconPencil, IconTrash } from "@tabler/icons-react"
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  Table,
  Text,
  TextInput,
} from "@mantine/core"
import type { AddPlayerRequest, Player } from "../api/apiSlice"
import {
  useAddPlayerMutation,
  useDeletePlayerMutation,
  usePlayersQuery,
} from "../api/apiSlice"
import React from "react"
import { useForm } from "@mantine/form"
import classes from "./PlayerManager.module.css"
import { useDisclosure } from "@mantine/hooks"
import ErrorDisplay from "../../components/ErrorDisplay"

export default function PlayerManager() {
  const getPlayersState = usePlayersQuery()
  const [addPlayer, addPlayerState] = useAddPlayerMutation()
  const [deletePlayer, deletePlayerState] = useDeletePlayerMutation()
  const [playerToDelete, setPlayerToDelete] = React.useState<Player | null>(
    null,
  )
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure()
  // Even though RTK query provides us with a loading state, we need to keep the state loading
  // until the exit transition of the modal has finished, which is after the RTK query isLoading becomes false
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false)

  const newPlayerForm = useForm<AddPlayerRequest>({
    initialValues: {
      name: "",
      ownerId: null,
    },
    validate: {
      name: value =>
        value && value.trim().length > 0 ? null : "Player name is required",
    },
  })

  if (getPlayersState.isLoading) {
    return (
      <Center>
        <Loader top="40vh" color="blue" size="xl" type="bars" />
      </Center>
    )
  }
  if (getPlayersState.isError || getPlayersState.data === undefined) {
    return <ErrorDisplay error={getPlayersState.error} />
  }

  const rows = getPlayersState.data.map((player: Player) => (
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
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => {
              setPlayerToDelete(player)
              openDeleteModal()
            }}
          >
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <>
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        onExitTransitionEnd={() => setDeleteLoading(false)}
        title={"Delete player"}
      >
        <Text>
          Are you sure you want to delete player "{playerToDelete?.name}"? This
          action cannot be undone.
        </Text>
        <Group mt="lg" justify="flex-end">
          <Button
            disabled={deleteLoading}
            onClick={closeDeleteModal}
            variant="default"
          >
            Cancel
          </Button>
          <Button
            color="red"
            loading={deleteLoading}
            onClick={async () => {
              setDeleteLoading(true)
              if (playerToDelete) {
                await deletePlayer(playerToDelete.id)
              }
              closeDeleteModal()
            }}
          >
            Delete player
          </Button>
        </Group>
      </Modal>

      <Table.ScrollContainer minWidth={200}>
        <form onSubmit={newPlayerForm.onSubmit(addPlayer)}>
          <Group align="flex-end" mb="sm">
            <TextInput
              label="New player name"
              placeholder="Enter player name"
              {...newPlayerForm.getInputProps("name")}
            />
            <Button
              loading={addPlayerState.isLoading}
              loaderProps={{ type: "dots" }}
              type={"submit"}
            >
              Add Player
            </Button>
          </Group>
        </form>
        <Table verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Account</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody
            className={
              getPlayersState.isFetching || addPlayerState.isLoading
                ? classes.disabled
                : undefined
            }
          >
            {rows}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  )
}
