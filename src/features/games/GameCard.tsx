import type { FC } from "react"
import { Card, Collapse, Group, Stack, Text, ThemeIcon } from "@mantine/core"
import styles from "./GameManager.module.css"
import {
  IconChevronDown,
  IconChevronRight,
  IconCrown,
  IconScript,
} from "@tabler/icons-react"
import PlayerCircle from "./PlayerCircle"
import { Game, usePlayersQuery, useScriptsQuery } from "../api/apiSlice"
import { useDisclosure } from "@mantine/hooks"

interface GameCardProps {
  game: Game
}

const GameCard: FC<GameCardProps> = ({ game }: GameCardProps) => {
  const [opened, { toggle }] = useDisclosure(false)
  const scripts = useScriptsQuery()
  const players = usePlayersQuery()
  const winningNames = game.winningPlayerIds.map(id => {
    if (!players.data) return "Loading name..."

    const player = players.data.find(p => p.id === id)
    if (!player) return "Unknown Player"
    return player?.name.split(" ")[0]
  })

  return (
    <Card shadow={"lg"} px={"xl"} withBorder>
      <Group
        className={styles.titleBar}
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && toggle()}
      >
        {opened ? (
          <IconChevronDown size="1.2rem" />
        ) : (
          <IconChevronRight size="1.2rem" />
        )}
        <Text fw={500} my={"xs"} size="lg">
          {game.name}
        </Text>
      </Group>
      <Collapse in={opened}>
        <Stack maw={"800px"} pt={"xl"}>
          <Group>
            <ThemeIcon size="lg" variant="light">
              <IconScript style={{ width: "70%", height: "70%" }} />
            </ThemeIcon>
            <Text>
              {scripts.data ? (
                scripts.data.find(s => s.id === game.scriptId)?.name
              ) : (
                <i>Loading...</i>
              )}
            </Text>
          </Group>
          <Group>
            <ThemeIcon size="lg" variant="light" color="yellow">
              <IconCrown style={{ width: "70%", height: "70%" }} />
            </ThemeIcon>
            <Text>
              {game.winningAlignment
                ? `${game.winningAlignment.toUpperCase()} TEAM (${winningNames.join(", ")})`
                : winningNames.join(", ")}
            </Text>
          </Group>
          <Text mb={"md"} c={"dimmed"}>
            {game.description}
          </Text>
          <PlayerCircle participations={game.participants} />
        </Stack>
      </Collapse>
    </Card>
  )
}

export default GameCard
