import type { Script } from "../api/apiSlice"
import { useScriptsQuery } from "../api/apiSlice"
import { Center, Loader, Stack, useMantineTheme } from "@mantine/core"
import { modals } from "@mantine/modals"
import ErrorDisplay from "../../components/ErrorDisplay"
import AddScriptCard from "./AddScriptCard"
import { ScriptCard } from "./ScriptCard"
import { useMediaQuery } from "@mantine/hooks"
import AddScriptModal from "./AddScriptModal"
import DeleteScriptModal from "./DeleteScriptModal"
import EditScriptModal from "./EditScriptModal"

const ScriptManager = () => {
  const theme = useMantineTheme()
  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)
  const { data: scripts = [], isLoading, error } = useScriptsQuery()

  const handleAddScript = () => {
    const modalId = modals.open({
      title: "Add Script",
      centered: true,
      size: "lg",
      fullScreen: isSmallScreen,
      children: (
        <AddScriptModal
          onClose={() => {
            modals.close(modalId)
          }}
        />
      ),
    })
  }

  const handleDeleteScript = (scriptId: number) => {
    const modalId = modals.open({
      title: "Delete Script",
      centered: true,
      children: (
        <DeleteScriptModal
          scriptId={scriptId}
          onClose={() => modals.close(modalId)}
        />
      ),
    })
  }

  const handleEditScript = (script: Script) => {
    const modalId = modals.open({
      title: "Edit Script",
      centered: true,
      size: "lg",
      fullScreen: isSmallScreen,
      children: (
        <EditScriptModal
          onClose={() => modals.close(modalId)}
          script={script}
        />
      ),
    })
  }

  if (isLoading) {
    return (
      <Center>
        <Loader top="40vh" color="blue" size="xl" type="bars" />
      </Center>
    )
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  const scriptCards = scripts.map(script => (
    <ScriptCard
      key={script.id}
      script={script}
      onDelete={() => handleDeleteScript(script.id)}
      onEdit={() => handleEditScript(script)}
    />
  ))

  return (
    <Center mt="xl">
      <Stack gap="lg">
        <AddScriptCard onClick={handleAddScript} />
        {scriptCards}
      </Stack>
    </Center>
  )
}

export default ScriptManager
