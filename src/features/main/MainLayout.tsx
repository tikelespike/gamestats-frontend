import { useDisclosure } from "@mantine/hooks"
import { AppShell, Burger, Group, Text } from "@mantine/core"
import { NavBar } from "./NavBar"
import { Outlet } from "react-router-dom"
import { ColorSchemeButton } from "../../components/ColorSchemeButton"
import type React from "react"
import { UserButton } from "./UserButton"

const MainLayout: React.FC = () => {
  const [opened, { toggle, close }] = useDisclosure()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text size="xl">Blood Manager</Text>
          <Group>
            <UserButton userId={0} />
            <ColorSchemeButton />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <NavBar onNavigate={close} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

export default MainLayout
