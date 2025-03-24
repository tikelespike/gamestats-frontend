import React from "react"
import CharacterCard from "./CharacterCard"
import {
  ActionIcon,
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
} from "../api/apiSlice"
import ErrorDisplay from "../../components/ErrorDisplay"
import AddCharacterCard from "./AddCharacterCard"
import styles from "./CharacterManager.module.css"
import { useDisclosure } from "@mantine/hooks"
import { useForm } from "@mantine/form"
import { IconWand } from "@tabler/icons-react"

const CharacterManager = () => {
  const theme: MantineTheme = useMantineTheme()
  const getCharactersState = useCharactersQuery()
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false)

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
  const [addCharacter, addCharacterState] = useAddCharacterMutation()
  const handleAddCharacter = async (values: AddCharacterRequest) => {
    console.log(values)
    try {
      const response = await addCharacter(values).unwrap()
    } catch (err) {
      console.error("Creation failed:", err)
    }
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
        title="Add Character"
        centered
        size="md"
      >
        <form onSubmit={newCharacterForm.onSubmit(handleAddCharacter)}>
          <Grid gutter={"lg"}>
            <Grid.Col span={6}>
              <TextInput
                label="Character Name"
                placeholder="Fortune Teller"
                withAsterisk
                {...newCharacterForm.getInputProps("name")}
                rightSection={
                  <ActionIcon
                    size={32}
                    color={theme.primaryColor}
                    variant="transparent"
                  >
                    <IconWand size={18} stroke={1.5} />
                  </ActionIcon>
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Script Tool Identifier"
                placeholder="fortuneteller"
                {...newCharacterForm.getInputProps("scriptToolIdentifier")}
              />
            </Grid.Col>
            <Grid.Col>
              <SegmentedControl
                fullWidth
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
                placeholder="https://wiki.bloodontheclocktower.com/Fortune_Teller"
                {...newCharacterForm.getInputProps("wikiPageLink")}
              />
            </Grid.Col>
            <Grid.Col>
              <TextInput
                label="Image URL"
                placeholder="https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Fortune%20Teller_icon.webp"
                {...newCharacterForm.getInputProps("imageUrl")}
              />
            </Grid.Col>
          </Grid>

          <Group mt="xl" justify="flex-end">
            <Button type={"submit"} loading={addCharacterState.isLoading}>
              Create
            </Button>
          </Group>
        </form>
      </Modal>
      <Box className={styles.container}>
        <AddCharacterCard onClick={openAddModal} />
        {characterCards}
      </Box>
    </>
  )
}

export default CharacterManager
