import React from "react"
import { Paper } from "@mantine/core"
import styles from "./AddCharacterCard.module.css"
import { IconPlus } from "@tabler/icons-react"

interface AddCharacterCardProps {
  onClick: () => void
}

export function AddCharacterCard({ onClick }: AddCharacterCardProps) {
  return (
    <Paper
      withBorder
      display="flex"
      className={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick()}
    >
      <IconPlus size={50} />
    </Paper>
  )
}

export default AddCharacterCard
