import React from "react"
import PlayerAvatar from "./PlayerAvatar"

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
  ]

  return (
    <div>
      <h1>Game Manager</h1>
      <div>
        {exampleData.map(player => (
          <PlayerAvatar
            key={player.id}
            imageUrl={player.imageUrl}
            name={player.name}
          />
        ))}
      </div>
    </div>
  )
}

export default GameManager
