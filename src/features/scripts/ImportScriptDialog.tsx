import { useState } from "react"
import { Button, Group, Modal, Text, Textarea } from "@mantine/core"
import type { AddScriptRequest } from "../api/apiSlice"
import { useCharactersQuery } from "../api/apiSlice"

interface ImportScriptDialogProps {
  opened: boolean
  onClose: () => void
  onImport: (script: AddScriptRequest) => void
}

interface ScriptToolExport {
  id: string
  author?: string
  name?: string
}

const ImportScriptDialog = ({
  opened,
  onClose,
  onImport,
}: ImportScriptDialogProps) => {
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { data: characters = [] } = useCharactersQuery()

  const parseScriptToolExport = (json: string): AddScriptRequest => {
    const parsed = JSON.parse(json) as (string | ScriptToolExport)[]

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid format: Expected an array")
    }

    if (parsed.length === 0) {
      throw new Error("Invalid format: Array is empty")
    }

    let name = ""
    let description = null
    const scriptToolIdentifiers: string[] = []
    const characterIds: number[] = []
    const unknownCharacters: string[] = []

    // Check if first element is a meta object
    if (typeof parsed[0] === "object" && parsed[0] !== null) {
      const meta = parsed[0] as ScriptToolExport
      if (meta.id === "_meta") {
        name = meta.name || ""
        description = meta.author ? `Created by ${meta.author}` : null
        scriptToolIdentifiers.push(...(parsed.slice(1) as string[]))
      } else {
        scriptToolIdentifiers.push(...(parsed as string[]))
      }
    } else {
      scriptToolIdentifiers.push(...(parsed as string[]))
    }

    for (const identifier of scriptToolIdentifiers) {
      const character = characters.find(
        c => c.scriptToolIdentifier === identifier,
      )
      if (character) {
        characterIds.push(character.id)
      } else {
        unknownCharacters.push(identifier)
      }
    }

    if (unknownCharacters.length > 0) {
      throw new Error(
        `Unknown characters: ${unknownCharacters.join(", ")}. Please create these characters first.`,
      )
    }
    return {
      name,
      description,
      wikiPageLink: null,
      characterIds,
    }
  }

  const handleImport = () => {
    setError(null)
    let parsedScript: AddScriptRequest
    try {
      parsedScript = parseScriptToolExport(jsonInput)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse script")
      return
    }
    onImport(parsedScript)
    onClose()
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Import Script from Official Tool"
      size="lg"
      styles={{
        inner: {
          zIndex: 1000,
        },
        content: {
          zIndex: 1000,
        },
        overlay: {
          zIndex: 999,
        },
      }}
    >
      <Textarea
        label="Paste JSON Export"
        placeholder='[{"id":"_meta","author":"John Doe","name":"Trouble Brewing"}, "fortuneteller", "drunk", "imp"]'
        minRows={5}
        value={jsonInput}
        onChange={e => {
          setJsonInput(e.currentTarget.value)
          setError(null)
        }}
        error={error}
        autosize
      />
      <Text size="sm" c="dimmed" mt="xs">
        Paste the JSON export from the official Blood on the Clocktower script
        tool. All characters in the script must be created in the app first.
      </Text>
      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleImport} disabled={!jsonInput.trim()}>
          Import
        </Button>
      </Group>
    </Modal>
  )
}

export default ImportScriptDialog
