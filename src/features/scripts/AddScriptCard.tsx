import React from "react"
import styles from "./AddScriptCard.module.css"
import { Center, Paper } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"

const AddScriptCard = () => {
  return (
    <Paper
      p="lg"
      radius="md"
      withBorder
      maw={900}
      className={styles.scriptCard}
    >
      <Center>
        <IconPlus size={40} />
      </Center>
    </Paper>
  )
}

export default AddScriptCard
