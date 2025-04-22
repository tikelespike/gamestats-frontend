import { useForm } from "@mantine/form"
import { Button, Checkbox, Grid, Select } from "@mantine/core"
import React from "react"
import {
  type Alignment,
  CharacterType,
  type Script,
  useCharactersQuery,
  usePlayersQuery,
} from "../api/apiSlice"
import type { IndexedPlayerParticipation } from "./GameCard"

interface EditParticipationModalProps {
  participation: IndexedPlayerParticipation
  onChange: (updated: IndexedPlayerParticipation) => void
  onDelete: (seatId: number) => void
  onClose: () => void
  script?: Script
}

const characterTypeOrder = [
  CharacterType.Townsfolk,
  CharacterType.Outsider,
  CharacterType.Minion,
  CharacterType.Demon,
  CharacterType.Traveller,
]

const EditParticipationModal = ({
  participation: indexedParticipation,
  onChange,
  onDelete,
  onClose,
  script,
}: EditParticipationModalProps) => {
  const players = usePlayersQuery()
  const characters = useCharactersQuery()
  const participation = indexedParticipation.participation

  const form = useForm({
    initialValues: {
      playerId: participation.playerId?.toString(),
      initialCharacterId: participation.initialCharacterId?.toString(),
      initialAlignment: participation.initialAlignment,
      endCharacterId: participation.endCharacterId?.toString(),
      endAlignment: participation.endAlignment,
      isAliveAtEnd: participation.isAliveAtEnd,
    },
  })

  const playerOptions =
    players.data
      ?.toSorted((p1, p2) => p1.name.localeCompare(p2.name))
      .map(p => ({
        value: p.id.toString(),
        label: p.name,
      })) ?? []

  const characterData = characters.data
  const characterOptions = React.useMemo(() => {
    if (!characterData) return []

    const scriptCharacters = script
      ? characterData.filter(c => script.characterIds.includes(c.id))
      : []
    const nonScriptCharacters = script
      ? characterData.filter(c => !script.characterIds.includes(c.id))
      : characterData

    const sortCharacters = (chars: typeof characterData) => {
      return chars.toSorted((a, b) => {
        // First sort by character type order
        const typeOrderDiff =
          characterTypeOrder.indexOf(a.type) -
          characterTypeOrder.indexOf(b.type)
        if (typeOrderDiff !== 0) return typeOrderDiff
        // Then sort alphabetically within the same type
        return a.name.localeCompare(b.name)
      })
    }

    const sortedScriptCharacters = sortCharacters(scriptCharacters)
    const sortedNonScriptCharacters = sortCharacters(nonScriptCharacters)

    const scriptOptions = sortedScriptCharacters.map(c => ({
      value: c.id.toString(),
      label: c.name,
    }))

    const nonScriptOptions = sortedNonScriptCharacters.map(c => ({
      value: c.id.toString(),
      label: c.name,
    }))

    return [
      { group: "From Script", items: scriptOptions },
      { group: "Other", items: nonScriptOptions },
    ]
  }, [characterData, script])

  const alignmentOptions = [
    { label: "Good", value: "good" },
    { label: "Evil", value: "evil" },
  ]

  const handleSubmit = (values: typeof form.values) => {
    const updatedParticipation = {
      seatId: indexedParticipation.seatId,
      participation: {
        playerId: isNaN(Number(values.playerId))
          ? null
          : Number(values.playerId),
        initialCharacterId: isNaN(Number(values.initialCharacterId))
          ? null
          : Number(values.initialCharacterId),
        initialAlignment: values.initialAlignment as Alignment,
        endCharacterId: isNaN(Number(values.endCharacterId))
          ? null
          : Number(values.endCharacterId),
        endAlignment: values.endAlignment as Alignment,
        isAliveAtEnd: values.isAliveAtEnd,
      },
    }
    onChange(updatedParticipation)
    onClose()
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Grid gutter="lg">
        <Grid.Col span={12}>
          <Select
            label="Player"
            data={playerOptions}
            clearable
            searchable
            onChange={value =>
              form.setFieldValue("playerId", value ?? undefined)
            }
            value={form.values.playerId}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Initial Character"
            data={characterOptions}
            clearable
            searchable
            onChange={value => {
              form.setFieldValue("initialCharacterId", value ?? undefined)
              if (characters.data) {
                const character = characters.data.find(
                  c => c.id.toString() === value,
                )
                if (character) {
                  form.setFieldValue(
                    "initialAlignment",
                    CharacterType.getDefaultAlignment(character.type),
                  )
                }
              }
              if (!form.values.endCharacterId) {
                form.setFieldValue("endCharacterId", value ?? undefined)
                if (characters.data) {
                  const character = characters.data.find(
                    c => c.id.toString() === value,
                  )
                  if (character) {
                    form.setFieldValue(
                      "endAlignment",
                      CharacterType.getDefaultAlignment(character.type),
                    )
                  }
                }
              }
            }}
            value={form.values.initialCharacterId}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Initial Alignment"
            data={alignmentOptions}
            clearable
            {...form.getInputProps("initialAlignment")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Final Character"
            data={characterOptions}
            clearable
            searchable
            onChange={value => {
              form.setFieldValue("endCharacterId", value ?? undefined)
              if (characters.data) {
                const character = characters.data.find(
                  c => c.id.toString() === value,
                )
                if (character) {
                  form.setFieldValue(
                    "endAlignment",
                    CharacterType.getDefaultAlignment(character.type),
                  )
                }
              }
            }}
            value={form.values.endCharacterId}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Final Alignment"
            data={alignmentOptions}
            clearable
            {...form.getInputProps("endAlignment")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Checkbox
            label="Alive at end"
            {...form.getInputProps("isAliveAtEnd", { type: "checkbox" })}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, xs: 6 }}>
          <Button
            fullWidth
            color="red"
            variant="outline"
            onClick={() => {
              onDelete(indexedParticipation.seatId)
              onClose()
            }}
          >
            Remove Player
          </Button>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>
          <Button fullWidth type="submit">
            Save
          </Button>
        </Grid.Col>
      </Grid>
    </form>
  )
}

export default EditParticipationModal
