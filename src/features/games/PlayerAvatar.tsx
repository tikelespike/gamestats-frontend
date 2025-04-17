import { Avatar, Stack, Text } from "@mantine/core"
import styles from "./PlayerAvatar.module.css"
import type { ReactNode } from "react"

interface PlayerAvatarProps {
  name: string
  imageUrl?: string
  onClick?: () => void
  placeholder?: ReactNode
}

const PlayerAvatar = ({
  name,
  imageUrl,
  onClick,
  placeholder,
}: PlayerAvatarProps) => {
  return (
    <Stack align="center" gap="xs">
      <Avatar
        src={imageUrl}
        size="xl"
        radius="100%"
        className={styles.avatar}
        onClick={onClick}
        p={"md"}
        color={""}
        variant={"transparent"}
      >
        {placeholder}
      </Avatar>
      <Text size="sm" fw={500} ta="center">
        {name}
      </Text>
    </Stack>
  )
}

export default PlayerAvatar
