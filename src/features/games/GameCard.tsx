import type { FC } from "react"
import { Box, Card, Collapse, Group, Text } from "@mantine/core"
import styles from "./GameManager.module.css"
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react"
import PlayerCircle from "./PlayerCircle"
import type { Game } from "../api/apiSlice"
import { useDisclosure } from "@mantine/hooks"

interface GameCardProps {
  game: Game
}

const GameCard: FC<GameCardProps> = ({ game }: GameCardProps) => {
  const [opened, { toggle }] = useDisclosure(false)

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
        <Box pt={"xs"}>
          <Text c={"dimmed"}>{game.description}</Text>
          <PlayerCircle
            participations={game.participants}
            onAddPlayer={() => {}}
          />
        </Box>
      </Collapse>
    </Card>
  )
}

export default GameCard
