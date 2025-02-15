import React from "react"
import { Avatar, Paper, Text } from "@mantine/core"
import styles from "./CharacterCard.module.css"
import type { CharacterType } from "../api/apiSlice"

interface CharacterCardProps {
  name: string
  type: CharacterType
  icon: string | null
  onClick: () => void
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
      shadow="sm"
      display="flex"
      className={styles.characterCard}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick()}
    >
      <Avatar size={50} src={icon} radius={50} my="xs" />
      <div className={styles.textContainer}>
        <Text fz="md">{name}</Text>
        <Text c="dimmed" fz="sm">
          {titleCase(type.toString())}
        </Text>
      </div>
    </Paper>
  )
}

function titleCase(str: string): string {
  var splitStr = str.toLowerCase().split(" ")
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
  }
  return splitStr.join(" ")
}

export default CharacterCard
