import React from "react"
import { Box, Button, Group, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import type { Character } from "../api/apiSlice"
import { useBatchDeleteCharactersMutation } from "../api/apiSlice"

interface BatchDeleteDialogProps {
  selectedCharacters: Character[]
  onSuccess?: () => void
  onClose: () => void
}

export function BatchDeleteDialog({
  selectedCharacters,
  onSuccess = () => {},
  onClose,
}: BatchDeleteDialogProps) {
  const [batchDeleteCharacters] = useBatchDeleteCharactersMutation()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      await batchDeleteCharacters(
        selectedCharacters.map(character => character.id),
      ).unwrap()
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to delete characters. Please try again.",
        color: "red",
      })
      setIsSubmitting(false)
      return
    }
    notifications.show({
      title: "Success",
      message: `Deleted ${selectedCharacters.length} characters`,
      color: "green",
    })
    onClose()
    onSuccess()
  }

  return (
    <>
      <Text mb="md">
        Are you sure you want to delete the following{" "}
        {selectedCharacters.length} characters? This action cannot be undone.
        All games using these characters will be affected.
      </Text>
      <Box style={{ maxHeight: "200px", overflowY: "auto" }}>
        {selectedCharacters.map((character, index) => (
          <Text key={index} size="sm" mb="xs">
            • {character.name}
          </Text>
        ))}
      </Box>
      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button color="red" onClick={handleConfirm} loading={isSubmitting}>
          Delete
        </Button>
      </Group>
    </>
  )
}
