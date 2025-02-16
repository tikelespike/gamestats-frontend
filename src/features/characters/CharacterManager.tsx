import React from "react"
import CharacterCard from "./CharacterCard"
import {
  Box,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  TextInput,
} from "@mantine/core"
import {
  AddCharacterRequest,
  CharacterType,
  useCharactersQuery,
} from "../api/apiSlice"
import ErrorDisplay from "../../components/ErrorDisplay"
import AddCharacterCard from "./AddCharacterCard"
import styles from "./CharacterManager.module.css"
import { useDisclosure } from "@mantine/hooks"
import { useForm } from "@mantine/form"

const CharacterManager = () => {
  const getCharactersState = useCharactersQuery()
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false)

  const newCharacterForm = useForm<AddCharacterRequest>({
    initialValues: {
      name: "",
      scriptToolIdentifier: null,
      type: CharacterType.Townsfolk,
      wikiPageUrl: null,
      imageUrl: null,
    },
  })

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
      >
        <TextInput
          label="Character Name"
          placeholder="Fortune Teller"
          {...newCharacterForm.getInputProps("name")}
        />
        <Group mt="xl" justify="flex-end">
          <Button>Next</Button>
        </Group>
      </Modal>
      <Box className={styles.container}>
        <AddCharacterCard onClick={openAddModal} />
        {characterCards}
      </Box>
    </>
  )
}

export default CharacterManager
