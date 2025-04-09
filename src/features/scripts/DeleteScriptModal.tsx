import { useDeleteScriptMutation } from "../api/apiSlice"
import { Button, Group, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useState } from "react"

interface DeleteScriptModalProps {
  scriptId: number
  onClose: () => void
}

const DeleteScriptModal = ({ scriptId, onClose }: DeleteScriptModalProps) => {
  const [deleteScript] = useDeleteScriptMutation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsSubmitting(true)
      await deleteScript(scriptId).unwrap()
      notifications.show({
        title: "Success",
        message: "Script deleted successfully",
        color: "green",
      })
      onClose()
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete script. Please try again.",
        color: "red",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Text mb="md">
        Are you sure you want to delete this script? This action cannot be
        undone.
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

export default DeleteScriptModal
