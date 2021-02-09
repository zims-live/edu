import { Icon, IconButton } from "@material-ui/core"
import React, { useState } from "react"

interface ToggleButtonProps {
  toggleOn?: () => void
  toggleOff?: () => void
  toggledIcon: any
  regularIcon: any
  color: "inherit" | "primary" | "secondary" | "default" | undefined
}

export default function ToggleButton(props: ToggleButtonProps) {
  const [toggled, setToggled] = useState<boolean>()

  const handleClick = () => {
    setToggled(prev => !prev)

    if (!toggled && props.toggleOn) props.toggleOn()
    else if(props.toggleOff) props.toggleOff()
  }

  const show = toggled ? (
    <Icon>{props.toggledIcon}</Icon>
  ) : (
    <Icon>{props.regularIcon}</Icon>
  )

  return (
    <IconButton color={props.color} onClick={handleClick}>
      {show}
    </IconButton>
  )
}
