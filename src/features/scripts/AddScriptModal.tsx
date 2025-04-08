import { useForm } from "@mantine/form"
import type { AddScriptRequest } from "../api/apiSlice"
import { modals } from "@mantine/modals"
import { Button, Grid, Group, Textarea, TextInput } from "@mantine/core"

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

export default AddScriptModal
