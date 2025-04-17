import { Card } from "@mantine/core"
import PlayerCircle from "./PlayerCircle"

const GameManager = () => {
  const exampleData = [
    {
      id: 1,
      name: "Timo",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Chef_icon.webp",
    },
    {
      id: 2,
      name: "Hannah",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Empath_icon.webp",
    },
    {
      id: 3,
      name: "Pauline",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/demon/Imp_icon.webp",
    },
    {
      id: 4,
      name: "John",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Fortune%20Teller_icon.webp",
    },
    {
      id: 5,
      name: "Sarah",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/minion/Baron_icon.webp",
    },
    {
      id: 6,
      name: "Michael",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Undertaker_icon.webp",
    },
    {
      id: 7,
      name: "Alice",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Investigator_icon.webp",
    },
    {
      id: 8,
      name: "Bob",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Washerwoman_icon.webp",
    },
    {
      id: 9,
      name: "Charlie",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Slayer_icon.webp",
    },
    {
      id: 10,
      name: "David",
      imageUrl:
        "https://script.bloodontheclocktower.com/images/icon/1%20-%20Trouble%20Brewing/townsfolk/Virgin_icon.webp",
    },
  ]

  return (
    <div>
      <h1>Game Manager</h1>
      <Card shadow={"lg"} withBorder>
        <PlayerCircle players={exampleData} />
      </Card>
    </div>
  )
}

export default GameManager
