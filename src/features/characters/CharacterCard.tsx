import React from "react"
import { Avatar, Group, Paper, Text } from "@mantine/core"

interface CharacterCardProps {
  name: string
  type: string
  icon: string
}

export function CharacterCard(props: CharacterCardProps) {
  return (
    <Paper shadow="lg" withBorder p="md" w="fit-content">
      <Group gap="sm">
        <Avatar size={40} src={props.icon} radius={40} />
        <div>
          <Text fz="sm" fw={500} mr="sm">
            {props.name}
          </Text>
          <Text c="dimmed" fz="xs" mr="sm">
            {props.type}
          </Text>
        </div>
      </Group>
    </Paper>
  )
}

export default CharacterCard
