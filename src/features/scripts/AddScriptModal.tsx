import type { AddScriptRequest } from "../api/apiSlice"
import { useAddScriptMutation } from "../api/apiSlice"
import { notifications } from "@mantine/notifications"
import ScriptForm from "./ScriptForm"
import { modals } from "@mantine/modals"
import { useState } from "react"

const AddScriptModal = () => {
  const [addScript] = useAddScriptMutation()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values: AddScriptRequest) => {
    setIsLoading(true)
    try {
      await addScript(values).unwrap()
      notifications.show({
        title: "Success",
        message: "Script created successfully",
        color: "green",
      })
      modals.closeAll()
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create script. Please try again.",
        color: "red",
      })
      setIsLoading(false)
    }
  }

  return <ScriptForm onSubmit={handleSubmit} isSubmitting={isLoading} />
}

export default AddScriptModal
