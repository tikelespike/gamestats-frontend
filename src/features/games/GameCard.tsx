import type { FC } from "react"
import {
  ActionIcon,
  Button,
  Card,
  Collapse,
  Group,
  Stack,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core"
import styles from "./GameManager.module.css"
import {
  IconChevronDown,
  IconChevronRight,
  IconCrown,
  IconScript,
  IconTrash,
} from "@tabler/icons-react"
import PlayerCircle from "./PlayerCircle"
import { Game, usePlayersQuery, useScriptsQuery } from "../api/apiSlice"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { truncate } from "../../utils/utils"

interface GameCardProps {
  game: Game
  onDelete?: () => void
}

const GameCard: FC<GameCardProps> = ({ game, onDelete }: GameCardProps) => {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`)

  const [opened, { toggle }] = useDisclosure(false)
  const scripts = useScriptsQuery()
  const players = usePlayersQuery()
  const winningNames = game.winningPlayerIds.map(id => {
    if (!players.data) return "Loading name..."

    const player = players.data.find(p => p.id === id)
    if (!player) return "Unknown Player"
    return player?.name.split(" ")[0]
  })

  const winnersJoined = winningNames.join(", ")
  const winnerTextAppendix = ` (${winnersJoined})`
  const winnersText = game.winningAlignment
    ? `${game.winningAlignment.toUpperCase()} TEAM${isMobile ? "" : winnerTextAppendix}`
    : winnersJoined

  return (
    <Card shadow={"lg"} px={"lg"} withBorder>
      <Group
        className={styles.titleBar}
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && toggle()}
        justify="space-between"
      >
        <Group>
          {opened ? (
            <IconChevronDown size="1.2rem" />
          ) : (
            <IconChevronRight size="1.2rem" />
          )}
          <Text fw={500} size="md">
            {truncate(game.name, isMobile ? 30 : 70)}
          </Text>
        </Group>
        {onDelete && (
          <>
            {!isMobile ? (
              <Button
                variant="subtle"
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={e => {
                  e.stopPropagation()
                  onDelete()
                }}
                size="xs"
              >
                Delete
              </Button>
            ) : (
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={e => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                <IconTrash size={16} />
              </ActionIcon>
            )}
          </>
        )}
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
            <Text>{truncate(winnersText, isMobile ? 35 : 70)}</Text>
          </Group>
          <Text mb={"md"} c={"dimmed"}>
            {game.description}
          </Text>
          <PlayerCircle
            participations={game.participants}
            winningPlayerIds={game.winningPlayerIds}
          />
        </Stack>
      </Collapse>
    </Card>
  )
}

export default GameCard
