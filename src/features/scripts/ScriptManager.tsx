import type { AddScriptRequest } from "../api/apiSlice"
import { useScriptsQuery } from "../api/apiSlice"
import {
  Button,
  Center,
  Grid,
  Group,
  Loader,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core"
import { modals } from "@mantine/modals"
import { useForm } from "@mantine/form"
import ErrorDisplay from "../../components/ErrorDisplay"
import AddScriptCard from "./AddScriptCard"
import { ScriptCard } from "./ScriptCard"

const ScriptManager = () => {
  const { data: scripts = [], isLoading, error } = useScriptsQuery()
  const isSmallScreen = false // We'll remove the responsive behavior for now

  const newScriptForm = useForm<AddScriptRequest>({
    initialValues: {
      name: "",
      description: null,
      wikiPageLink: null,
      characterIds: [],
    },
  })

  const handleOpenAddModal = () => {
    modals.open({
      title: "Add Script",
      centered: true,
      size: "md",
      fullScreen: isSmallScreen,
      children: (
        <form
          onSubmit={newScriptForm.onSubmit(values => handleAddScript(values))}
        >
          <Grid gutter="lg">
            <Grid.Col>
              <TextInput
                label="Script Name"
                placeholder="Trouble Brewing"
                withAsterisk
                {...newScriptForm.getInputProps("name")}
              />
            </Grid.Col>
            <Grid.Col>
              <Textarea
                label="Description"
                placeholder="An easy script suitable for beginners."
                minRows={3}
                {...newScriptForm.getInputProps("description")}
              />
            </Grid.Col>
            <Grid.Col>
              <TextInput
                label="Wiki Page URL"
                placeholder="https://wiki.bloodontheclocktower.com/Trouble_Brewing"
                {...newScriptForm.getInputProps("wikiPageLink")}
              />
            </Grid.Col>
          </Grid>

          <Group mt="xl" justify="flex-end">
            <Button type="submit">Create</Button>
          </Group>
        </form>
      ),
    })
  }

  const handleAddScript = (values: AddScriptRequest) => {
    // TODO: Implement script creation
    console.log("Creating script:", values)
    modals.closeAll()
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
