import { IconLogout, IconPassword } from "@tabler/icons-react"
import {
  Avatar,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core"
import classes from "./UserButton.module.css"
import { useMediaQuery } from "@mantine/hooks"

interface UserButtonProps {
  userId: number
}

export function UserButton({ userId }: UserButtonProps) {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

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
            <Avatar name={"Timo Weberruß"} radius="xl" />

            {!isMobile && (
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  Timo Weberruß
                </Text>

                <Text c="dimmed" size="xs">
                  timo@klue.de
                </Text>
              </div>
            )}
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
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
