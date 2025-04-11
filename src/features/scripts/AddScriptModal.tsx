import type { AddScriptRequest } from "../api/apiSlice"
import { useAddScriptMutation } from "../api/apiSlice"
import { notifications } from "@mantine/notifications"
import ScriptForm from "./ScriptForm"
import { useState } from "react"

interface AddScriptModalProps {
  onSuccess?: () => void
  onClose: () => void
}

const AddScriptModal = ({
  onSuccess = () => {},
  onClose,
}: AddScriptModalProps) => {
  const [addScript] = useAddScriptMutation()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values: AddScriptRequest) => {
    setIsLoading(true)
    try {
      await addScript(values).unwrap()
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create script. Please try again.",
        color: "red",
      })
      setIsLoading(false)
      return
    }
    notifications.show({
      title: "Success",
      message: "Script created successfully",
      color: "green",
    })
    onSuccess()
    onClose()
  }

  return <ScriptForm onSubmit={handleSubmit} isSubmitting={isLoading} />
}

export default AddScriptModal
