import { Avatar, Skeleton, Stack, Text } from "@mantine/core"
import styles from "./PlayerAvatar.module.css"
import type { ReactNode } from "react"
import type { PlayerParticipation } from "../api/apiSlice"
import { useCharactersQuery, usePlayersQuery } from "../api/apiSlice"

interface PlayerAvatarProps {
  participation?: PlayerParticipation
  onClick?: () => void
  placeholder?: ReactNode
  overrideText?: string
  isWinner?: boolean
}

const PlayerAvatar = ({
  participation,
  onClick,
  placeholder,
  overrideText,
  isWinner = false,
}: PlayerAvatarProps) => {
  const characters = useCharactersQuery()
  const players = usePlayersQuery()

  return (
    <Stack align="center" gap="xs">
      <Avatar
        src={
          characters.data?.find(c => c.id === participation?.initialCharacterId)
            ?.imageUrl
        }
        size="xl"
        radius="100%"
        className={styles.avatar}
        onClick={onClick}
        p={"md"}
        color={""}
        variant={"transparent"}
      >
        {placeholder || <Skeleton circle width={"100%"} height={"100%"} />}
      </Avatar>

      {players.isLoading && participation && !overrideText ? (
        <Skeleton width={"80px"} height={"15px"} />
      ) : (
        <Text size="sm" fw={500} ta="center">
          {overrideText ||
            players.data
              ?.find(p => p.id === participation?.playerId)
              ?.name.split(" ")[0] + (isWinner ? " 🏆" : "")}
        </Text>
      )}
    </Stack>
  )
}

export default PlayerAvatar
