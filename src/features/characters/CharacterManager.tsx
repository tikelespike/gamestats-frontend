import React from "react"
import CharacterCard from "./CharacterCard"
import type { MantineTheme } from "@mantine/core"
import {
  ActionIcon,
  Autocomplete,
  Box,
  Button,
  Center,
  Grid,
  Group,
  Loader,
  Modal,
  SegmentedControl,
  Select,
  Text,
  TextInput,
  useMantineTheme,
  useModalsStack,
} from "@mantine/core"
import type { AddCharacterRequest, Character } from "../api/apiSlice"
import {
  CharacterType,
  useAddCharacterMutation,
  useBatchAddCharactersMutation,
  useBatchDeleteCharactersMutation,
  useCharactersQuery,
  useDeleteCharacterMutation,
  useEditCharacterMutation,
  useOfficialCharactersQuery,
} from "../api/apiSlice"
import ErrorDisplay from "../../components/ErrorDisplay"
import { useMediaQuery } from "@mantine/hooks"
import { useForm } from "@mantine/form"
import { IconExternalLink, IconWand } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"
import { modals } from "@mantine/modals"
import styles from "./CharacterManager.module.css"
import AddCharacterCard from "./AddCharacterCard"
import { BatchDeleteDialog } from "./BatchDeleteDialog"
import { BatchAddDialog } from "./BatchAddDialog"

