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
  useMantineTheme,
} from "@mantine/core"
import { modals } from "@mantine/modals"
import { useForm } from "@mantine/form"
import ErrorDisplay from "../../components/ErrorDisplay"
import AddScriptCard from "./AddScriptCard"
import { ScriptCard } from "./ScriptCard"
import { useMediaQuery } from "@mantine/hooks"

const AddScriptModal = () => {
  const form = useForm<AddScriptRequest>({
    initialValues: {
      name: "",
      description: "",
      wikiPageLink: "",
      characterIds: [],
    },
  })

  return (
    <form
      onSubmit={form.onSubmit(values => {
        // TODO: Implement script creation
        console.log("Creating script:", values)
        modals.closeAll()
      })}
    >
      <Grid gutter="lg">
        <Grid.Col>
          <TextInput
            label="Script Name"
            placeholder="Trouble Brewing"
            withAsterisk
            {...form.getInputProps("name")}
          />
        </Grid.Col>
        <Grid.Col>
          <Textarea
            label="Description"
            placeholder="An easy script suitable for beginners."
            minRows={3}
            {...form.getInputProps("description")}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            label="Wiki Page URL"
            placeholder="https://wiki.bloodontheclocktower.com/Trouble_Brewing"
            {...form.getInputProps("wikiPageLink")}
          />
        </Grid.Col>
      </Grid>

      <Group mt="xl" justify="flex-end">
        <Button type="submit">Create</Button>
      </Group>
    </form>
  )
}

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
