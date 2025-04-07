import { ActionIcon, Avatar, Card, Group, Stack, Text } from "@mantine/core"
import { IconEdit, IconExternalLink, IconTrash } from "@tabler/icons-react"
import type { Script } from "../api/apiSlice"
import { useCharactersQuery } from "../api/apiSlice"
import { truncate } from "../../utils/utils"
import styles from "./ScriptCard.module.css"

interface ScriptCardProps {
  script: Script
  onEdit?: (script: Script) => void
  onDelete?: (script: Script) => void
}

export function ScriptCard({ script, onEdit, onDelete }: ScriptCardProps) {
  const { data: characters } = useCharactersQuery()

  const scriptCharacters =
    characters?.filter(char => script.characterIds.includes(char.id)) || []

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      maw={600}
      className={styles.scriptCard}
    >
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <Text fw={500} size="lg">
            {script.name}
          </Text>
          <Group gap="xs">
            {script.wikiPageLink && (
              <ActionIcon
                variant="subtle"
                color="blue"
                component="a"
                href={script.wikiPageLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconExternalLink size={16} />
              </ActionIcon>
            )}
            {onEdit && (
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={() => onEdit(script)}
              >
                <IconEdit size={16} />
              </ActionIcon>
            )}
            {onDelete && (
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => onDelete(script)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            )}
          </Group>
        </Group>

        <Group justify="space-between" align="flex-start">
          {script.description ? (
            <Text size="sm" c="dimmed" style={{ flex: 1 }}>
              {truncate(script.description, 85)}
            </Text>
          ) : (
            <Text size="sm" c="dimmed" style={{ flex: 1 }}>
              <i>No description</i>
            </Text>
          )}
          <Group gap="xs" ml="md">
            {scriptCharacters.slice(0, 5).map(character => (
              <Avatar
                key={character.id}
                src={character.imageUrl || undefined}
                alt={character.name}
                radius="xl"
                size="md"
              />
            ))}
            {scriptCharacters.length > 5 && (
              <Avatar radius="xl" size="md" color="blue">
                +{scriptCharacters.length - 5}
              </Avatar>
            )}
          </Group>
        </Group>
      </Stack>
    </Card>
  )
}
