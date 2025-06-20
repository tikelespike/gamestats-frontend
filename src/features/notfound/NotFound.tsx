import { Button, Center, Container, Group, Text, Title } from "@mantine/core"
import { Illustration } from "./Illustration"
import classes from "./NotFound.module.css"
import { useNavigate } from "react-router-dom"

export function NotFound() {
  const navigate = useNavigate()

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Nothing to see here</Title>
          <Center>
            <Text
              c="dimmed"
              size="lg"
              ta="center"
              className={classes.description}
            >
              Page you are trying to open does not exist. You may have mistyped
              the address, or the page has been moved to another URL. If you
              think this is an error contact support.
            </Text>
          </Center>
          <Group justify="center">
            <Button size="md" onClick={e => navigate("/")}>
              Take me back to home page
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  )
}
