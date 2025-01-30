import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export function PrivateOutlet() {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.token) {
    console.log("PrivateOutlet: No token found, redirecting to login")
  }

  return auth.token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  )
}
