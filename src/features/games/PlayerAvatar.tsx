import { Avatar, Stack, Text } from "@mantine/core"
import styles from "./PlayerAvatar.module.css"

interface PlayerAvatarProps {
  name: string
  imageUrl?: string
}

const PlayerAvatar = ({ name, imageUrl }: PlayerAvatarProps) => {
  return (
    <Stack align="center" gap="xs">
      <Avatar
        src={imageUrl}
        alt={name}
        size="xl"
        radius="100%"
        className={styles.avatar}
      />
      <Text size="sm" fw={500} ta="center">
        {name}
      </Text>
    </Stack>
  )
}

export default PlayerAvatar
