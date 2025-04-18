import { useDeleteGameMutation } from "../api/apiSlice"
import { Button, Group, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useState } from "react"

interface DeleteGameModalProps {
  gameId: number
  onSuccess?: () => void
  onClose: () => void
}

const DeleteGameModal = ({
  gameId,
  onSuccess = () => {},
  onClose,
}: DeleteGameModalProps) => {
  const [deleteGame] = useDeleteGameMutation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelete = async () => {
    setIsSubmitting(true)
    try {
      await deleteGame(gameId).unwrap()
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete game. Please try again.",
        color: "red",
      })
      setIsSubmitting(false)
      return
    }
    notifications.show({
      title: "Success",
      message: "Game deleted successfully",
      color: "green",
    })
    onClose()
    onSuccess()
  }

  return (
    <>
      <Text mb="md">
        Are you sure you want to delete this game? This action cannot be undone.
      </Text>
      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button color="red" onClick={handleDelete} loading={isSubmitting}>
          Delete
        </Button>
      </Group>
    </>
  )
}

export default DeleteGameModal 