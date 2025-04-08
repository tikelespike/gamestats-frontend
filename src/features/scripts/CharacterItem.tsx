import {
  ActionIcon,
  Group,
  Image,
  Paper,
  Text,
  useMantineColorScheme,
} from "@mantine/core"
import { IconX } from "@tabler/icons-react"
import type { Character } from "../api/apiSlice"

interface CharacterItemProps {
  character: Character
  onRemove?: (characterId: number) => void
}

const CharacterItem = ({ character, onRemove }: CharacterItemProps) => {
  const { colorScheme } = useMantineColorScheme()

  return (
    <Paper
      p="xs"
      radius="sm"
      style={{
        backgroundColor:
          colorScheme === "dark"
            ? "var(--mantine-color-dark-6)"
            : "var(--mantine-color-gray-1)",
      }}
    >
      <Group gap="xs" wrap="nowrap">
        <Image src={character.imageUrl} w={24} h={24} radius="sm" />
        <Text size="sm" style={{ flex: 1 }} truncate>
          {character.name}
        </Text>
        {onRemove && (
          <ActionIcon
            size="xs"
            variant="transparent"
            color="gray"
            onClick={() => onRemove(character.id)}
          >
            <IconX size={12} />
          </ActionIcon>
        )}
      </Group>
    </Paper>
  )
}

export default CharacterItem
