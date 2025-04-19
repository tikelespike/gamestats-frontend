import { useForm } from "@mantine/form"
import { Button, Checkbox, Grid, Group, Select } from "@mantine/core"
import {
  type PlayerParticipation,
  useCharactersQuery,
  usePlayersQuery,
} from "../api/apiSlice"

interface EditParticipationModalProps {
  participation: PlayerParticipation
  onChange: (updated: PlayerParticipation) => void
  onClose: () => void
}

const EditParticipationModal = ({
  participation,
  onChange,
  onClose,
}: EditParticipationModalProps) => {
  const players = usePlayersQuery()
  const characters = useCharactersQuery()

  const form = useForm<PlayerParticipation>({
    initialValues: {
      playerId: participation.playerId,
      initialCharacterId: participation.initialCharacterId,
      initialAlignment: participation.initialAlignment,
      endCharacterId: participation.endCharacterId,
      endAlignment: participation.endAlignment,
      isAliveAtEnd: participation.isAliveAtEnd,
    },
  })

  const playerOptions =
    players.data?.map(p => ({ value: p.id.toString(), label: p.name })) ?? []
  const characterOptions =
    characters.data?.map(c => ({ value: c.id.toString(), label: c.name })) ?? []
  const alignmentOptions = [
    { label: "Good", value: "good" },
    { label: "Evil", value: "evil" },
  ]

  const handleSubmit = (values: PlayerParticipation) => {
    onChange({
      playerId: values.playerId,
      initialCharacterId: values.initialCharacterId,
      initialAlignment: values.initialAlignment,
      endCharacterId: values.endCharacterId,
      endAlignment: values.endAlignment,
      isAliveAtEnd: values.isAliveAtEnd,
    })
    onClose()
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Grid gutter="lg">
        <Grid.Col span={6}>
          <Select
            label="Player"
            data={playerOptions}
            disabled
            {...form.getInputProps("playerId")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Initial Character"
            data={characterOptions}
            {...form.getInputProps("initialCharacterId")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Initial Alignment"
            data={alignmentOptions}
            {...form.getInputProps("initialAlignment")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Final Character"
            data={characterOptions}
            {...form.getInputProps("endCharacterId")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Final Alignment"
            data={alignmentOptions}
            {...form.getInputProps("endAlignment")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Checkbox
            label="Alive at end"
            {...form.getInputProps("isAliveAtEnd", { type: "checkbox" })}
          />
        </Grid.Col>
      </Grid>

      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </Group>
    </form>
  )
}

export default EditParticipationModal
