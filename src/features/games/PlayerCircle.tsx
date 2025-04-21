import type { ReactNode } from "react"
import { type FC, useState } from "react"
import PlayerAvatar from "./PlayerAvatar"
import { IconPlus } from "@tabler/icons-react"
import { Box, Grid, SegmentedControl, useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import styles from "./PlayerCircle.module.css"
import { modals } from "@mantine/modals"
import EditParticipationModal from "./EditParticipationModal"
import type { IndexedPlayerParticipation } from "./GameCard"
import type { Script } from "../api/apiSlice"

interface PlayerCircleProps {
  participations: IndexedPlayerParticipation[]
  winningPlayerIds?: number[]
  isEditing?: boolean
  onParticipationsChange?: (
    participations: IndexedPlayerParticipation[],
  ) => void
  script?: Script
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
  winningPlayerIds,
  isEditing = false,
  onParticipationsChange,
  script,
}) => {
  const [displayState, setDisplayState] = useState<"initial" | "final">("final")
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`)

  const elements: { element: ReactNode; key: number | string }[] =
    participations.map(participation => {
      const handleClick = () => {
        const onParticipationUpdate: (
          updated: IndexedPlayerParticipation,
        ) => void = updated => {
          const player = updated.participation.playerId
          onParticipationsChange?.(
            participations.map(p => {
              if (p.seatId === updated.seatId) {
                return updated
              }
              // ensure we don't have two participations with the same playerId
              // the user will need to reassign a new player to the seat where the player was seated before
              if (p.participation.playerId === player) {
                return {
                  ...p,
                  participation: {
                    ...p.participation,
                    playerId: null,
                  },
                }
              }
              return p
            }),
          )
        }
        const modalId = modals.open({
          title: "Edit Participation",
          centered: true,
          children: (
            <EditParticipationModal
              participation={participation}
              onChange={onParticipationUpdate}
              onClose={() => modals.close(modalId)}
              script={script}
            />
          ),
        })
      }
      return {
        element: (
          <PlayerAvatar
            key={participation.seatId}
            participation={participation.participation}
            isWinner={
              participation.participation.playerId
                ? winningPlayerIds?.includes(
                    participation.participation.playerId,
                  )
                : false
            }
            displayState={displayState}
            onClick={isEditing ? handleClick : undefined}
          />
        ),
        key: participation.seatId,
      }
    })

  if (isEditing) {
    elements.unshift({
      element: (
        <PlayerAvatar
          key="add-player"
          overrideText="Add Player"
          onClick={() => {}}
          placeholder={<IconPlus size={"md"} />}
        />
      ),
      key: "add-player",
    })
  }

  if (isMobile) {
    return (
      <Box my="xs">
        <Box style={{ display: "flex", justifyContent: "center" }}>
          <SegmentedControl
            value={displayState}
            onChange={value => setDisplayState(value as "initial" | "final")}
            data={[
              { label: "Beginning", value: "initial" },
              { label: "End", value: "final" },
            ]}
          />
        </Box>
        <Grid my={"xl"} gutter="md">
          {elements.map(element => (
            <Grid.Col key={element.key} span={4}>
              <Box style={{ display: "flex", justifyContent: "center" }}>
                {element.element}
              </Box>
            </Grid.Col>
          ))}
        </Grid>
      </Box>
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
        key={element.key}
      >
        {element.element}
      </div>
    )
  })

  return (
    <Box
      className={styles.circleContainer}
      style={{
        width: `${2 * radius + 100}px`,
        height: `${2 * radius + 100}px`,
      }}
      my={"xl"}
    >
      {positionedElements}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <SegmentedControl
          value={displayState}
          onChange={value => setDisplayState(value as "initial" | "final")}
          data={[
            { label: "Beginning", value: "initial" },
            { label: "End", value: "final" },
          ]}
        />
      </div>
    </Box>
  )
}

export default PlayerCircle
