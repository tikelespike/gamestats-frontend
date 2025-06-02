import {
  IconChevronRight,
  IconLogout,
  IconMoon,
  IconPassword,
  IconSun,
} from "@tabler/icons-react"
import {
  Avatar,
  Group,
  Loader,
  Menu,
  Text,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core"
import classes from "./UserButton.module.css"
import { useMediaQuery } from "@mantine/hooks"
import type { User } from "../api/apiSlice"
import { useUsersQuery } from "../api/apiSlice"

interface UserButtonProps {
  userId: number
}

export function UserButton({ userId }: UserButtonProps) {
  const theme = useMantineTheme()
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  })

  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
  const users = useUsersQuery()
  if (users.isLoading) {
    return <Loader size={"md"} />
  }
  if (users.isError || !users.data) {
    return <div />
  }
  const user: User | undefined = users.data.find(u => u.id === userId)
  if (!user) {
    return <Text>No user</Text>
  }
  return (
    <Menu
      withArrow
      position="bottom"
      transitionProps={{ transition: "pop" }}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className={classes.user}>
          <Group>
            <Avatar name={user.name} radius="xl" />

            {!isMobile && (
              <>
                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    {user.name}
                  </Text>

                  <Text c="dimmed" size="xs">
                    {user.email}
                  </Text>
                </div>
                <IconChevronRight size={14} stroke={1.5} />
              </>
            )}
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Interface</Menu.Label>
        <Menu.Item
          leftSection={
            computedColorScheme === "light" ? (
              <IconMoon size={16} stroke={1.5} />
            ) : (
              <IconSun size={16} stroke={1.5} />
            )
          }
          onClick={() =>
            setColorScheme(computedColorScheme === "light" ? "dark" : "light")
          }
        >
          Toggle Theme
        </Menu.Item>

        <Menu.Label>Account</Menu.Label>
        <Menu.Item leftSection={<IconPassword size={16} stroke={1.5} />}>
          Change password
        </Menu.Item>
        <Menu.Item leftSection={<IconLogout size={16} stroke={1.5} />}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
