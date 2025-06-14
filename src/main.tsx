import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import { store } from "./app/store"
import "./index.css"
import { MantineProvider } from "@mantine/core"
import { BrowserRouter } from "react-router-dom"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import { Notifications } from "@mantine/notifications"
import { ModalsProvider } from "@mantine/modals"

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <MantineProvider defaultColorScheme="dark">
          <ModalsProvider>
            <Notifications />
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ModalsProvider>
        </MantineProvider>
      </Provider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
