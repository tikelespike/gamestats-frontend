import { Avatar, Skeleton, Stack, Text } from "@mantine/core"
import styles from "./PlayerAvatar.module.css"
import type { ReactNode } from "react"
import type { PlayerParticipation } from "../api/apiSlice"
import { useCharactersQuery, usePlayersQuery } from "../api/apiSlice"
import shroudImg from "../../assets/shroud.png"

interface PlayerAvatarProps {
  participation?: PlayerParticipation
  onClick?: () => void
  placeholder?: ReactNode
  overrideText?: string
  isWinner?: boolean
  displayState?: "initial" | "final"
}

const PlayerAvatar = ({
  participation,
  onClick,
  placeholder,
  overrideText,
  isWinner = false,
  displayState = "initial",
}: PlayerAvatarProps) => {
  const characters = useCharactersQuery()
  const players = usePlayersQuery()

  const characterId =
    displayState === "initial"
      ? participation?.initialCharacterId
      : participation?.endCharacterId
  const alignment =
    displayState === "initial"
      ? participation?.initialAlignment
      : participation?.endAlignment

  return (
    <Stack align="center" gap="xs">
      <div
        style={{
          position: "relative",
          display: "inline-block",
          overflow: "visible",
        }}
      >
        <Avatar
          src={characters.data?.find(c => c.id === characterId)?.imageUrl}
          size="xl"
          radius="100%"
          className={styles.avatar}
          onClick={onClick}
          p={"md"}
          variant={"transparent"}
          data-alignment={alignment}
        >
          {placeholder || <Skeleton circle width={"100%"} height={"100%"} />}
        </Avatar>
        {displayState === "final" &&
          participation &&
          !participation.isAliveAtEnd && (
            <img src={shroudImg} alt="shroud" className={styles.shroud} />
          )}
      </div>

      {players.isLoading && participation && !overrideText ? (
        <Skeleton width={"80px"} height={"15px"} />
      ) : (
        <Text size="sm" fw={500} ta="center">
          {overrideText || participation?.playerId ? (
            players.data
              ?.find(p => p.id === participation?.playerId)
              ?.name.split(" ")[0] + (isWinner ? " 🏆" : "")
          ) : (
            <i>Unknown Player</i>
          )}
        </Text>
      )}
    </Stack>
  )
}

export default PlayerAvatar
