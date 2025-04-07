import React from "react"
import { ScriptCard } from "./ScriptCard"
import { Center, Loader, Stack } from "@mantine/core"
import { useScriptsQuery } from "../api/apiSlice"
import ErrorDisplay from "../../components/ErrorDisplay"

const ScriptManager = () => {
  const { data: scripts, isLoading, error } = useScriptsQuery()

  if (isLoading) {
    return (
      <Center>
        <Loader top="40vh" color="blue" size="xl" type="bars" />
      </Center>
    )
  }

  if (error || !scripts) {
    return <ErrorDisplay error={error} />
  }

  if (scripts.length === 0) {
    return (
      <Center mt="xl">
        <div>No scripts found</div>
      </Center>
    )
  }

  const scriptCards = scripts.map(script => (
    <ScriptCard
      key={script.id}
      script={script}
      onDelete={() => {}}
      onEdit={() => {}}
    />
  ))

  return (
    <Center mt={"xl"}>
      <Stack gap={"lg"}>{scriptCards}</Stack>
    </Center>
  )
}

export default ScriptManager
