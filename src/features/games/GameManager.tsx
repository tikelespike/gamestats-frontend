import React from "react"
import PlayerAvatar from "./PlayerAvatar"
import styles from "./GameManager.module.css"
import { Card } from "@mantine/core"

const GameManager = () => {
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

  const calculatePosition = (
    index: number,
    totalPlayers: number,
    radius: number,
  ): { x: number; y: number } => {
    const angle = (index / totalPlayers) * 2 * Math.PI

    const x = radius + radius * Math.cos(angle)
    const y = radius + radius * Math.sin(angle)

    return { x, y }
  }

  const maxRadius: number = 400
  const radius: number = maxRadius * ((exampleData.length + 4) / 24)

  return (
    <div>
      <h1>Game Manager</h1>
      <Card shadow={"lg"} withBorder>
        <div
          className={styles.circleContainer}
          style={{
            width: `${2 * radius + 100}px`,
            height: `${2 * radius + 100}px`,
          }}
        >
          {exampleData.map((player, index) => {
            const position = calculatePosition(
              index,
              exampleData.length,
              radius,
            )

            return (
              <div
                key={player.id}
                style={{
                  position: "absolute",
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                }}
              >
                <PlayerAvatar imageUrl={player.imageUrl} name={player.name} />
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

export default GameManager
