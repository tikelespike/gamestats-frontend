import { useState } from "react"
import { Box, Button, Group, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import type { Character } from "../api/apiSlice"
import { useBatchUpdateCharactersMutation } from "../api/apiSlice"
import { titleCase } from "../../utils/utils"

interface BatchUpdateDialogProps {
  characters: Character[]
  onSuccess?: () => void
  onClose: () => void
}

export function BatchUpdateDialog({
  characters,
  onSuccess = () => {},
  onClose,
}: BatchUpdateDialogProps) {
  const [batchUpdateCharacters] = useBatchUpdateCharactersMutation()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      await batchUpdateCharacters(characters).unwrap()
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to update characters. Please try again.",
        color: "red",
      })
      setIsSubmitting(false)
      return
    }
    notifications.show({
      title: "Success",
      message: `Updated ${characters.length} characters`,
      color: "green",
    })
    onClose()
    onSuccess()
  }

  return (
    <>
      <Text mb="md">
        The following {characters.length} characters do not match their latest
        official versions. Do you want to update them? WARNING: This will
        overwrite any custom changes made to these characters.
      </Text>
      <Box style={{ maxHeight: "200px", overflowY: "auto" }}>
        {characters.map((character, index) => (
          <Text key={index} size="sm" mb="xs">
            • {character.name} ({titleCase(character.type.toString())})
          </Text>
        ))}
      </Box>
      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button color="blue" onClick={handleConfirm} loading={isSubmitting}>
          Update All
        </Button>
      </Group>
    </>
  )
}
