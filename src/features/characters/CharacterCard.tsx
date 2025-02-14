import React from "react"
import { Avatar, Paper, Text } from "@mantine/core"
import styles from "./CharacterCard.module.css"

interface CharacterCardProps {
  name: string
  type: string
  icon: string
  onClick: () => void // Required click handler to open modal
}

export function CharacterCard({
  name,
  type,
  icon,
  onClick,
}: CharacterCardProps) {
  return (
    <Paper
      withBorder
      shadow="lg"
      className={styles.characterCard}
      onClick={onClick}
      role="button"
      tabIndex={0} // Allows keyboard navigation
      onKeyDown={e => e.key === "Enter" && onClick()}
    >
      <Avatar size={50} src={icon} radius={50} my="xs" />
      <div className={styles.textContainer}>
        <Text fz="md">{name}</Text>
        <Text c="dimmed" fz="sm">
          {type}
        </Text>
      </div>
    </Paper>
  )
}

export default CharacterCard
