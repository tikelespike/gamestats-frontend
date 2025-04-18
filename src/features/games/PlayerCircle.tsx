import { type FC, ReactNode } from "react"
import PlayerAvatar from "./PlayerAvatar"
import styles from "./PlayerCircle.module.css"
import { IconPlus } from "@tabler/icons-react"
import type { PlayerParticipation } from "../api/apiSlice"

interface PlayerCircleProps {
  participations: PlayerParticipation[]
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

const PlayerCircle: FC<PlayerCircleProps> = ({
  participations,
  onAddPlayer,
}) => {
  const elements: { element: ReactNode; key: number | string }[] =
    participations.map(participation => ({
      element: (
        <PlayerAvatar
          key={participation.playerId}
          participation={participation}
        />
      ),
      key: participation.playerId,
    }))

  if (onAddPlayer) {
    elements.unshift({
      element: (
        <PlayerAvatar
          key="add-player"
          overrideText="Add Player"
          onClick={onAddPlayer}
          placeholder={<IconPlus size={"md"} />}
        />
      ),
      key: "add-player",
    })
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
        key={element.key}
      >
        {element.element}
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
