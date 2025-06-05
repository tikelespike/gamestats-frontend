import {
  IconChevronRight,
  IconLogout,
  IconMoon,
  IconPassword,
  IconSun,
} from "@tabler/icons-react"
import {
  Avatar,
  Button,
  Group,
  Loader,
  Menu,
  Modal,
  PasswordInput,
  Stack,
  Text,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core"
import classes from "./UserButton.module.css"
import { useMediaQuery } from "@mantine/hooks"
import type { User, UserUpdateRequest } from "../api/apiSlice"
import { useEditUserMutation, useUsersQuery } from "../api/apiSlice"
import { useAppDispatch } from "../../app/hooks"
import { logout } from "../auth/authSlice"
import { useState } from "react"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"

interface UserButtonProps {
  userId: number
}

export function UserButton({ userId }: UserButtonProps) {
  const theme = useMantineTheme()
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  })
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("userId")
    dispatch(logout()) // Reset Redux state
  }

  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  const [passwordChangeTriggered, setPasswordChangeTriggered] =
    useState<boolean>(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const passwordForm = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: value =>
        value && value.length >= 6 ? null : "Password too short",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  })
  const [updateUser] = useEditUserMutation()

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

  const handlePasswordSubmit = async (values: {
    password: string
    confirmPassword: string
  }) => {
    setPasswordChangeTriggered(true)
    const updateValues: UserUpdateRequest = {
      ...user,
      password: values.password,
    }
    try {
      await updateUser(updateValues).unwrap()
    } catch (err) {
      notifications.show({
        title: "Update failed",
        message:
          // @ts-ignore
          "Password could not be updated (error code " + err.status + ")",
        color: "red",
        autoClose: false,
        position: "top-center",
      })
      setPasswordChangeTriggered(false)
      return
    }
    notifications.show({
      title: "Success",
      message: "Password updated successfully",
      color: "green",
    })
    setIsPasswordModalOpen(false)
  }

  return (
    <>
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
          <Menu.Item
            leftSection={<IconPassword size={16} stroke={1.5} />}
            onClick={() => {
              passwordForm.reset()
              setPasswordChangeTriggered(false)
              setIsPasswordModalOpen(true)
            }}
          >
            Change password
          </Menu.Item>
          <Menu.Item
            leftSection={<IconLogout size={16} stroke={1.5} />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Modal
        opened={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
        centered
      >
        <form onSubmit={passwordForm.onSubmit(handlePasswordSubmit)}>
          <Stack>
            <PasswordInput
              placeholder="New password"
              {...passwordForm.getInputProps("password")}
              size="sm"
              w="100%"
              maw={500}
              disabled={passwordChangeTriggered}
            />
            <PasswordInput
              placeholder="Confirm new password"
              {...passwordForm.getInputProps("confirmPassword")}
              size="sm"
              w="100%"
              maw={500}
              disabled={passwordChangeTriggered}
            />
          </Stack>
          <Group mt="xl" justify="flex-end">
            <Button
              variant="default"
              onClick={() => setIsPasswordModalOpen(false)}
              disabled={passwordChangeTriggered}
            >
              Cancel
            </Button>
            <Button type="submit" loading={passwordChangeTriggered}>
              Save
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}
