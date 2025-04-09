import type { AddScriptRequest, Script } from "../api/apiSlice"
import { useEditScriptMutation } from "../api/apiSlice"
import { notifications } from "@mantine/notifications"
import ScriptForm from "./ScriptForm"
import { modals } from "@mantine/modals"
import { useState } from "react"

interface EditScriptModalProps {
  script: Script
}

const EditScriptModal = ({ script }: EditScriptModalProps) => {
  const [editScript] = useEditScriptMutation()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values: AddScriptRequest) => {
    setIsLoading(true)
    try {
      await editScript({
        id: script.id,
        version: script.version,
        ...values,
      }).unwrap()
      notifications.show({
        title: "Success",
        message: "Script updated successfully",
        color: "green",
      })
      modals.closeAll()
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update script. Please try again.",
        color: "red",
      })
      setIsLoading(false)
    }
  }

  return (
    <ScriptForm
      initialValues={{
        name: script.name,
        description: script.description,
        wikiPageLink: script.wikiPageLink,
        characterIds: script.characterIds,
      }}
      onSubmit={handleSubmit}
      submitLabel="Update"
      isSubmitting={isLoading}
    />
  )
}

export default EditScriptModal
