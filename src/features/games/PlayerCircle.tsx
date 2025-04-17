import type { FC } from "react"
import PlayerAvatar from "./PlayerAvatar"
import styles from "./PlayerCircle.module.css"

interface Player {
  id: number
  name: string
  imageUrl?: string
}

interface PlayerCircleProps {
  players: Player[]
}

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

const PlayerCircle: FC<PlayerCircleProps> = ({ players }) => {
  const maxRadius: number = 400
  const radius: number = maxRadius * ((players.length + 4) / 24)

  const avatars = players.map((player, index) => {
    const position = calculatePosition(index, players.length, radius)

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
  })

  return (
    <div
      className={styles.circleContainer}
      style={{
        width: `${2 * radius + 100}px`,
        height: `${2 * radius + 100}px`,
      }}
    >
      {avatars}
    </div>
  )
}

export default PlayerCircle
