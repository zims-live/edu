import { AppBar, Toolbar } from "@material-ui/core";
import React from "react";
import ToggleButton from "./ToggleButton"

interface BottomNavbarProps {
  toggleAudioMute?: () => void
  toggleVideoMute?: () => void
  toggleScreenShareOn?: () => void
  toggleScreenShareOff?: () => void
}

export default function BottomNavbar(props: BottomNavbarProps) {
  return (
    <div>
      <AppBar position="static" id="bottom-app-bar">
        <Toolbar>
          <ToggleButton
            toggleOn={props.toggleAudioMute}
            toggleOff={props.toggleAudioMute}
            color="inherit"
            toggledIcon="mic_off"
            regularIcon="mic"
          />
          <ToggleButton
            toggleOn={props.toggleVideoMute}
            toggleOff={props.toggleVideoMute}
            color="inherit"
            toggledIcon="videocam_off"
            regularIcon="videocam"
          />
          <ToggleButton
            toggleOn={props.toggleScreenShareOn}
            toggleOff={props.toggleScreenShareOff}
            color="inherit"
            toggledIcon="screen_share"
            regularIcon="stop_screen_share"
          />
        </Toolbar>
      </AppBar>
    </div>
  )
}

