import React from "react"
import {
  ActionIcon,
  Autocomplete,
  Button,
  Grid,
  Group,
  TextInput,
  useMantineTheme,
} from "@mantine/core"
import { IconExternalLink, IconWand } from "@tabler/icons-react"
import { useForm } from "@mantine/form"
import {
  AddCharacterRequest,
  Character,
  CharacterType,
  useAddCharacterMutation,
  useCharactersQuery,
  useOfficialCharactersQuery,
} from "../api/apiSlice"
import { notifications } from "@mantine/notifications"

interface AddCharacterModalProps {
  onClose: () => void
}

export function AddCharacterModal({ onClose }: AddCharacterModalProps) {
  const theme = useMantineTheme()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [addCharacter] = useAddCharacterMutation()
  const getOfficialCharactersState = useOfficialCharactersQuery()
  const getCharactersState = useCharactersQuery()
  const characters: Character[] = getCharactersState.data || []

  const officialCharacters: AddCharacterRequest[] =
    getOfficialCharactersState.isSuccess && getOfficialCharactersState.data
      ? getOfficialCharactersState.data
      : []
  const officialNames: string[] = officialCharacters.map(
    character => character.name,
  )

  const form = useForm<AddCharacterRequest>({
    initialValues: {
      name: "",
      scriptToolIdentifier: null,
      type: CharacterType.Townsfolk,
      wikiPageLink: null,
      imageUrl: null,
    },
    validate: {
      name: value =>
        value && value.trim().length > 0 ? null : "Character name is required",
    },
  })

  const handleMagicComplete = () => {
    const officialCharacter = officialCharacters.find(
      character => character.name === form.values.name,
    )
    if (officialCharacter === undefined) {
      return
    }
    form.setValues({
      ...form.values,
      scriptToolIdentifier: officialCharacter.scriptToolIdentifier,
      type: officialCharacter.type,
      wikiPageLink: officialCharacter.wikiPageLink,
      imageUrl: officialCharacter.imageUrl,
    })
  }

  const handleSubmit = async (values: AddCharacterRequest) => {
    setIsSubmitting(true)
    try {
      await addCharacter(values).unwrap()
      notifications.show({
        title: "Success",
        message: "Character created successfully",
        color: "green",
      })
      onClose()
    } catch (err) {
      console.error("Creation failed:", err)
      notifications.show({
        title: "Creation failed",
        message:
          // @ts-ignore
          "Character could not be created (error code " + err.status + ")",
        color: "red",
        autoClose: false,
        position: "top-center",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Grid gutter={"lg"}>
        <Grid.Col span={6}>
          <Autocomplete
            label="Character Name"
            disabled={isSubmitting}
            placeholder="Fortune Teller"
            withAsterisk
            data={officialNames.filter(
              name => !characters.some(c => c.name === name),
            )}
            {...form.getInputProps("name")}
            rightSection={
              <ActionIcon
                size={32}
                color={theme.primaryColor}
                variant="transparent"
                disabled={
                  isSubmitting || !officialNames.includes(form.values.name)
                }
                onClick={handleMagicComplete}
              >
                <IconWand size={18} stroke={1.5} />
              </ActionIcon>
            }
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Script Tool Identifier"
            disabled={isSubmitting}
            placeholder="fortuneteller"
            {...form.getInputProps("scriptToolIdentifier")}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            label="Wiki Page URL"
            disabled={isSubmitting}
            placeholder="https://wiki.bloodontheclocktower.com/Fortune_Teller"
            {...form.getInputProps("wikiPageLink")}
            rightSection={
              form.getValues().wikiPageLink && (
                <ActionIcon
                  size={32}
                  color={"blue"}
                  variant="transparent"
                  component="a"
                  href={form.getValues().wikiPageLink!}
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
            disabled={isSubmitting}
            placeholder="https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Fortune%20Teller_icon.webp"
            {...form.getInputProps("imageUrl")}
          />
        </Grid.Col>
      </Grid>

      <Group mt="xl" justify="flex-end">
        <Button variant="default" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Create
        </Button>
      </Group>
    </form>
  )
}
