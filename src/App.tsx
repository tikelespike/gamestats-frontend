import "./App.css"
import { Box } from "@mantine/core"
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

const App = () => {
  return (
    <Box>
      <Routes>
        <Route element={<PublicOutlet />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<PrivateOutlet />}>
          <Route element={<MainLayout />}>
            <Route path="/manager/games" element={<GameManager />} />
            <Route path="/manager/characters" element={<CharacterManager />} />
            <Route path="/manager/players" element={<PlayerManager />} />
          </Route>
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
