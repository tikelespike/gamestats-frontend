import React from "react"
import {
  ActionIcon,
  Button,
  Grid,
  Group,
  Modal,
  Text,
  TextInput,
} from "@mantine/core"
import { IconExternalLink } from "@tabler/icons-react"
import { useForm } from "@mantine/form"
import type { Character } from "../api/apiSlice"
import {
  useDeleteCharacterMutation,
  useEditCharacterMutation,
} from "../api/apiSlice"
import { notifications } from "@mantine/notifications"

interface EditCharacterModalProps {
  onClose: () => void
  character: Character
}

export function EditCharacterModal({
  onClose,
  character,
}: EditCharacterModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [editCharacter] = useEditCharacterMutation()
  const [deleteCharacter] = useDeleteCharacterMutation()

  const form = useForm<Character>({
    initialValues: {
      id: character.id,
      version: character.version,
      name: character.name,
      scriptToolIdentifier: character.scriptToolIdentifier,
      wikiPageLink: character.wikiPageLink,
      imageUrl: character.imageUrl,
      type: character.type,
    },
    validate: {
      name: value =>
        value && value.trim().length > 0 ? null : "Character name is required",
    },
  })

  const handleSubmit = async (values: Character) => {
    setIsSubmitting(true)
    try {
      await editCharacter(values).unwrap()
      notifications.show({
        title: "Success",
        message: "Character updated successfully",
        color: "green",
      })
      onClose()
    } catch (err) {
      console.error("Update failed:", err)
      let message: string =
        // @ts-ignore
        "Character could not be updated (error code " + err.status + ")"
      // @ts-ignore
      if (err.status === 409) {
        message =
          "The character was already updated by someone else. Saving your changes may overwrite their changes."
      }
      notifications.show({
        title: "Update failed",
        message: message,
        color: "red",
        autoClose: false,
        position: "top-center",
      })
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteCharacter(character.id).unwrap()
      notifications.show({
        title: "Success",
        message: "Character deleted successfully",
        color: "green",
      })
      onClose()
    } catch (err) {
      console.error("Delete failed:", err)
      notifications.show({
        title: "Delete failed",
        message:
          // @ts-ignore
          "Character could not be deleted (error code " + err.status + ")",
        color: "red",
        autoClose: false,
        position: "top-center",
      })
      setIsDeleting(false)
    }
  }

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid gutter={"lg"}>
          <Grid.Col span={6}>
            <TextInput
              label="Character Name"
              disabled={isSubmitting || isDeleting}
              placeholder="Fortune Teller"
              withAsterisk
              {...form.getInputProps("name")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Script Tool Identifier"
              disabled={isSubmitting || isDeleting}
              placeholder="fortuneteller"
              {...form.getInputProps("scriptToolIdentifier")}
            />
          </Grid.Col>
          <Grid.Col>
            <TextInput
              label="Wiki Page URL"
              disabled={isSubmitting || isDeleting}
              placeholder="https://wiki.bloodontheclocktower.com/Fortune_Teller"
              {...form.getInputProps("wikiPageLink")}
              rightSection={
                form.values.wikiPageLink && (
                  <ActionIcon
                    size={32}
                    color={"blue"}
                    variant="transparent"
                    component="a"
                    href={form.values.wikiPageLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconExternalLink size={16} />
                  </ActionIcon>
                )
              }
            />
          </Grid.Col>
          <Grid.Col>
            <TextInput
              label="Image URL"
              disabled={isSubmitting || isDeleting}
              placeholder="https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Fortune%20Teller_icon.webp"
              {...form.getInputProps("imageUrl")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 6 }}>
            <Button
              fullWidth
              variant={"outline"}
              color={"red"}
              disabled={isSubmitting || isDeleting}
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 6 }}>
            <Button
              fullWidth
              type={"submit"}
              loading={isSubmitting}
              disabled={isDeleting}
            >
              Save
            </Button>
          </Grid.Col>
        </Grid>
      </form>

      <Modal
        opened={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Character"
        centered
        zIndex={1000}
      >
        <Text size="sm">
          Are you sure you want to delete the character "{form.values.name}"?
          This action cannot be undone. All games using this character will be
          affected.
        </Text>
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete} loading={isDeleting}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  )
}
