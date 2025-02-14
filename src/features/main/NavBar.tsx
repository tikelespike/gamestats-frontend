import {
  IconCircles,
  IconDeviceGamepad,
  IconLogout,
  IconScript,
  IconUsers,
  IconUserSquareRounded,
} from "@tabler/icons-react"
import classes from "./NavBar.module.css"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../app/hooks"
import { logout } from "../auth/authSlice"

const data = [
  { link: "/manager/games", label: "Games", icon: IconDeviceGamepad },
  { link: "/manager/scripts", label: "Scripts", icon: IconScript },
  { link: "/manager/characters", label: "Characters", icon: IconCircles },
  { link: "/manager/players", label: "Players", icon: IconUsers },
  { link: "/manager/users", label: "Users", icon: IconUserSquareRounded },
]

export function NavBar({ onNavigate }: { onNavigate: () => void }) {
  const location = useLocation()
  const active = location.pathname
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    dispatch(logout()) // Reset Redux state
  }

  const links = data.map(item => (
    <a
      className={classes.link}
      data-active={item.link === active || undefined}
      href={item.link}
      key={item.label}
      onClick={event => {
        event.preventDefault()
        navigate(item.link)
        onNavigate()
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
          onClick={event => {
            event.preventDefault()
            handleLogout()
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  )
}
