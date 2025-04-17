import { type FC } from "react"
import PlayerAvatar from "./PlayerAvatar"
import styles from "./PlayerCircle.module.css"
import { IconPlus } from "@tabler/icons-react"

interface Player {
  id: number
  name: string
  imageUrl?: string
}

interface PlayerCircleProps {
  players: Player[]
  onAddPlayer?: () => void
}

const calculatePosition = (
  index: number,
  totalPlayers: number,
  radius: number,
): { x: number; y: number } => {
  const angle = (index / totalPlayers) * 2 * Math.PI + Math.PI / 2

  const x = radius + radius * Math.cos(angle)
  const y = radius + radius * Math.sin(angle)

  return { x, y }
}

const PlayerCircle: FC<PlayerCircleProps> = ({ players, onAddPlayer }) => {
  const elements = players.map(player => (
    <PlayerAvatar
      key={player.id}
      imageUrl={player.imageUrl}
      name={player.name}
    />
  ))

  if (onAddPlayer) {
    elements.unshift(
      <PlayerAvatar
        key="add-player"
        name="Add Player"
        onClick={onAddPlayer}
        placeholder={<IconPlus size={"md"} />}
      />,
    )
  }

  const maxRadius: number = 400
  const radius: number = maxRadius * ((elements.length + 4) / 24)

  const positionedElements = elements.map((element, index) => {
    const position = calculatePosition(index, elements.length, radius)

    return (
      <div
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {element}
      </div>
    )
  })

  return (
    <div
      className={styles.circleContainer}
      style={{
        width: `${2 * radius + 100}px`,
        height: `${2 * radius + 100}px`,
      }}
    >
      {positionedElements}
    </div>
  )
}

export default PlayerCircle
