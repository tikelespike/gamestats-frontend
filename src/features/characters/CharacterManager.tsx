import React from "react"
import CharacterCard from "./CharacterCard"
import type { MantineTheme } from "@mantine/core"
import {
  Box,
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core"
import type { AddCharacterRequest } from "../api/apiSlice"
import { useCharactersQuery, useOfficialCharactersQuery } from "../api/apiSlice"
import ErrorDisplay from "../../components/ErrorDisplay"
import { useMediaQuery } from "@mantine/hooks"
import { modals } from "@mantine/modals"
import styles from "./CharacterManager.module.css"
import AddCharacterCard from "./AddCharacterCard"
import { BatchDeleteDialog } from "./BatchDeleteDialog"
import { BatchAddDialog } from "./BatchAddDialog"
import { AddCharacterModal } from "./AddCharacterModal"
import { EditCharacterModal } from "./EditCharacterModal"

const CharacterManager = () => {
  const theme: MantineTheme = useMantineTheme()
  const [isMultiSelectMode, setIsMultiSelectMode] =
    React.useState<boolean>(false)
  const [selectedCharacterIds, setSelectedCharacterIds] = React.useState<
    number[]
  >([])
  const getCharactersState = useCharactersQuery()
  const getOfficialCharactersState = useOfficialCharactersQuery()
  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)

  const handleOpenAddModal = () => {
    const modalId = modals.open({
      title: "Add Character",
      centered: true,
      size: "md",
      fullScreen: isSmallScreen,
      children: <AddCharacterModal onClose={() => modals.close(modalId)} />,
    })
  }

  const handleOpenEditModal = (id: number) => {
    if (getCharactersState.data === undefined) {
      return
    }
    const character = getCharactersState.data.find(
      character => character.id === id,
    )
    if (character === undefined) {
      console.error("Character that should be edited not found")
      return
    }

    const modalId = modals.open({
      title: "Edit Character",
      centered: true,
      size: "md",
      fullScreen: isSmallScreen,
      children: (
        <EditCharacterModal
          character={character}
          onClose={() => modals.close(modalId)}
        />
      ),
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

  let missingOfficialCharacters: AddCharacterRequest[] = []
  if (getCharactersState.data && getOfficialCharactersState.data) {
    const existingNames = new Set(getCharactersState.data.map(c => c.name))
    missingOfficialCharacters = getOfficialCharactersState.data.filter(
      character => !existingNames.has(character.name),
    )
  }

  const handleBatchAddCharacters = () => {
    const missingCharacters = missingOfficialCharacters
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

  if (getCharactersState.data.length === 0) {
    return (
      <Center>
        <Stack align="center" gap="md" mt={"xl"}>
          <Text size="lg" ta="center" mb={"xl"}>
            Looks a bit empty here, huh? To get started:
          </Text>
          <Button
            size="lg"
            onClick={handleBatchAddCharacters}
            disabled={missingOfficialCharacters.length === 0}
          >
            Import all official characters
          </Button>
          <Text>or</Text>
          <Button
            size="lg"
            variant={"transparent"}
            onClick={handleOpenAddModal}
          >
            Create a character manually
          </Button>
        </Stack>
      </Center>
    )
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

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Group>
          <Button
            variant={isMultiSelectMode ? "light" : "filled"}
            color={isMultiSelectMode ? "gray" : "blue"}
            onClick={handleToggleMultiSelectMode}
          >
            {isMultiSelectMode ? "Cancel" : "Select characters"}
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
              >
                Delete selected ({selectedCharacterIds.length})
              </Button>
            </>
          ) : (
            <Button
              variant="gradient"
              onClick={handleBatchAddCharacters}
              disabled={missingOfficialCharacters.length === 0}
            >
              Import {missingOfficialCharacters.length} new character
              {missingOfficialCharacters.length > 1 ? "s" : ""}
            </Button>
          )}
        </Group>
      </Group>
      <Box className={styles.container}>
        <AddCharacterCard onClick={handleOpenAddModal} />
        {characterCards}
      </Box>
    </Box>
  )
}

export default CharacterManager
