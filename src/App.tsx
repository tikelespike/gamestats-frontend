import "./App.css"
import { Box, Center } from "@mantine/core"
import { Route, Routes } from "react-router-dom"
import { Login } from "./features/auth/Login"
import { PrivateOutlet } from "./utils/PrivateOutlet"

function Hooray() {
  return (
    <Center h="500px">
      <Box>Hooray you logged in!</Box>
    </Center>
  )
}

const App = () => {
  return (
    <Box>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PrivateOutlet />}>
          <Route index element={<Hooray />} />
        </Route>
      </Routes>
    </Box>
  )
}

export default App
