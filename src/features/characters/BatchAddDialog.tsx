import { useState } from "react"
import { Box, Button, Group, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import type { AddCharacterRequest } from "../api/apiSlice"
import { useBatchAddCharactersMutation } from "../api/apiSlice"
import { titleCase } from "../../utils/utils"

interface BatchAddDialogProps {
  characters: AddCharacterRequest[]
  onSuccess?: () => void
  onClose: () => void
}

export function BatchAddDialog({
  characters,
  onSuccess = () => {},
  onClose,
}: BatchAddDialogProps) {
  const [batchAddCharacters] = useBatchAddCharactersMutation()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      await batchAddCharacters(characters).unwrap()
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to add characters. Please try again.",
        color: "red",
      })
      setIsSubmitting(false)
      return
    }
    notifications.show({
      title: "Success",
      message: `Added ${characters.length} characters`,
      color: "green",
    })
    onClose()
    onSuccess()
  }

  return (
    <>
      <Text mb="md">
        The following {characters.length} officially published characters are
        not yet imported into this application. Do you want to automatically add
        all of them?
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
          Add All
        </Button>
      </Group>
    </>
  )
}
