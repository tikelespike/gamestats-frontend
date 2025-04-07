import React from "react"
import { ScriptCard } from "./ScriptCard"
import { Center, Stack } from "@mantine/core"

const ScriptManager = () => {
  const exampleScripts = [
    {
      id: 2,
      version: 0,
      name: "Trouble Brewing",
      description: "An easy script suitable for beginners.",
      wikiPageLink: "https://wiki.bloodontheclocktower.com/Trouble_Brewing",
      characterIds: [21, 19, 31, 23, 26, 33],
    },
    {
      id: 3,
      version: 0,
      name: "Trouble Brewing",
      description: "An easy script suitable for beginners.",
      wikiPageLink: "https://wiki.bloodontheclocktower.com/Trouble_Brewing",
      characterIds: [21, 19, 31, 23, 26, 33],
    },
    {
      id: 4,
      version: 0,
      name: "Trouble Brewing",
      description: "An easy script suitable for beginners.",
      wikiPageLink: "https://wiki.bloodontheclocktower.com/Trouble_Brewing",
      characterIds: [21, 19, 31, 23, 26, 33],
    },
    {
      id: 5,
      version: 0,
      name: "Trouble Brewing",
      description:
        "An easy script suitable for s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s s .",
      wikiPageLink: "https://wiki.bloodontheclocktower.com/Trouble_Brewing",
      characterIds: [21, 19, 31, 23, 26, 33],
    },
    {
      id: 6,
      version: 0,
      name: "Trouble Brewing",
      description: "An easy script suitable for beginners.",
      wikiPageLink: "https://wiki.bloodontheclocktower.com/Trouble_Brewing",
      characterIds: [21, 19, 31, 23, 26, 33],
    },
  ]
  const scriptCards = exampleScripts.map(script => (
    <ScriptCard
      key={script.id}
      script={script}
      onDelete={() => {}}
      onEdit={() => {}}
    />
  ))
  return (
    <Center mt={"xl"}>
      <Stack gap={"lg"}>{scriptCards}</Stack>
    </Center>
  )
}

export default ScriptManager
