import styles from "./AddScriptCard.module.css"
import { Center, Paper } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"

export interface AddScriptCardProps {
  onClick: () => void
}

const AddScriptCard = ({ onClick }: AddScriptCardProps) => {
  return (
    <Paper
      p="lg"
      radius="md"
      withBorder
      maw={900}
      className={styles.scriptCard}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick()}
    >
      <Center>
        <IconPlus size={40} />
      </Center>
    </Paper>
  )
}

export default AddScriptCard
