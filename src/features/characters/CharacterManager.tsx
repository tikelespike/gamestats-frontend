import React, { useState } from "react"
import CharacterCard from "./CharacterCard"
import {
  ActionIcon,
  Autocomplete,
  Box,
  Button,
  Center,
  Grid,
  Group,
  Loader,
  MantineTheme,
  Modal,
  SegmentedControl,
  TextInput,
  useMantineTheme,
} from "@mantine/core"
import {
  AddCharacterRequest,
  CharacterType,
  useAddCharacterMutation,
  useCharactersQuery,
  useOfficialCharactersQuery,
} from "../api/apiSlice"
import ErrorDisplay from "../../components/ErrorDisplay"
import AddCharacterCard from "./AddCharacterCard"
import styles from "./CharacterManager.module.css"
import { useDisclosure } from "@mantine/hooks"
import { useForm } from "@mantine/form"
import { IconWand } from "@tabler/icons-react"

const CharacterManager = () => {
  const theme: MantineTheme = useMantineTheme()
  const [addLoading, setAddLoading] = useState<boolean>(false)
  const getCharactersState = useCharactersQuery()
  const getOfficialCharactersState = useOfficialCharactersQuery()
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false)

  const officialCharacters: AddCharacterRequest[] =
    getOfficialCharactersState.isSuccess && getOfficialCharactersState.data
      ? getOfficialCharactersState.data
      : []
  const officialNames: string[] = officialCharacters.map(
    character => character.name,
  )

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

  const handleOpenAddModal = () => {
    newCharacterForm.reset()
    openAddModal()
  }

  const [addCharacter, addCharacterState] = useAddCharacterMutation()
  const handleAddCharacter = async (values: AddCharacterRequest) => {
    setAddLoading(true)
    try {
      const response = await addCharacter(values).unwrap()
    } catch (err) {
      console.error("Creation failed:", err)
      return
    }
    closeAddModal()
  }

  const handleMagicComplete = () => {
    const officialCharacter = officialCharacters.find(
      character => character.name === newCharacterForm.values.name,
    )
    if (officialCharacter == undefined) {
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
      onClick={() => alert(1)}
    />
  ))

  return (
    <>
      <Modal
        opened={addModalOpened}
        onClose={closeAddModal}
        onExitTransitionEnd={() => setAddLoading(false)}
        title="Add Character"
        centered
        size="md"
      >
        <form onSubmit={newCharacterForm.onSubmit(handleAddCharacter)}>
          <Grid gutter={"lg"}>
            <Grid.Col span={6}>
              <Autocomplete
                label="Character Name"
                disabled={addLoading}
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
                      addLoading ||
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
                disabled={addLoading}
                placeholder="fortuneteller"
                {...newCharacterForm.getInputProps("scriptToolIdentifier")}
              />
            </Grid.Col>
            <Grid.Col>
              <SegmentedControl
                fullWidth
                disabled={addLoading}
                data={[
                  { label: "Townsfolk", value: "townsfolk" },
                  { label: "Outsider", value: "outsider" },
                  { label: "Minion", value: "minion" },
                  { label: "Demon", value: "demon" },
                  { label: "Traveller", value: "traveller" },
                ]}
                {...newCharacterForm.getInputProps("type")}
              />
            </Grid.Col>
            <Grid.Col>
              <TextInput
                label="Wiki Page URL"
                disabled={addLoading}
                placeholder="https://wiki.bloodontheclocktower.com/Fortune_Teller"
                {...newCharacterForm.getInputProps("wikiPageLink")}
              />
            </Grid.Col>
            <Grid.Col>
              <TextInput
                label="Image URL"
                disabled={addLoading}
                placeholder="https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Fortune%20Teller_icon.webp"
                {...newCharacterForm.getInputProps("imageUrl")}
              />
            </Grid.Col>
          </Grid>

          <Group mt="xl" justify="flex-end">
            <Button type={"submit"} loading={addLoading}>
              Create
            </Button>
          </Group>
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
