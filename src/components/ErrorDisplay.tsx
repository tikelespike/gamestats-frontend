import { Notification } from "@mantine/core"

function getErrorMessage(error: any): string {
  let errorMessage: string = "Error"

  if ("status" in error) {
    errorMessage += ` (Code ${error.status})`
  }
  if ("data" in error) {
    errorMessage += ": " + (error.data as { detail: string }).detail
  } else {
    errorMessage += ": (No additional information - see console for full error)"
    console.error(error)
  }
  return errorMessage
}

interface ErrorDisplayProps {
  error: any
}

function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <Notification color="red" mt="md">
      {getErrorMessage(error)}
    </Notification>
  )
}

export default ErrorDisplay
