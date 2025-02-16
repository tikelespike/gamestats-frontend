import React from "react"
import CharacterCard from "./CharacterCard"
import { Box, Center, Loader } from "@mantine/core"
import { useCharactersQuery } from "../api/apiSlice"
import ErrorDisplay from "../../components/ErrorDisplay"
import AddCharacterCard from "./AddCharacterCard"
import styles from "./CharacterManager.module.css"

const data = [
  {
    id: 1,
    name: "Snake Charmer",
    type: "Townsfolk",
    icon: "https://script.bloodontheclocktower.com/images/icon/1 - Trouble Brewing/townsfolk/Fortune Teller_icon.webp",
  },
  {
    id: 2,
    name: "Washerwoman",
    type: "Townsfolk",
    icon: "https://script.bloodontheclocktower.com/images/icon/1 - Trouble Brewing/townsfolk/Fortune Teller_icon.webp",
  },
  {
    id: 3,
    name: "Test",
    type: "Outsider",
    icon: "https://script.bloodontheclocktower.com/images/icon/1 - Trouble Brewing/townsfolk/Fortune Teller_icon.webp",
  },
  {
    id: 4,
    name: "Fortune Teller",
    type: "Townsfolk",
    icon: "https://script.bloodontheclocktower.com/images/icon/1 - Trouble Brewing/townsfolk/Fortune Teller_icon.webp",
  },
  {
    id: 5,
    name: "Fortune Teller",
    type: "Townsfolk",
    icon: "https://script.bloodontheclocktower.com/images/icon/1 - Trouble Brewing/townsfolk/Fortune Teller_icon.webp",
  },
]

const CharacterManager = () => {
  const getCharactersState = useCharactersQuery()

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
    <Box className={styles.container}>
      <AddCharacterCard onClick={() => alert(1)} />
      {characterCards}
    </Box>
  )
}

export default CharacterManager
