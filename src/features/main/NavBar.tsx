import { useState } from "react"
import {
  IconCircles,
  IconDeviceGamepad,
  IconLogout,
  IconScript,
  IconSwitchHorizontal,
  IconUsers,
  IconUserSquareRounded,
} from "@tabler/icons-react"
import classes from "./NavBar.module.css"

const data = [
  { link: "", label: "Games", icon: IconDeviceGamepad },
  { link: "", label: "Scripts", icon: IconScript },
  { link: "", label: "Characters", icon: IconCircles },
  { link: "", label: "Users", icon: IconUserSquareRounded },
  { link: "", label: "Players", icon: IconUsers },
]

export function NavBar() {
  const [active, setActive] = useState("Games")

  const links = data.map(item => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={event => {
        event.preventDefault()
        setActive(item.label)
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ))

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={event => event.preventDefault()}
        >
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a
          href="#"
          className={classes.link}
          onClick={event => event.preventDefault()}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  )
}
