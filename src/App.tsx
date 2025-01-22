import "./App.css"
import { Box, Center } from "@mantine/core"
import { Route, Routes } from "react-router-dom"
import { Login } from "./features/auth/Login"
import { PrivateOutlet } from "./utils/PrivateOutlet"
import MainLayout from "./features/main/MainLayout"

const App = () => {
  return (
    <Box>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PrivateOutlet />}>
          <Route index element={<MainLayout />} />
        </Route>
      </Routes>
    </Box>
  )
}

export default App
