import React from "react"
import { useAppDispatch } from "../../app/hooks"
import { useNavigate } from "react-router-dom"
import type { LoginRequest } from "../api/apiSlice"
import { useLoginMutation } from "../api/apiSlice"
import { useForm } from "@mantine/form"
import {
  Box,
  Button,
  Notification,
  PasswordInput,
  TextInput,
} from "@mantine/core"
import { setToken } from "./authSlice"

export const Login = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [login, { isLoading, isError, error }] = useLoginMutation()

  const form = useForm<LoginRequest>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: value =>
        value && value.trim().length > 0 ? null : "Username is required",
      password: value =>
        value && value.trim().length > 0 ? null : "Password is required",
    },
  })

  const handleSubmit = async (values: LoginRequest) => {
    try {
      const response = await login(values).unwrap()
      dispatch(setToken({ token: response.accessToken }))
      navigate("/manager/games")
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  return (
    <Box maw={400} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Username"
          placeholder="Your username"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          {...form.getInputProps("password")}
          mt="md"
        />
        <Button type="submit" fullWidth mt="xl" loading={isLoading}>
          Login
        </Button>
      </form>

      {isError && (
        <Notification color="red" mt="md">
          {error &&
          "data" in error &&
          (error.data as { message: string }).message
            ? (error.data as { message: string }).message
            : "Login failed"}
        </Notification>
      )}
    </Box>
  )
}

export default Login
