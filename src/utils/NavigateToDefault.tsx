import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth" // Adjust based on your auth hook

const NavigateToDefault = () => {
  const token = useAuth()
  return token ? <Navigate to="/manager/games" /> : <Navigate to="/login" />
}

export default NavigateToDefault
