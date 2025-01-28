import "./App.css"
import { Box } from "@mantine/core"
import { Route, Routes } from "react-router-dom"
import { Login } from "./features/auth/Login"
import { PrivateOutlet } from "./utils/PrivateOutlet"
import MainLayout from "./features/main/MainLayout"
import GameManager from "./features/games/GameManager"
import { PublicOutlet } from "./utils/PublicOutlet"

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
          </Route>
        </Route>
      </Routes>
    </Box>
  )
}

export default App
