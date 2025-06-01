import "./App.css"
import { Box, Center, Loader } from "@mantine/core"
import { Route, Routes } from "react-router-dom"
import { Login } from "./features/auth/Login"
import { PrivateOutlet } from "./utils/PrivateOutlet"
import MainLayout from "./features/main/MainLayout"
import GameManager from "./features/games/GameManager"
import { PublicOutlet } from "./utils/PublicOutlet"
import CharacterManager from "./features/characters/CharacterManager"
import PlayerManager from "./features/players/PlayerManager"
import NavigateToDefault from "./utils/NavigateToDefault"
import { NotFound } from "./features/notfound/NotFound"
import { useEffect, useState } from "react"
import { setUserInfo } from "./features/auth/authSlice"
import { jwtDecode } from "jwt-decode"
import { useAppDispatch } from "./app/hooks"
import ScriptManager from "./features/scripts/ScriptManager"

const App = () => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token")
    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId")
    if (token && userId) {
      const decoded: { exp: number } = jwtDecode(token)
      const isExpired: boolean = decoded.exp * 1000 < Date.now()
      const userIdNumber = parseInt(userId)
      if (!isExpired) dispatch(setUserInfo({ token, userId: userIdNumber }))
    }
    setLoading(false)
  }, [dispatch])

  if (loading) {
    return (
      <Center>
        <Loader top="40vh" color="blue" size="xl" type="bars" />
      </Center>
    )
  }

  return (
    <Box>
      <Routes>
        <Route element={<PrivateOutlet />}>
          <Route element={<MainLayout />}>
            <Route path="/manager/games" element={<GameManager />} />
            <Route path="/manager/scripts" element={<ScriptManager />} />
            <Route path="/manager/characters" element={<CharacterManager />} />
            <Route path="/manager/players" element={<PlayerManager />} />
          </Route>
        </Route>

        <Route element={<PublicOutlet />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Redirect "/" based on authentication */}
        <Route path="/" element={<NavigateToDefault />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  )
}

export default App
