import React from "react"
import CharacterCard from "./CharacterCard"
import { Box } from "@mantine/core"

const data = [
  {
    id: 1,
    name: "Fortune Teller",
    type: "Townsfolk",
    icon: "https://script.bloodontheclocktower.com/images/icon/1 - Trouble Brewing/townsfolk/Fortune Teller_icon.webp",
  },
  {
    id: 2,
    name: "Fortune Teller",
    type: "Townsfolk",
    icon: "https://script.bloodontheclocktower.com/images/icon/1 - Trouble Brewing/townsfolk/Fortune Teller_icon.webp",
  },
  {
    id: 3,
    name: "Fortune Teller",
    type: "Townsfolk",
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
  const characters = data.map(character => (
    <Box m="xs" key={character.id}>
      <CharacterCard
        name={character.name}
        type={character.type}
        icon={character.icon}
        onClick={() => alert(1)}
      />
    </Box>
  ))

  return (
    <Box
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {characters}
    </Box>
  )
}

export default CharacterManager
