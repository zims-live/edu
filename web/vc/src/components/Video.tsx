import React, { useEffect, useRef } from "react"

interface VideoProps {
  muted: boolean
  srcObject: any
}

export default function Video(props: VideoProps) {
  const videoSrc = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (videoSrc.current) videoSrc.current.srcObject = props.srcObject
  }, [props.srcObject])

  return <video ref={videoSrc} autoPlay muted={props.muted} />
}
