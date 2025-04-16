import {
  ActionIcon,
  Avatar,
  Card,
  Group,
  Skeleton,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core"
import { IconEdit, IconExternalLink, IconTrash } from "@tabler/icons-react"
import type { Script } from "../api/apiSlice"
import { useCharactersQuery } from "../api/apiSlice"
import { truncate } from "../../utils/utils"
import styles from "./ScriptCard.module.css"
import { useMediaQuery } from "@mantine/hooks"

interface ScriptCardProps {
  script: Script
  onEdit?: (script: Script) => void
  onDelete?: (script: Script) => void
}

export function ScriptCard({ script, onEdit, onDelete }: ScriptCardProps) {
  const theme = useMantineTheme()
  const isSmallWidth = useMediaQuery(`(max-width: ${theme.breakpoints.md})`)
  const { data: characters, isLoading } = useCharactersQuery()

  const scriptCharacters =
    characters?.filter(char => script.characterIds.includes(char.id)) || []

  const icons = (
    <Group gap="xs">
      {script.wikiPageLink && (
        <ActionIcon
          variant="subtle"
          color="blue"
          component="a"
          href={script.wikiPageLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
        >
          <IconExternalLink size={16} />
        </ActionIcon>
      )}
      {onEdit && (
        <ActionIcon
          variant="subtle"
          color="blue"
          onClick={e => {
            e.stopPropagation()
            onEdit(script)
          }}
        >
          <IconEdit size={16} />
        </ActionIcon>
      )}
      {onDelete && (
        <ActionIcon
          variant="subtle"
          color="red"
          onClick={e => {
            e.stopPropagation()
            onDelete(script)
          }}
        >
          <IconTrash size={16} />
        </ActionIcon>
      )}
    </Group>
  )

  const characterAvatars = (
    <Group gap="xs" ml="md">
      {isLoading
        ? // Show skeleton avatars while loading
          Array.from({ length: Math.min(5, script.characterIds.length) }).map(
            (_, index) => (
              <Skeleton key={index} radius="xl" height={38} width={38} />
            ),
          )
        : scriptCharacters
            .slice(0, 5)
            .map(character => (
              <Avatar
                key={character.id}
                src={character.imageUrl || undefined}
                radius="xl"
                size="md"
              />
            ))}
      {script.characterIds.length > 5 && (
        <Avatar radius="xl" size="md" color="blue">
          +{script.characterIds.length - 5}
        </Avatar>
      )}
    </Group>
  )

  const bodyContent = (
    <>
      {script.description ? (
        <Text size="sm" c="dimmed" style={{ flex: 1 }}>
          {truncate(script.description, 150)}
        </Text>
      ) : (
        <Text size="sm" c="dimmed" style={{ flex: 1 }}>
          <i>No description</i>
        </Text>
      )}
      {characterAvatars}
    </>
  )

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      maw={900}
      className={styles.scriptCard}
      onClick={() => onEdit?.(script)}
    >
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <Text fw={500} size="lg">
            {script.name}
          </Text>
          {icons}
        </Group>

        {isSmallWidth ? (
          <Stack>{bodyContent}</Stack>
        ) : (
          <Group justify="space-between" align="flex-start">
            {bodyContent}
          </Group>
        )}
      </Stack>
    </Card>
  )
}
