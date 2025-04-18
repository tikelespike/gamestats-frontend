import React, { FC } from "react"
import {
  ActionIcon,
  Button,
  Card,
  Collapse,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core"
import styles from "./GameManager.module.css"
import {
  IconChevronDown,
  IconChevronRight,
  IconCrown,
  IconEdit,
  IconScript,
  IconTrash,
} from "@tabler/icons-react"
import PlayerCircle from "./PlayerCircle"
import type { Game } from "../api/apiSlice"
import {
  useEditGameMutation,
  usePlayersQuery,
  useScriptsQuery,
} from "../api/apiSlice"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { truncate } from "../../utils/utils"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"

interface GameCardProps {
  game: Game
  onDelete?: () => void
}

const GameCard: FC<GameCardProps> = ({ game, onDelete }: GameCardProps) => {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editGame] = useEditGameMutation()
  const [editTriggered, setEditTriggered] = React.useState(false)

  const [opened, { open, toggle }] = useDisclosure(false)
  const scripts = useScriptsQuery()
  const players = usePlayersQuery()
  const winningNames = game.winningPlayerIds.map(id => {
    if (!players.data) return "Loading name..."

    const player = players.data.find(p => p.id === id)
    if (!player) return "Unknown Player"
    return player?.name.split(" ")[0]
  })

  const winnersJoined = winningNames.join(", ")
  const winnerTextAppendix = ` (${winnersJoined})`
  const winnersText = game.winningAlignment
    ? `${game.winningAlignment.toUpperCase()} TEAM${isMobile ? "" : winnerTextAppendix}`
    : winnersJoined

  const form = useForm({
    initialValues: {
      name: game.name,
      description: game.description || "",
    },
    validate: {
      name: value => (value.trim().length > 0 ? null : "Game name is required"),
    },
  })

  const handleSave = async () => {
    setEditTriggered(true)
    try {
      await editGame({
        ...game,
        name: form.values.name,
        description: form.values.description || null,
      }).unwrap()
      notifications.show({
        title: "Success",
        message: "Game updated successfully",
        color: "green",
      })
      setIsEditing(false)
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update game. Please try again.",
        color: "red",
      })
    } finally {
      setEditTriggered(false)
    }
  }

  const handleCancel = () => {
    form.reset()
    setIsEditing(false)
  }

  const handleEditClick: (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => void = e => {
    e.stopPropagation()
    form.setValues({
      name: game.name,
      description: game.description || "",
    })
    open()
    setIsEditing(true)
  }

  return (
    <Card shadow={"lg"} px={"lg"} withBorder>
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
          {isEditing ? (
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
              {truncate(game.name, isMobile ? 30 : 70)}
            </Text>
          )}
        </Group>
        {isEditing ? (
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
              Save
            </Button>
          </Group>
        ) : (
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
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  onClick={handleEditClick}
                >
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
        )}
      </Group>
      <Collapse in={opened}>
        <Stack maw={"800px"} pt={"xl"}>
          <Group>
            <ThemeIcon size="lg" variant="light">
              <IconScript style={{ width: "70%", height: "70%" }} />
            </ThemeIcon>
            <Text>
              {scripts.data ? (
                scripts.data.find(s => s.id === game.scriptId)?.name
              ) : (
                <i>Loading...</i>
              )}
            </Text>
          </Group>
          <Group>
            <ThemeIcon size="lg" variant="light" color="yellow">
              <IconCrown style={{ width: "70%", height: "70%" }} />
            </ThemeIcon>
            <Text>{truncate(winnersText, isMobile ? 35 : 70)}</Text>
          </Group>
          {isEditing ? (
            <Textarea
              placeholder="Game description"
              {...form.getInputProps("description")}
              size="sm"
              autosize
              maxRows={16}
              disabled={editTriggered}
            />
          ) : (
            <Text mb={"md"} c={"dimmed"}>
              {game.description}
            </Text>
          )}
          <PlayerCircle
            participations={game.participants}
            winningPlayerIds={game.winningPlayerIds}
          />
        </Stack>
      </Collapse>
    </Card>
  )
}

export default GameCard
