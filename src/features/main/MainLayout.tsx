import { useDisclosure } from "@mantine/hooks"
import { AppShell, Burger, Group, Text } from "@mantine/core"
import { NavBar } from "./NavBar"
import { Outlet } from "react-router-dom"
import type React from "react"
import { UserButton } from "./UserButton"
import { useAppSelector } from "../../app/hooks"

const MainLayout: React.FC = () => {
  const [opened, { toggle, close }] = useDisclosure()
  const userId = useAppSelector(state => state.auth.userId)

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
          {userId != null && <UserButton userId={userId} />}
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
