import React from "react"
import { useAppDispatch } from "../../app/hooks"
import { useNavigate } from "react-router-dom"
import type { LoginRequest } from "../api/apiSlice"
import { useLoginMutation } from "../api/apiSlice"
import { useForm } from "@mantine/form"
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Notification,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { setToken } from "./authSlice"
import classes from "./Login.module.css"

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export const Login = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [login, { isLoading, isError, error }] = useLoginMutation()

  const form = useForm<LoginFormData>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: {
      email: value =>
        value && value.trim().length > 0 ? null : "Username is required",
      password: value =>
        value && value.trim().length > 0 ? null : "Password is required",
    },
  })

  const handleSubmit = async (values: LoginFormData) => {
    try {
      const loginRequest: LoginRequest = {
        email: values.email,
        password: values.password,
      }
      const response = await login(loginRequest).unwrap()
      // Store the token - I am aware that this is comes with security risks (XSS),
      // but for this small and uncritical project it is acceptable. I might implement
      // using secure cookies in the future.
      if (values.rememberMe) {
        localStorage.setItem("token", response.accessToken)
      } else {
        sessionStorage.setItem("token", response.accessToken)
      }
      dispatch(setToken({ token: response.accessToken }))
      navigate("/manager/games")
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet? Contact me to get one.
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {isError && (
          <Notification color="red" mb="md">
            {error &&
            "data" in error &&
            (error.data as { message: string }).message
              ? (error.data as { message: string }).message
              : "Login failed"}
          </Notification>
        )}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Group justify="space-between" mt="lg">
            <Checkbox
              label="Remember me"
              {...form.getInputProps("rememberMe")}
            />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" loading={isLoading} type="submit">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  )
}

export default Login
