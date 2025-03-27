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
  TextInput,
  useMantineTheme,
} from "@mantine/core"
import type { AddCharacterRequest, Character } from "../api/apiSlice"
import {
  CharacterType,
  useAddCharacterMutation,
  useCharactersQuery,
  useEditCharacterMutation,
  useOfficialCharactersQuery,
} from "../api/apiSlice"
import ErrorDisplay from "../../components/ErrorDisplay"
import AddCharacterCard from "./AddCharacterCard"
import styles from "./CharacterManager.module.css"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { useForm } from "@mantine/form"
import { IconWand } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"

const CharacterManager = () => {
  const theme: MantineTheme = useMantineTheme()
  const [mutationLoading, setMutationLoading] = React.useState<boolean>(false)
  const getCharactersState = useCharactersQuery()
  const getOfficialCharactersState = useOfficialCharactersQuery()
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false)
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false)
  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)

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
    openAddModal()
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
    openEditModal()
  }

  const [addCharacter] = useAddCharacterMutation()
  const [editCharacter] = useEditCharacterMutation()
  const handleAddCharacter = async (values: AddCharacterRequest) => {
    setMutationLoading(true)
    try {
      await addCharacter(values).unwrap()
    } catch (err) {
      console.error("Creation failed:", err)
      notifications.show({
        title: "Creation failed",
        message:
          "Character could not be created (error code " + err.status + ")",
        color: "red",
        autoClose: false,
        position: "top-center",
      })
      setMutationLoading(false)
      return
    }
    closeAddModal()
  }
  const handleEditCharacter = async (values: Character) => {
    setMutationLoading(true)
    try {
      await editCharacter(values).unwrap()
    } catch (err) {
      console.error("Update failed:", err)
      let message: string =
        "Character could not be updated (error code " + err.status + ")"
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
    closeEditModal()
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

  const characterCards = getCharactersState.data.map(character => (
    <CharacterCard
      key={character.id}
      name={character.name}
      type={character.type}
      icon={character.imageUrl}
      onClick={() => handleOpenEditModal(character.id)}
    />
  ))

  return (
    <>
      <Modal
        opened={addModalOpened}
        onClose={closeAddModal}
        onExitTransitionEnd={() => setMutationLoading(false)}
        title="Add Character"
        centered
        size="md"
      >
        <form onSubmit={newCharacterForm.onSubmit(handleAddCharacter)}>
          <Grid gutter={"lg"}>
            <Grid.Col span={6}>
              <Autocomplete
                label="Character Name"
                disabled={mutationLoading}
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
                      mutationLoading ||
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
                disabled={mutationLoading}
                placeholder="fortuneteller"
                {...newCharacterForm.getInputProps("scriptToolIdentifier")}
              />
            </Grid.Col>
            <Grid.Col>
              {isSmallScreen ? (
                <Select
                  label="Character Type"
                  disabled={mutationLoading}
                  data={selectTypeData}
                  placeholder={"Select"}
                  {...newCharacterForm.getInputProps("type")}
                />
              ) : (
                <SegmentedControl
                  fullWidth
                  disabled={mutationLoading}
                  data={selectTypeData}
                  {...newCharacterForm.getInputProps("type")}
                />
              )}
            </Grid.Col>
            <Grid.Col>
              <TextInput
                label="Wiki Page URL"
                disabled={mutationLoading}
                placeholder="https://wiki.bloodontheclocktower.com/Fortune_Teller"
                {...newCharacterForm.getInputProps("wikiPageLink")}
              />
            </Grid.Col>
            <Grid.Col>
              <TextInput
                label="Image URL"
                disabled={mutationLoading}
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
        opened={editModalOpened}
        onClose={closeEditModal}
        onExitTransitionEnd={() => setMutationLoading(false)}
        title="Edit Character"
        centered
        size="md"
      >
        <form onSubmit={editCharacterForm.onSubmit(handleEditCharacter)}>
          <Grid gutter={"lg"}>
            <Grid.Col span={6}>
              <Autocomplete
                label="Character Name"
                disabled={mutationLoading}
                placeholder="Fortune Teller"
                withAsterisk
                data={officialNames}
                {...editCharacterForm.getInputProps("name")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Script Tool Identifier"
                disabled={mutationLoading}
                placeholder="fortuneteller"
                {...editCharacterForm.getInputProps("scriptToolIdentifier")}
              />
            </Grid.Col>
            <Grid.Col>
              {isSmallScreen ? (
                <Select
                  label="Character Type"
                  disabled={mutationLoading}
                  data={selectTypeData}
                  placeholder={"Select"}
                  {...editCharacterForm.getInputProps("type")}
                />
              ) : (
                <SegmentedControl
                  fullWidth
                  disabled={mutationLoading}
                  data={selectTypeData}
                  {...editCharacterForm.getInputProps("type")}
                />
              )}
            </Grid.Col>
            <Grid.Col>
              <TextInput
                label="Wiki Page URL"
                disabled={mutationLoading}
                placeholder="https://wiki.bloodontheclocktower.com/Fortune_Teller"
                {...editCharacterForm.getInputProps("wikiPageLink")}
              />
            </Grid.Col>
            <Grid.Col>
              <TextInput
                label="Image URL"
                disabled={mutationLoading}
                placeholder="https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Fortune%20Teller_icon.webp"
                {...editCharacterForm.getInputProps("imageUrl")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, xs: 6 }}>
              <Button
                fullWidth
                variant={"outline"}
                color={"red"}
                loading={mutationLoading}
              >
                Delete
              </Button>
            </Grid.Col>
            <Grid.Col span={{ base: 12, xs: 6 }}>
              <Button fullWidth type={"submit"} loading={mutationLoading}>
                Save
              </Button>
            </Grid.Col>
          </Grid>
        </form>
      </Modal>

      <Box className={styles.container}>
        <AddCharacterCard onClick={handleOpenAddModal} />
        {characterCards}
      </Box>
    </>
  )
}

export default CharacterManager
