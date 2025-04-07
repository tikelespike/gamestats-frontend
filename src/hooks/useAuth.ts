import { useMemo } from "react"
import type { RootState } from "../app/store"
import { useAppSelector } from "../app/hooks"

export const useAuth = () => {
  const token = useAppSelector((state: RootState) => state.auth.token)

  return useMemo(() => ({ token }), [token])
}
