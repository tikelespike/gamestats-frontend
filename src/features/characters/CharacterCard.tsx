import type React from "react"
import { Avatar, Checkbox, Paper, Text } from "@mantine/core"
import styles from "./CharacterCard.module.css"
import type { Character } from "../api/apiSlice"
import { titleCase } from "../../utils/utils"

interface CharacterCardProps {
  character: Character
  onClick: () => void
  isSelected?: boolean
  isMultiSelectMode?: boolean
}

export function CharacterCard({
  character,
  onClick,
  isSelected = false,
  isMultiSelectMode = false,
}: CharacterCardProps) {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick()
  }

  return (
    <Paper
      withBorder
      shadow="sm"
      display="flex"
      className={`${styles.characterCard} ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick()}
    >
      {isMultiSelectMode && (
        <Checkbox
          checked={isSelected}
          onChange={() => {}}
          onClick={handleCheckboxClick}
          size="sm"
          className={styles.checkbox}
        />
      )}
      <Avatar size={50} src={character.imageUrl} radius={50} my="xs" />
      <div className={styles.textContainer}>
        <Text fz="md">{character.name}</Text>
        <Text c="dimmed" fz="sm">
          {titleCase(character.type.toString())}
        </Text>
      </div>
    </Paper>
  )
}

export default CharacterCard
