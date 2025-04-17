import { Box, Card, Group, Text, Collapse } from "@mantine/core"
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react"
import PlayerCircle from "./PlayerCircle"
import { useState } from "react"
import styles from "./GameManager.module.css"

const GameManager = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }
  const exampleData = [
    {
      id: 1,
      name: "Timo",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Chef_icon.webp",
    },
    {
      id: 2,
      name: "Hannah",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Empath_icon.webp",
    },
    {
      id: 3,
      name: "Pauline",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/demon/Imp_icon.webp",
    },
    {
      id: 4,
      name: "John",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Fortune%20Teller_icon.webp",
    },
    {
      id: 5,
      name: "Sarah",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/minion/Baron_icon.webp",
    },
    {
      id: 6,
      name: "Michael",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Undertaker_icon.webp",
    },
    {
      id: 7,
      name: "Alice",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Investigator_icon.webp",
    },
    {
      id: 8,
      name: "Bob",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Washerwoman_icon.webp",
    },
    {
      id: 9,
      name: "Charlie",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Slayer_icon.webp",
    },
    {
      id: 10,
      name: "David",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Virgin_icon.webp",
    },
  ]

  return (
    <div>
      <Card shadow={"lg"} px={"xl"} withBorder>
        <Group
          className={styles.titleBar}
          onClick={toggleCollapse}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === "Enter" && toggleCollapse()}
        >
          {isCollapsed ? (
            <IconChevronRight size="1.2rem" />
          ) : (
            <IconChevronDown size="1.2rem" />
          )}
          <Text fw={500} my={"xs"} size="lg">
            Monthly Meetup April 2025 - First Game
          </Text>
        </Group>

        <Collapse in={!isCollapsed}>
          <Box pt={"xs"}>
            <Text c={"dimmed"}>
              Gut gewinnt nachdem am zweiten Tag erraten wurde, dass Pauline der
              Imp ist.
            </Text>
            <PlayerCircle players={exampleData} onAddPlayer={() => {}} />
          </Box>
        </Collapse>
      </Card>
    </div>
  )
}

export default GameManager