const CharacterManager = () => {
  const theme: MantineTheme = useMantineTheme()
  const [mutationLoading, setMutationLoading] = React.useState<boolean>(false)
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false)
  const [isMultiSelectMode, setIsMultiSelectMode] =
    React.useState<boolean>(false)
  const [selectedCharacterIds, setSelectedCharacterIds] = React.useState<
    number[]
  >([])
  const operationLoading = mutationLoading || deleteLoading
  const getCharactersState = useCharactersQuery()
  const getOfficialCharactersState = useOfficialCharactersQuery()
  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)
  const stack = useModalsStack(["add", "edit"])

  const officialCharacters: AddCharacterRequest[] =
    getOfficialCharactersState.isSuccess && getOfficialCharactersState.data
      ? getOfficialCharactersState.data
      : []
  const officialNames: string[] = officialCharacters.map(
    character => character.name,
  )

  const selectTypeData = [
    { label: "Townsfolk", value: "townsfolk" },
    { label: "Outsider", value: "outsider" },
    { label: "Minion", value: "minion" },
    { label: "Demon", value: "demon" },
    { label: "Traveller", value: "traveller" },
  ]

  const newCharacterForm = useForm<AddCharacterRequest>({
    initialValues: {
      name: "",
      scriptToolIdentifier: null,
      type: CharacterType.Townsfolk,
      wikiPageLink: null,
      imageUrl: null,
    },
    validate: {
      name: value =>
        value && value.trim().length > 0 ? null : "Character name is required",
    },
  })

  const editCharacterForm = useForm<Character>({
    initialValues: {
      id: 0,
      version: 0,
      name: "",
      scriptToolIdentifier: null,
      type: CharacterType.Townsfolk,
      wikiPageLink: null,
      imageUrl: null,
    },
    validate: {
      name: value =>
        value && value.trim().length > 0 ? null : "Character name is required",
    },
  })

  const handleOpenAddModal = () => {
    newCharacterForm.reset()
    stack.open("add")
  }

  const handleOpenEditModal = (id: number) => {
    editCharacterForm.reset()
    if (getCharactersState.data === undefined) {
      return
    }
    const initialValues = getCharactersState.data.find(
      character => character.id === id,
    )
    if (initialValues === undefined) {
      console.error("Character that should be edited not found")
      return
    }
    editCharacterForm.setValues(initialValues)
    stack.open("edit")
  }

  const [addCharacter] = useAddCharacterMutation()
  const [editCharacter] = useEditCharacterMutation()
  const [deleteCharacter] = useDeleteCharacterMutation()
  const [batchDeleteCharacters] = useBatchDeleteCharactersMutation()
  const [batchAddCharacters] = useBatchAddCharactersMutation()

  const handleAddCharacter = async (values: AddCharacterRequest) => {
    setMutationLoading(true)
    try {
      await addCharacter(values).unwrap()
    } catch (err) {
      console.error("Creation failed:", err)
      notifications.show({
        title: "Creation failed",
        message:
          // @ts-ignore
          "Character could not be created (error code " + err.status + ")",
        color: "red",
        autoClose: false,
        position: "top-center",
      })
      setMutationLoading(false)
      return
    }
    stack.close("add")
  }
  const handleEditCharacter = async (values: Character) => {
    setMutationLoading(true)
    try {
      await editCharacter(values).unwrap()
    } catch (err) {
      console.error("Update failed: ", err)
      let message: string =
        // @ts-ignore
        "Character could not be updated (error code " + err.status + ")"
      // @ts-ignore
      if (err.status === 409) {
        message =
          "The character was already updated by someone else. Saving your changes may overwrite their changes."
      }
      notifications.show({
        title: "Update failed",
        message: message,
        color: "red",
        autoClose: false,
        position: "top-center",
      })
      setMutationLoading(false)
      return
    }
    stack.close("edit")
  }

  const handleDeleteCharacter = async (id: number) => {
    setDeleteLoading(true)
    try {
      await deleteCharacter(id).unwrap()
    } catch (err) {
      console.error("Delete failed: ", err)
      notifications.show({
        title: "Delete failed",
        message:
          // @ts-ignore
          "Character could not be deleted (error code " + err.status + ")",
        color: "red",
        autoClose: false,
        position: "top-center",
      })
      setDeleteLoading(false)
      return
    }
    stack.close("edit")
  }

  const handleMagicComplete = () => {
    const officialCharacter = officialCharacters.find(
      character => character.name === newCharacterForm.values.name,
    )
    if (officialCharacter === undefined) {
      return
    }
    newCharacterForm.setValues({
      ...newCharacterForm.values,
      scriptToolIdentifier: officialCharacter.scriptToolIdentifier,
      type: officialCharacter.type,
      wikiPageLink: officialCharacter.wikiPageLink,
      imageUrl: officialCharacter.imageUrl,
    })
  }

  const handleToggleMultiSelectMode = () => {
    setIsMultiSelectMode(!isMultiSelectMode)
    setSelectedCharacterIds([])
  }

  const handleSelectAll = () => {
    if (getCharactersState.data === undefined) return
    setSelectedCharacterIds(
      getCharactersState.data.map(character => character.id),
    )
  }

  const handleToggleCharacterSelection = (id: number) => {
    setSelectedCharacterIds(prev =>
      prev.includes(id)
        ? prev.filter(characterId => characterId !== id)
        : [...prev, id],
    )
  }

  const handleBatchDelete = () => {
    if (
      selectedCharacterIds.length === 0 ||
      getCharactersState.data === undefined
    ) {
      return
    }
    const selectedCharacters = getCharactersState.data.filter(character =>
      selectedCharacterIds.includes(character.id),
    )
    const modalId = modals.open({
      title: "Delete Selected Characters",
      children: (
        <BatchDeleteDialog
          selectedCharacters={selectedCharacters}
          onClose={() => {
            modals.close(modalId)
          }}
          onSuccess={() => {
            setIsMultiSelectMode(false)
            setSelectedCharacterIds([])
          }}
        />
      ),
    })
  }

  const getMissingOfficialCharacters = () => {
    if (!getCharactersState.data || !getOfficialCharactersState.data) return []
    const existingNames = new Set(getCharactersState.data.map(c => c.name))
    return getOfficialCharactersState.data.filter(
      character => !existingNames.has(character.name),
    )
  }

  const handleBatchAddCharacters = () => {
    const missingCharacters = getMissingOfficialCharacters()
    if (missingCharacters.length === 0) return

    const modalId = modals.open({
      title: "Add Missing Official Characters",
      children: (
        <BatchAddDialog
          onClose={() => {
            modals.close(modalId)
          }}
          characters={missingCharacters}
        />
      ),
    })
  }

  if (getCharactersState.isLoading) {
    return (
      <Center>
        <Loader top="40vh" color="blue" size="xl" type="bars" />
      </Center>
    )
  }
  if (getCharactersState.isError || getCharactersState.data === undefined) {
    return <ErrorDisplay error={getCharactersState.error} />
  }

  const characterCards = getCharactersState.data
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .map(character => (
      <CharacterCard
        key={character.id}
        character={character}
        onClick={() =>
          isMultiSelectMode
            ? handleToggleCharacterSelection(character.id)
            : handleOpenEditModal(character.id)
        }
        isSelected={selectedCharacterIds.includes(character.id)}
        isMultiSelectMode={isMultiSelectMode}
      />
    ))

  const showDeleteConfirmationDialog = () => {
    modals.openConfirmModal({
      id: "confirm-delete",
      title: "Delete Character",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the character "
          {editCharacterForm.values.name}"? This action cannot be undone. All
          games using this character will be affected.
        </Text>
      ),
      labels: {
        confirm: "Delete Character",
        cancel: "Cancel",
      },
      confirmProps: { color: "red" },
      onConfirm: () => handleDeleteCharacter(editCharacterForm.values.id),
      zIndex: 1000,
    })
  }

  return (
    <>
      <Modal.Stack>
        <Modal
          {...stack.register("add")}
          onExitTransitionEnd={() => setMutationLoading(false)}
          title="Add Character"
          centered
          size="md"
          fullScreen={isSmallScreen}
        >
          <form onSubmit={newCharacterForm.onSubmit(handleAddCharacter)}>
            <Grid gutter={"lg"}>
              <Grid.Col span={6}>
                <Autocomplete
                  label="Character Name"
                  disabled={operationLoading}
                  placeholder="Fortune Teller"
                  withAsterisk
                  data={officialNames.filter(
                    name =>
                      !getCharactersState.data
                        .map(character => character.name)
                        .includes(name),
                  )}
                  {...newCharacterForm.getInputProps("name")}
                  rightSection={
                    <ActionIcon
                      size={32}
                      color={theme.primaryColor}
                      variant="transparent"
                      disabled={
                        operationLoading ||
                        !officialNames.includes(newCharacterForm.values.name)
                      }
                      onClick={handleMagicComplete}
                    >
                      <IconWand size={18} stroke={1.5} />
                    </ActionIcon>
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Script Tool Identifier"
                  disabled={operationLoading}
                  placeholder="fortuneteller"
                  {...newCharacterForm.getInputProps("scriptToolIdentifier")}
                />
              </Grid.Col>
              <Grid.Col>
                {isSmallScreen ? (
                  <Select
                    label="Character Type"
                    disabled={operationLoading}
                    data={selectTypeData}
                    placeholder={"Select"}
                    {...newCharacterForm.getInputProps("type")}
                  />
                ) : (
                  <SegmentedControl
                    fullWidth
                    disabled={operationLoading}
                    data={selectTypeData}
                    {...newCharacterForm.getInputProps("type")}
                  />
                )}
              </Grid.Col>
              <Grid.Col>
                <TextInput
                  label="Wiki Page URL"
                  disabled={operationLoading}
                  placeholder="https://wiki.bloodontheclocktower.com/Fortune_Teller"
                  {...newCharacterForm.getInputProps("wikiPageLink")}
                  rightSection={
                    newCharacterForm.getValues().wikiPageLink && (
                      <ActionIcon
                        size={32}
                        color={"blue"}
                        variant="transparent"
                        component="a"
                        // @ts-ignore we checked above that the link is non-null
                        href={newCharacterForm.getValues().wikiPageLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconExternalLink size={16} />
                      </ActionIcon>
                    )
                  }
                />
              </Grid.Col>
              <Grid.Col>
                <TextInput
                  label="Image URL"
                  disabled={operationLoading}
                  placeholder="https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Fortune%20Teller_icon.webp"
                  {...newCharacterForm.getInputProps("imageUrl")}
                />
              </Grid.Col>
            </Grid>

            <Group mt="xl" justify="flex-end">
              <Button type={"submit"} loading={mutationLoading}>
                Create
              </Button>
            </Group>
          </form>
        </Modal>

        <Modal
          {...stack.register("edit")}
          onExitTransitionEnd={() => {
            setMutationLoading(false)
            setDeleteLoading(false)
          }}
          title="Edit Character"
          centered
          size="md"
          fullScreen={isSmallScreen}
        >
          <form onSubmit={editCharacterForm.onSubmit(handleEditCharacter)}>
            <Grid gutter={"lg"}>
              <Grid.Col span={6}>
                <Autocomplete
                  label="Character Name"
                  disabled={operationLoading}
                  placeholder="Fortune Teller"
                  withAsterisk
                  data={officialNames}
                  {...editCharacterForm.getInputProps("name")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Script Tool Identifier"
                  disabled={operationLoading}
                  placeholder="fortuneteller"
                  {...editCharacterForm.getInputProps("scriptToolIdentifier")}
                />
              </Grid.Col>
              <Grid.Col>
                {isSmallScreen ? (
                  <Select
                    label="Character Type"
                    disabled={operationLoading}
                    data={selectTypeData}
                    placeholder={"Select"}
                    {...editCharacterForm.getInputProps("type")}
                  />
                ) : (
                  <SegmentedControl
                    fullWidth
                    disabled={operationLoading}
                    data={selectTypeData}
                    {...editCharacterForm.getInputProps("type")}
                  />
                )}
              </Grid.Col>
              <Grid.Col>
                <TextInput
                  label="Wiki Page URL"
                  disabled={operationLoading}
                  placeholder="https://wiki.bloodontheclocktower.com/Fortune_Teller"
                  rightSection={
                    editCharacterForm.getValues().wikiPageLink && (
                      <ActionIcon
                        size={32}
                        color={"blue"}
                        variant="transparent"
                        component="a"
                        // @ts-ignore we checked above that the link is non-null
                        href={editCharacterForm.getValues().wikiPageLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconExternalLink size={16} />
                      </ActionIcon>
                    )
                  }
                  {...editCharacterForm.getInputProps("wikiPageLink")}
                />
              </Grid.Col>
              <Grid.Col>
                <TextInput
                  label="Image URL"
                  disabled={operationLoading}
                  placeholder="https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Fortune%20Teller_icon.webp"
                  {...editCharacterForm.getInputProps("imageUrl")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 6 }}>
                <Button
                  fullWidth
                  variant={"outline"}
                  color={"red"}
                  disabled={mutationLoading}
                  loading={deleteLoading}
                  onClick={showDeleteConfirmationDialog}
                >
                  Delete
                </Button>
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 6 }}>
                <Button
                  fullWidth
                  type={"submit"}
                  loading={mutationLoading}
                  disabled={deleteLoading}
                >
                  Save
                </Button>
              </Grid.Col>
            </Grid>
          </form>
        </Modal>
      </Modal.Stack>

      <Box>
        <Group justify="space-between" mb="md">
          <Group>
            <Button
              variant={isMultiSelectMode ? "filled" : "light"}
              color={isMultiSelectMode ? "blue" : "gray"}
              onClick={handleToggleMultiSelectMode}
            >
              {isMultiSelectMode ? "Exit Multi-Select" : "Multi-Select"}
            </Button>
            {isMultiSelectMode ? (
              <>
                <Button variant="light" color="blue" onClick={handleSelectAll}>
                  Select All
                </Button>
                <Button
                  color="red"
                  disabled={selectedCharacterIds.length === 0}
                  onClick={handleBatchDelete}
                  loading={deleteLoading}
                >
                  Delete Selected ({selectedCharacterIds.length})
                </Button>
              </>
            ) : (
              <Button
                variant="light"
                color="blue"
                onClick={handleBatchAddCharacters}
                disabled={getMissingOfficialCharacters().length === 0}
                loading={mutationLoading}
              >
                Add Missing Official Characters
              </Button>
            )}
          </Group>
        </Group>
        <Box className={styles.container}>
          <AddCharacterCard onClick={handleOpenAddModal} />
          {characterCards}
        </Box>
      </Box>
    </>
  )
}

export default CharacterManager
