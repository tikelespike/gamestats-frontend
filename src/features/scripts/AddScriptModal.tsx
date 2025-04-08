import { useForm } from "@mantine/form"
import type { AddScriptRequest, Character } from "../api/apiSlice"
import { useCharactersQuery } from "../api/apiSlice"
import { modals } from "@mantine/modals"
import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Group,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"
import { useState } from "react"
import CharacterItem from "./CharacterItem"

const AddScriptModal = () => {
  const { data: characters = [] } = useCharactersQuery()
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null,
  )

  const form = useForm<AddScriptRequest>({
    initialValues: {
      name: "",
      description: null,
      wikiPageLink: null,
      characterIds: [],
    },
  })

  const selectedCharacters = characters.filter(character =>
    form.values.characterIds.includes(character.id),
  )

  const handleAddCharacter = () => {
    if (selectedCharacterId) {
      const characterId = parseInt(selectedCharacterId)
      if (!form.values.characterIds.includes(characterId)) {
        form.setFieldValue("characterIds", [
          ...form.values.characterIds,
          characterId,
        ])
        setSelectedCharacterId(null)
      }
    }
  }

  const handleRemoveCharacter = (characterId: number) => {
    form.setFieldValue(
      "characterIds",
      form.values.characterIds.filter(id => id !== characterId),
    )
  }

  const characterOptions = characters.map(character => ({
    value: character.id.toString(),
    label: character.name,
  }))

  return (
    <form
      onSubmit={form.onSubmit(values => {
        // TODO: Implement script creation
        console.log("Creating script:", values)
        modals.closeAll()
      })}
    >
      <Grid gutter="lg">
        <Grid.Col>
          <TextInput
            label="Script Name"
            placeholder="Trouble Brewing"
            withAsterisk
            {...form.getInputProps("name")}
          />
        </Grid.Col>
        <Grid.Col>
          <Textarea
            label="Description"
            placeholder="An easy script suitable for beginners."
            minRows={3}
            {...form.getInputProps("description")}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            label="Wiki Page URL"
            placeholder="https://wiki.bloodontheclocktower.com/Trouble_Brewing"
            {...form.getInputProps("wikiPageLink")}
          />
        </Grid.Col>
        <Grid.Col>
          <Group align="flex-end">
            <Select
              label="Add Character"
              placeholder="Select a character"
              data={characterOptions}
              value={selectedCharacterId}
              onChange={setSelectedCharacterId}
              searchable
              clearable
              style={{ flex: 1 }}
            />
            <ActionIcon
              variant="filled"
              color="blue"
              size="lg"
              onClick={handleAddCharacter}
              disabled={!selectedCharacterId}
            >
              <IconPlus size={16} />
            </ActionIcon>
          </Group>
        </Grid.Col>
        <Grid.Col>
          {selectedCharacters.length > 0 && (
            <Box mt="md">
              <Text size="sm" fw={500} mb="xs">
                Selected Characters:
              </Text>
              <Group gap="xs">
                {selectedCharacters.map(character => (
                  <CharacterItem
                    key={character.id}
                    character={character}
                    onRemove={handleRemoveCharacter}
                  />
                ))}
              </Group>
            </Box>
          )}
        </Grid.Col>
      </Grid>

      <Group mt="xl" justify="flex-end">
        <Button type="submit">Create</Button>
      </Group>
    </form>
  )
}

export default AddScriptModal
