import { useScriptsQuery } from "../api/apiSlice"
import { Center, Loader, Stack, useMantineTheme } from "@mantine/core"
import { modals } from "@mantine/modals"
import ErrorDisplay from "../../components/ErrorDisplay"
import AddScriptCard from "./AddScriptCard"
import { ScriptCard } from "./ScriptCard"
import { useMediaQuery } from "@mantine/hooks"
import AddScriptModal from "./AddScriptModal"

const ScriptManager = () => {
  const theme = useMantineTheme()
  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)
  const { data: scripts = [], isLoading, error } = useScriptsQuery()

  const handleOpenAddModal = () => {
    modals.open({
      title: "Add Script",
      centered: true,
      size: "md",
      fullScreen: isSmallScreen,
      children: <AddScriptModal />,
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
      onDelete={() => {}}
      onEdit={() => {}}
    />
  ))

  return (
    <Center mt="xl">
      <Stack gap="lg">
        <AddScriptCard onClick={handleOpenAddModal} />
        {scriptCards}
      </Stack>
    </Center>
  )
}

export default ScriptManager
