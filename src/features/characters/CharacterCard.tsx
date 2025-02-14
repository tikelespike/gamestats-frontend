import React from "react"
import { Avatar, Paper, Stack, Text } from "@mantine/core"

interface CharacterCardProps {
  name: string
  type: string
  icon: string
}

export function CharacterCard(props: CharacterCardProps) {
  return (
    <Paper shadow="lg" withBorder p="md" w="fit-content">
      <Stack gap="0" align="center">
        <Avatar size={40} src={props.icon} radius={40} mb="sm" />
        <Text fz="sm" fw={500}>
          {props.name}
        </Text>
        <Text c="dimmed" fz="xs">
          {props.type}
        </Text>
      </Stack>
    </Paper>
  )
}

export default CharacterCard
