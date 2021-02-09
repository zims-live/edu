import React, { useEffect, useState } from "react"
import TopNavbar from "./TopNavbar"
import BottomNavbar from "./BottomNavbar"
import Video from "./Video"
import Janus from "../janus.js"

let server = "https://janus.zims.live/janus"
let opaqueId = "videoroomtest-" + Janus.randomString(12)
let sfutest: any = null
let started = false
let myusername = Math.floor(Math.random() * 1000)
let roomId = 1234
let bitrateTimer: (number | null)[] = []

Janus.init({
  debug: "all",
  callback: function () {
    if (started) return
    started = true
  },
})

export default function VideoSection() {
  const [janus, setJanus] = useState<any>()
  const [localStream, setLocalStream] = useState(new MediaStream())
  const [info, setInfo] = useState<string>("Initializing")
  const [status, setStatus] = useState<string>("init")
  const [roomID, setRoomID] = useState<string>("")
  const [isFront, setFront] = useState<boolean>(true)
  const [selfViewSrc, setSelfViewSrc] = useState<any>(null)
  const [selfViewSrcKey, setSelfViewSrcKey] = useState<any>(null)
  const [remoteList, setRemoteList] = useState<any>({})
  const [remoteListPluginHandle, setRemoteListPluginHandle] = useState<any>({})
  const [textRoomConnected, setTextRoomConnected] = useState<boolean>(false)
  const [textRoomData, setTextRoomData] = useState<string[]>([])
  const [textRoomValue, setTextRoomValue] = useState<string[]>([])
  const [isPublished, setPublished] = useState<boolean>(false)
  const [speaker, setSpeaker] = useState<boolean>(false)
  const [audioMute, setAudioMute] = useState<boolean>(false)
  const [videoMute, setVideoMute] = useState<boolean>(false)
  const [isVisible, setVisible] = useState<boolean>(false)

  const publishOwnFeed = (isUsingAudio: boolean) => {
    if (!isPublished) {
      setPublished(true)
      sfutest?.createOffer({
        media: {
          audioRecv: false,
          videoRecv: false,
          audioSend: isUsingAudio,
          videoSend: true,
        },
        success: (jsep: any) => {
          //Janus.log("Got: " + jsep);
          var publish = {
            request: "configure",
            audio: isUsingAudio,
            video: true,
          }
          //var publish = { request: "configure", audio: useAudio, video: true };
          sfutest?.send({ message: publish, jsep: jsep })
        },
        error: (error: Error) => {
          console.error("WebRTC error:", error)
          if (isUsingAudio) publishOwnFeed(false)
        },
      })
    } else {
      // this.setState({ publish: false });
      // let unpublish = { "request": "unpublish" };
      // sfutest.send({"message": unpublish});
    }
  }

  const newRemoteFeed = (id: string, _: any) => {
    let remoteFeed: null | any = null
    janus.attach({
      plugin: "janus.plugin.videoroom",
      success: (pluginHandle: any) => {
        remoteFeed = pluginHandle
        const listen = {
          request: "join",
          room: roomId,
          ptype: "listener",
          feed: id,
        }
        remoteFeed.send({ message: listen })
      },
      error: (error: Error) => {
        console.error("  -- Error attaching plugin...", error)
      },
      onmessage: (msg: any, jsep: any) => {
        let event = msg["videoroom"]
        if (event !== undefined && event != null) {
          if (event === "attached") {
            // Subscriber created and attached
          }
        }
        if (jsep !== undefined && jsep !== null) {
          remoteFeed.createAnswer({
            jsep: jsep,
            media: { audioSend: false, videoSend: false },
            success: (jsep: any) => {
              const body = { request: "start", room: roomId }
              remoteFeed.send({ message: body, jsep: jsep })
            },
            error: (error: Error) => {
              console.error("WebRTC error:", error)
            },
          })
        }
      },
      // TODO
      // webrtcState: on => {},
      // onlocalstream: stream => {},
      onremotestream: (stream: any) => {
        setInfo("On peer joined!")
        console.log("Peer" + id + " stream:")
        console.log(stream.constructor.name)
        remoteList[id] = stream
        remoteListPluginHandle[id] = remoteFeed
        setRemoteList(remoteList)
        setRemoteListPluginHandle(remoteListPluginHandle)
      },
      oncleanup: () => {
        if (remoteFeed.spinner !== undefined && remoteFeed.spinner !== null) {
          remoteFeed.spinner.stop()
        }
        remoteFeed.spinner = null
        if (
          bitrateTimer &&
          bitrateTimer[remoteFeed.rfindex] !== null &&
          bitrateTimer[remoteFeed.rfindex] !== null
        ) {
          clearInterval(bitrateTimer[remoteFeed.rfindex] || 0)
        }
        bitrateTimer[remoteFeed.rfindex] = null
      },
    })
  }

  const janusStart = () => {
    setVisible(true)
    setJanus(
      new Janus({
        server: server,
        success: () => {
          janus.attach({
            plugin: "janus.plugin.videoroom",
            opaqueId: opaqueId,
            success: (pluginHandle: any) => {
              sfutest = pluginHandle
              // Janus.log(
              //   "Plugin attached! (" +
              //     sfutest.getPlugin() +
              //     ", id=" +
              //     sfutest.getId() +
              //     ")"
              // )
              // Janus.log("  -- This is a publisher/manager")
              let register = {
                request: "join",
                room: roomId,
                ptype: "publisher",
                display: myusername.toString(),
              }
              sfutest?.send({ message: register })
            },
            error: (error: Error) => {
              console.error("  -- Error attaching plugin...", error)
            },
            // consentDialog: on => {},
            // mediaState: (medium, on) => {},
            webrtcState: (isOnline: boolean) => {
              console.log(
                "Janus says our WebRTC PeerConnection is " +
                  (isOnline ? "up" : "down") +
                  " now"
              )
            },
            onmessage: (msg: any, jsep: any) => {
              // console.log(msg)
              var event = msg["videoroom"]
              if (event !== undefined && event != null) {
                if (event === "joined") {
                  //myid = msg["id"];
                  publishOwnFeed(true)
                  setVisible(false)
                  if (
                    msg["publishers"] !== undefined &&
                    msg["publishers"] !== null
                  ) {
                    let list = msg["publishers"]
                    for (let f in list) {
                      let id = list[f]["id"]
                      let display = list[f]["display"]
                      newRemoteFeed(id, display)
                    }
                  }
                } else if (event === "destroyed") {
                  // do nothing
                } else if (event === "event") {
                  if (msg["publishers"]) {
                    let list = msg["publishers"]
                    for (let f in list) {
                      let id = list[f]["id"]
                      let display = list[f]["display"]
                      newRemoteFeed(id, display)
                    }
                  } else if (msg["leaving"]) {
                    var leaving = msg["leaving"]
                    let numLeaving = parseInt(leaving)
                    if (remoteList?.hasOwnProperty(numLeaving)) {
                      console.log("Removing someone")
                      let remoteListCopy: any = Object.assign({}, remoteList)
                      delete remoteListCopy[numLeaving]
                      //delete remoteList[numLeaving] = undefined;
                      setRemoteList(remoteListCopy)
                      //this.state.remoteListPluginHandle[numLeaving].detach();
                      const remoteListPluginHandleCopy: any = Object.assign(
                        {},
                        remoteListPluginHandle
                      )
                      delete remoteListPluginHandleCopy.numLeaving
                      setRemoteListPluginHandle(remoteListPluginHandle)
                    }
                  } else if (msg["unpublished"]) {
                    var unpublished = msg["unpublished"]
                    if (unpublished === "ok") {
                      sfutest?.hangup()
                      return
                    }
                    let numLeaving = parseInt(msg["unpublished"])
                    if (remoteList?.hasOwnProperty(numLeaving)) {
                      //delete this.state.remoteList.numLeaving
                      //this.setState({remoteList: this.state.remoteList})
                      //this.state.remoteListPluginHandle[numLeaving].detach();
                      //delete this.state.remoteListPluginHandle.numLeaving
                      //const remoteList = this.state.remoteList;
                      //remoteList[numLeaving] = undefined;
                      let remoteListCopy: any = Object.assign({}, remoteList)
                      delete remoteListCopy[numLeaving]
                      setRemoteList(remoteListCopy)
                      //this.state.remoteListPluginHandle[numLeaving].detach();
                      const remoteListPluginHandleCopy: any = Object.assign(
                        {},
                        remoteListPluginHandle
                      )
                      delete remoteListPluginHandleCopy.numLeaving
                      setRemoteListPluginHandle(remoteListPluginHandleCopy)
                    }
                  } else if (
                    msg["error"] !== undefined &&
                    msg["error"] !== null
                  ) {
                    // TODO: add errors
                  }
                }
              }
              if (jsep !== undefined && jsep !== null) {
                sfutest?.handleRemoteJsep({ jsep: jsep })
              }
            },
            onlocalstream: (stream: any) => {
              console.log("Your local stream has arrived:")
              console.log(stream)
              //this.videoSrc.current.srcObject = stream;
              setLocalStream(stream)
              // setVideoSrc(Math.floor(Math.random() * 1000))
              setStatus("ready")
              setInfo("Please enter or create room ID")
            },
            // onremotestream: (stream) => {}, TODO
            oncleanup: () => {
              //mystream = null;
            },
          })
        },
        error: (error: Error) => {
          console.error("  Janus Error", error)
        },
        destroyed: () => {
          alert("  Success for End Call ")
          setPublished(false)
        },
      })
    )
  }

  useEffect(() => janusStart(), [])

  // const switchVideoType = () => sfutest.changeLocalCamera()

  const toggleAudioMute = () => {
    let muted = sfutest?.isAudioMuted()
    if (muted) {
      sfutest?.unmuteAudio()
      setAudioMute(false)
    } else {
      sfutest?.muteAudio()
      setAudioMute(true)
    }
  }

  const toggleVideoMute = () => {
    let muted = sfutest?.isVideoMuted()
    if (muted) {
      sfutest?.unmuteVideo()
      setVideoMute(false)
    } else {
      sfutest?.muteVideo()
      setVideoMute(true)
    }
  }

  // const endCall = () => janus.destroy()

  const videoList = Object.keys(remoteList).map(key => {
    return <Video key={key} srcObject={remoteList[key]} muted={false} />
  })
  return (
    <div>
      <TopNavbar />
      <div id="videoGrid">
        <Video srcObject={localStream} muted={true} />
        {videoList}
      </div>
      <BottomNavbar
        toggleVideoMute={toggleVideoMute}
        toggleAudioMute={toggleAudioMute}
      />
    </div>
  )
}
