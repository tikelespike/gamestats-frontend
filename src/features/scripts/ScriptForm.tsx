import { useForm } from "@mantine/form"
import type { AddScriptRequest, Character } from "../api/apiSlice"
import { CharacterType, useCharactersQuery } from "../api/apiSlice"
import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  Group,
  Select,
  Stack,
  Textarea,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core"
import {
  IconChevronDown,
  IconChevronRight,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react"
import { useState } from "react"
import CharacterItem from "./CharacterItem"
import ImportScriptDialog from "./ImportScriptDialog"

export interface ScriptFormProps {
  initialValues?: Partial<AddScriptRequest>
  onSubmit: (values: AddScriptRequest) => Promise<void>
  submitLabel?: string
  isSubmitting?: boolean
}

const MAX_DESCRIPTION_LENGTH = 5000
const ScriptForm = ({
  initialValues = {
    name: "",
    description: null,
    wikiPageLink: null,
    characterIds: [],
  },
  onSubmit,
  submitLabel = "Create",
  isSubmitting = false,
}: ScriptFormProps) => {
  const { data: characters = [] } = useCharactersQuery()
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null,
  )
  const [expandedTypes, setExpandedTypes] = useState<
    Record<CharacterType, boolean>
  >({
    [CharacterType.Townsfolk]: true,
    [CharacterType.Outsider]: true,
    [CharacterType.Minion]: true,
    [CharacterType.Demon]: true,
    [CharacterType.Traveller]: true,
  })
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  const form = useForm<AddScriptRequest>({
    initialValues: initialValues as AddScriptRequest,
    validate: {
      name: value =>
        value.trim().length > 0 ? null : "Script name is required",
      description: value =>
        !value || value.length <= MAX_DESCRIPTION_LENGTH
          ? null
          : "Description too long",
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

  const toggleTypeExpanded = (type: CharacterType) => {
    setExpandedTypes(prev => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const characterOptions = characters
    .filter(
      character =>
        !form.values.characterIds.includes(character.id) &&
        character.type !== CharacterType.Traveller, // Travellers play a special role and should not be included in scripts
    )
    .map(character => ({
      value: character.id.toString(),
      label: character.name,
    }))

  const charactersByType = selectedCharacters.reduce<
    Record<CharacterType, Character[]>
  >(
    (acc, character) => {
      if (!acc[character.type]) {
        acc[character.type] = []
      }
      acc[character.type].push(character)
      acc[character.type].sort((a, b) => a.name.localeCompare(b.name))
      return acc
    },
    {} as Record<CharacterType, Character[]>,
  )

  const characterTypeOrder = [
    CharacterType.Townsfolk,
    CharacterType.Outsider,
    CharacterType.Minion,
    CharacterType.Demon,
    CharacterType.Traveller,
  ]

  const formatCharacterType = (type: CharacterType): string => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  const handleImport = (script: AddScriptRequest) => {
    form.setValues(script)
    setIsImportDialogOpen(false)
  }

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Grid gutter="lg">
          <Grid.Col>
            <Group justify="space-between" align="flex-end">
              <TextInput
                label="Script Name"
                placeholder="Trouble Brewing"
                withAsterisk
                disabled={isSubmitting}
                style={{ flex: 1 }}
                {...form.getInputProps("name")}
              />
              <Button
                leftSection={<IconUpload size={16} />}
                variant="light"
                onClick={() => setIsImportDialogOpen(true)}
                disabled={isSubmitting}
              >
                Import
              </Button>
            </Group>
          </Grid.Col>
          <Grid.Col>
            <Textarea
              label="Description"
              placeholder="An easy script suitable for beginners."
              minRows={3}
              maxLength={MAX_DESCRIPTION_LENGTH}
              autosize
              disabled={isSubmitting}
              {...form.getInputProps("description")}
            />
          </Grid.Col>
          <Grid.Col>
            <TextInput
              label="Wiki Page URL"
              placeholder="https://wiki.bloodontheclocktower.com/Trouble_Brewing"
              disabled={isSubmitting}
              {...form.getInputProps("wikiPageLink")}
            />
          </Grid.Col>
          <Grid.Col>
            <Group align="flex-end">
              <Select
                label="Add Character"
                placeholder="Search for a character"
                data={characterOptions}
                value={selectedCharacterId}
                onChange={setSelectedCharacterId}
                searchable
                clearable
                disabled={isSubmitting}
                style={{ flex: 1 }}
              />
              <ActionIcon
                variant="filled"
                color="blue"
                size="lg"
                onClick={handleAddCharacter}
                disabled={!selectedCharacterId || isSubmitting}
              >
                <IconPlus size={16} />
              </ActionIcon>
            </Group>
          </Grid.Col>
          <Grid.Col>
            {selectedCharacters.length > 0 && (
              <Box mt="md">
                <Stack gap={0}>
                  {characterTypeOrder.map(type => {
                    const typeCharacters = charactersByType[type] || []
                    if (typeCharacters.length === 0) return null
                    const lastType: CharacterType = characterTypeOrder
                      .filter(t => charactersByType[t]?.length > 0)
                      .slice(-1)[0]

                    return (
                      <Box key={type}>
                        <UnstyledButton
                          onClick={() => toggleTypeExpanded(type)}
                          style={{ width: "100%" }}
                          disabled={isSubmitting}
                        >
                          <Group justify="space-between" wrap="nowrap">
                            <Title order={6}>
                              {formatCharacterType(type)} (
                              {typeCharacters.length})
                            </Title>
                            {expandedTypes[type] ? (
                              <IconChevronDown size={16} />
                            ) : (
                              <IconChevronRight size={16} />
                            )}
                          </Group>
                        </UnstyledButton>
                        <Collapse in={expandedTypes[type]}>
                          <Group gap="xs" mt="xs">
                            {typeCharacters.map(character => (
                              <CharacterItem
                                key={character.id}
                                character={character}
                                onRemove={handleRemoveCharacter}
                                disabled={isSubmitting}
                              />
                            ))}
                          </Group>
                        </Collapse>
                        {type !== lastType && <Divider my="sm" />}
                      </Box>
                    )
                  })}
                </Stack>
              </Box>
            )}
          </Grid.Col>
        </Grid>

        <Group mt="xl" justify="flex-end">
          <Button type="submit" loading={isSubmitting}>
            {submitLabel}
          </Button>
        </Group>
      </form>

      <ImportScriptDialog
        opened={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImport}
      />
    </>
  )
}

export default ScriptForm
