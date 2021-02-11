import { AppBar, Icon, IconButton, Toolbar } from "@material-ui/core"
import React from "react"

export default function TopNavbar() {
  return (
    <AppBar position="static" id="top-app-bar">
      <Toolbar>
        <IconButton color="inherit">
          <Icon>perm_media</Icon>
        </IconButton>
        <IconButton color="inherit">
          <Icon>assignment</Icon>
        </IconButton>
        <IconButton color="inherit">
          <Icon>today</Icon>
        </IconButton>
        <IconButton color="inherit">
          <Icon>description</Icon>
        </IconButton>
        <IconButton color="inherit">
          <Icon>settings</Icon>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
