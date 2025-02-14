import React from "react"
import { Avatar, Paper, Stack, Text } from "@mantine/core"

interface CharacterCardProps {
  name: string
  type: string
  icon: string
  onClick?: () => void
}

export function CharacterCard({
  name,
  type,
  icon,
  onClick,
}: CharacterCardProps) {
  return (
    <Paper
      shadow="lg"
      withBorder
      p="md"
      w="fit-content"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <Stack gap="0" align="center">
        <Avatar size={40} src={icon} radius={40} mb="sm" />
        <Text fz="sm" fw={500}>
          {name}
        </Text>
        <Text c="dimmed" fz="xs">
          {type}
        </Text>
      </Stack>
    </Paper>
  )
}

export default CharacterCard
