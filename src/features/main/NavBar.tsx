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
import { useLocation, useNavigate } from "react-router-dom"

const data = [
  { link: "/manager/games", label: "Games", icon: IconDeviceGamepad },
  { link: "/manager/scripts", label: "Scripts", icon: IconScript },
  { link: "/manager/characters", label: "Characters", icon: IconCircles },
  { link: "/manager/players", label: "Players", icon: IconUsers },
  { link: "/manager/users", label: "Users", icon: IconUserSquareRounded },
]

export function NavBar() {
  const location = useLocation()
  const active = location.pathname
  const navigate = useNavigate()

  const links = data.map(item => (
    <a
      className={classes.link}
      data-active={item.link === active || undefined}
      href={item.link}
      key={item.label}
      onClick={event => {
        event.preventDefault()
        navigate(item.link)
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
