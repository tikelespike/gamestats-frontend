import type { FC } from "react"
import React, { useState } from "react"
import {
  ActionIcon,
  Button,
  Card,
  Collapse,
  Group,
  HoverCard,
  MultiSelect,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core"
import styles from "./GameManager.module.css"
import {
  IconAlertTriangle,
  IconChevronDown,
  IconChevronRight,
  IconEdit,
  IconMessageCircleUser,
  IconScript,
  IconTrash,
  IconTrophy,
} from "@tabler/icons-react"
import PlayerCircle from "./PlayerCircle"

import type { Game, PlayerParticipation, Script } from "../api/apiSlice"
import {
  Alignment,
  useCreateGameMutation,
  useEditGameMutation,
  usePlayersQuery,
  useScriptsQuery,
} from "../api/apiSlice"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { titleCase, truncate } from "../../utils/utils"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"

export interface IndexedPlayerParticipation {
  participation: PlayerParticipation
  seatId: number
}

interface GameCardProps {
  game?: Game
  onDelete?: () => void
  isNew?: boolean
  onCancel?: () => void
  onCreateSuccess?: () => void
}

const DESCRIPTION_MAX_LENGTH = 5000

const GameCard: FC<GameCardProps> = ({
  game,
  onDelete,
  isNew = false,
  onCancel,
  onCreateSuccess,
}: GameCardProps) => {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`)
  const [isEditing, setIsEditing] = React.useState(isNew)
  const [editGame] = useEditGameMutation()
  const [createGame] = useCreateGameMutation()
  const [editTriggered, setEditTriggered] = React.useState(false)

  const defaultParticipations: number = 5

  // For new games, create an empty game object
  const defaultParticipation: PlayerParticipation = {
    playerId: null,
    initialCharacterId: null,
    initialAlignment: null,
    endCharacterId: null,
    endAlignment: null,
    isAliveAtEnd: false,
  }

  const currentGame: Game = game ?? {
    id: -1,
    version: 0,
    name: "",
    description: null,
    scriptId: -1,
    storytellerIds: [],
    winningAlignment: Alignment.Good,
    winningPlayerIds: [],
    participants: Array.from(
      { length: defaultParticipations },
      () => defaultParticipation,
    ),
  }

  // "freeze" the indices of the participations so we can use them as keys from here on
  // out, even if the order changes. The intuition is that we are placing them on seats in a circle.
  // We can move each circle around or change the player and its data on the seat, but it's the same seat.
  const indexedParticipants: IndexedPlayerParticipation[] =
    currentGame.participants.map((participation, index) => ({
      participation,
      seatId: index,
    }))
  const [editedParticipations, setEditedParticipations] =
    useState<IndexedPlayerParticipation[]>(indexedParticipants)

  const cleanupCustomWinners: (
    newParticipations: IndexedPlayerParticipation[],
  ) => void = newParticipations => {
    if (form.values.winningAlignment === null) {
      const validWinners = form.values.winningPlayerIds.filter(winnerId =>
        newParticipations.some(p => p.participation.playerId === winnerId),
      )

      if (validWinners.length !== form.values.winningPlayerIds.length) {
        form.setFieldValue("winningPlayerIds", validWinners)
      }
    }
  }

  const handleParticipationsChange = (
    newParticipations: IndexedPlayerParticipation[],
  ) => {
    setEditedParticipations(newParticipations)
    cleanupCustomWinners(newParticipations)
  }

  const [opened, { open, toggle }] = useDisclosure(isNew)
  const scripts = useScriptsQuery()
  const players = usePlayersQuery()
  const isIncomplete =
    currentGame.participants.some(
      g =>
        g.playerId === null ||
        g.initialCharacterId === null ||
        g.endCharacterId === null,
    ) ||
    !currentGame.storytellerIds ||
    currentGame.storytellerIds.length === 0

  const form = useForm({
    initialValues: {
      name: currentGame.name,
      description: currentGame.description ?? "",
      scriptId: currentGame.scriptId?.toString(),
      storytellerIds: currentGame.storytellerIds,
      winningAlignment: currentGame.winningAlignment,
      winningPlayerIds: currentGame.winningPlayerIds,
    },
    validate: {
      name: value => (value.trim().length > 0 ? null : "Game name is required"),
      scriptId: value =>
        value && Number(value) >= 0 ? null : "Script is required",
      description: value =>
        !value || value.length <= DESCRIPTION_MAX_LENGTH
          ? null
          : "Description is too long",
    },
  })

  const handleSave = async () => {
    setEditTriggered(true)
    const gameData = {
      name: form.values.name,
      description: form.values.description || null,
      scriptId: Number(form.values.scriptId),
      storytellerIds: form.values.storytellerIds,
      // use new order of list as new order of participations, throwing away the old order which was used as keys
      participants: editedParticipations.map(p => p.participation),
      winningAlignment: form.values.winningAlignment,
      winningPlayerIds: form.values.winningPlayerIds,
    }
    try {
      if (isNew) {
        await createGame(gameData).unwrap()
        notifications.show({
          title: "Success",
          message: "Game created successfully",
          color: "green",
        })
        onCreateSuccess?.()
      } else {
        await editGame({
          ...gameData,
          id: currentGame.id,
          version: currentGame.version,
        }).unwrap()
        notifications.show({
          title: "Success",
          message: "Game updated successfully",
          color: "green",
        })
        setIsEditing(false)
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: `Failed to ${isNew ? "create" : "update"} game. Please try again.`,
        color: "red",
      })
    }
    setEditTriggered(false)
  }

  const handleCancel = () => {
    form.reset()
    setIsEditing(false)
    setEditedParticipations(indexedParticipants)
    if (isNew) {
      onCancel?.()
    }
  }

  const handleEditClick: (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => void = e => {
    e.stopPropagation()
    form.setValues({
      name: currentGame.name,
      description: currentGame.description || "",
      scriptId: currentGame.scriptId?.toString(),
      storytellerIds: currentGame.storytellerIds,
      winningAlignment: currentGame.winningAlignment,
      winningPlayerIds: currentGame.winningPlayerIds,
    })
    setEditedParticipations(indexedParticipants)
    open()
    setIsEditing(true)
  }

  const currentScript: Script | undefined = scripts.data?.find(
    s =>
      s.id ===
      (isEditing ? Number(form.values.scriptId) : currentGame.scriptId),
  )

  const winningTeamOptions = [
    { label: "Good Team", value: "good" },
    { label: "Evil Team", value: "evil" },
    { label: "Custom", value: "custom" },
  ]

  const gameNameComponent = isEditing ? (
    <TextInput
      placeholder="Game name"
      {...form.getInputProps("name")}
      onClick={e => e.stopPropagation()}
      size="sm"
      w="100%"
      maw={500}
      disabled={editTriggered}
    />
  ) : (
    <Text fw={500} size="md">
      {truncate(currentGame.name || "New Game", isMobile ? 30 : 70)}
    </Text>
  )

  const incompleteGameWarning = (
    <>
      <HoverCard shadow={"md"}>
        <HoverCard.Target>
          <ThemeIcon color={"yellow"} variant={"light"} size={"md"}>
            <IconAlertTriangle style={{ width: "70%", height: "70%" }} />
          </ThemeIcon>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text>Game data incomplete!</Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  )
  const editButtons = (
    <>
      <Group gap="xs">
        <Button
          variant="subtle"
          color="gray"
          onClick={handleCancel}
          size="xs"
          disabled={editTriggered}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          size="xs"
          disabled={!form.isValid() || editTriggered}
          loading={editTriggered}
        >
          {isNew ? "Create" : "Save"}
        </Button>
      </Group>
    </>
  )
  const cardHeaderButtons = (
    <>
      <Group gap="xs">
        {!isMobile ? (
          <>
            <Button
              variant="subtle"
              color="blue"
              leftSection={<IconEdit size={16} />}
              onClick={handleEditClick}
              size="xs"
            >
              Edit
            </Button>
            {onDelete && (
              <Button
                variant="subtle"
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={e => {
                  e.stopPropagation()
                  onDelete()
                }}
                size="xs"
              >
                Delete
              </Button>
            )}
          </>
        ) : (
          <>
            <ActionIcon variant="subtle" color="blue" onClick={handleEditClick}>
              <IconEdit size={16} />
            </ActionIcon>
            {onDelete && (
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={e => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                <IconTrash size={16} />
              </ActionIcon>
            )}
          </>
        )}
      </Group>
    </>
  )
  const cardHeader = (
    <Group
      className={styles.titleBar}
      onClick={!isEditing ? toggle : undefined}
      role="button"
      tabIndex={0}
      onKeyDown={e => !isEditing && e.key === "Enter" && toggle()}
      justify="space-between"
      wrap="nowrap"
    >
      <Group style={{ flex: 1 }} wrap="nowrap">
        {!isEditing &&
          (opened ? (
            <IconChevronDown size="1.2rem" />
          ) : (
            <IconChevronRight size="1.2rem" />
          ))}
        {gameNameComponent}
        {!isEditing && !isNew && isIncomplete && incompleteGameWarning}
      </Group>
      {isEditing ? editButtons : cardHeaderButtons}
    </Group>
  )
  const gameScriptComponent = (
    <Group>
      <ThemeIcon size="lg" variant="light">
        <IconScript style={{ width: "70%", height: "70%" }} />
      </ThemeIcon>
      {isEditing ? (
        <Select
          data={
            scripts.data
              ? scripts.data.map(s => ({
                  value: s.id.toString(),
                  label: s.name,
                }))
              : []
          }
          placeholder={
            scripts.isLoading ? "Loading scripts..." : "Select script"
          }
          disabled={scripts.isLoading || editTriggered}
          {...form.getInputProps("scriptId")}
        />
      ) : (
        <Text>
          {scripts.data ? (
            scripts.data.find(s => s.id === currentGame.scriptId)?.name
          ) : (
            <i>Loading...</i>
          )}
        </Text>
      )}
    </Group>
  )

  const storytellersSelectOptions = React.useMemo(() => {
    if (!players.data) return []
    return players.data.map(p => ({
      value: p.id.toString(),
      label: p.name,
    }))
  }, [players.data])

  const storytellerNames = currentGame.storytellerIds
    ? currentGame.storytellerIds.map(id => {
        if (!players.data) return "Loading name..."

        const player = players.data.find(p => p.id === id)
        if (!player) return "Unknown Player"
        return player?.name
      })
    : []

  const storytellersText =
    storytellerNames.length > 0 ? (
      truncate(storytellerNames.join(", "), isMobile ? 35 : 70)
    ) : (
      <i>Unknown</i>
    )

  const gameStorytellersComponent = (
    <Group>
      <ThemeIcon size="lg" variant="light" color="gray">
        <IconMessageCircleUser style={{ width: "70%", height: "70%" }} />
      </ThemeIcon>
      {isEditing ? (
        <MultiSelect
          searchable
          data={storytellersSelectOptions}
          disabled={editTriggered}
          value={form.values.storytellerIds.map(id => id.toString())}
          onChange={values => {
            form.setFieldValue(
              "storytellerIds",
              values.map(v => parseInt(v)),
            )
          }}
          placeholder="Select storyteller(s)"
        />
      ) : (
        <Text>{storytellersText}</Text>
      )}
    </Group>
  )

  const winningNames = currentGame.winningPlayerIds.map(id => {
    if (!players.data) return "Loading name..."

    const player = players.data.find(p => p.id === id)
    if (!player) return "Unknown Player"
    return player?.name.split(" ")[0]
  })

  const winnersJoined = winningNames.join(", ")
  const winnerTextAppendix =
    winningNames.length > 0 ? ` (${winnersJoined})` : ""
  const winnersText = currentGame.winningAlignment
    ? `${titleCase(currentGame.winningAlignment)} Team${isMobile ? "" : winnerTextAppendix}`
    : winnersJoined

  const winnersSelectOptions = React.useMemo(() => {
    if (!players.data) return []

    // Get players in participations
    const participationPlayerIds = new Set(
      editedParticipations
        .map(part => part.participation.playerId)
        .filter((id): id is number => id !== null),
    )
    const participationPlayers = players.data
      .filter(p => participationPlayerIds.has(p.id))
      .map(p => ({
        value: p.id.toString(),
        label: p.name.split(" ")[0],
      }))

    // Get storytellers that aren't already in participations
    const storytellerPlayers = players.data
      .filter(
        p =>
          form.values.storytellerIds.includes(p.id) &&
          !participationPlayerIds.has(p.id),
      )
      .map(p => ({
        value: p.id.toString(),
        label: p.name.split(" ")[0],
      }))

    // Get remaining players
    const otherPlayers = players.data
      .filter(
        p =>
          !participationPlayerIds.has(p.id) &&
          !form.values.storytellerIds.includes(p.id),
      )
      .map(p => ({
        value: p.id.toString(),
        label: p.name.split(" ")[0],
      }))

    return [
      { group: "Players in Game", items: participationPlayers },
      { group: "Storytellers", items: storytellerPlayers },
      { group: "Other Players", items: otherPlayers },
    ]
  }, [players.data, editedParticipations, form.values.storytellerIds])

  const gameWinnersComponent = (
    <Group>
      <ThemeIcon size="lg" variant="light" color="yellow">
        <IconTrophy style={{ width: "70%", height: "70%" }} />
      </ThemeIcon>
      {isEditing ? (
        <>
          <Select
            data={winningTeamOptions}
            disabled={editTriggered}
            value={
              form.values.winningAlignment === null
                ? "custom"
                : form.values.winningAlignment
            }
            onChange={value => {
              if (value === "custom") {
                form.setFieldValue("winningAlignment", null)
              } else {
                form.setFieldValue("winningAlignment", value)
                // When selecting a team alignment, automatically select all players of that alignment
                const winningPlayers = editedParticipations
                  .filter(p => p.participation.endAlignment === value)
                  .map(p => p.participation.playerId)
                  .filter((id): id is number => id !== null)
                form.setFieldValue("winningPlayerIds", winningPlayers)
              }
            }}
          />
          {form.values.winningAlignment === null && (
            <MultiSelect
              searchable
              data={winnersSelectOptions}
              disabled={editTriggered}
              value={form.values.winningPlayerIds.map(id => id.toString())}
              onChange={values => {
                form.setFieldValue(
                  "winningPlayerIds",
                  values.map(v => parseInt(v)),
                )
              }}
              placeholder="Select winners"
            />
          )}
        </>
      ) : (
        <Text
          c={
            currentGame.winningAlignment === Alignment.Good
              ? "blue"
              : currentGame.winningAlignment === Alignment.Evil
                ? "red"
                : undefined
          }
        >
          {truncate(winnersText, isMobile ? 35 : 70)}
        </Text>
      )}
    </Group>
  )
  const gameDescriptionComponent = isEditing ? (
    <Textarea
      placeholder="Game description"
      {...form.getInputProps("description")}
      size="sm"
      autosize
      maxLength={DESCRIPTION_MAX_LENGTH}
      disabled={editTriggered}
    />
  ) : (
    <Text mb={"md"} c={"dimmed"}>
      {currentGame.description}
    </Text>
  )

  const cardBody = (
    <Stack pt={"xl"}>
      {gameScriptComponent}
      {gameStorytellersComponent}
      {gameWinnersComponent}
      {gameDescriptionComponent}
      <PlayerCircle
        participations={isEditing ? editedParticipations : indexedParticipants}
        winningPlayerIds={currentGame.winningPlayerIds}
        isEditing={isEditing}
        onParticipationsChange={handleParticipationsChange}
        script={currentScript}
      />
    </Stack>
  )

  return (
    <Card shadow={"lg"} px={"lg"} withBorder>
      {cardHeader}
      <Collapse in={opened}>{cardBody}</Collapse>
    </Card>
  )
}

export default GameCard
