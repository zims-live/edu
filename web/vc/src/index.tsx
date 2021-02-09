import React from "react"
import ReactDOM from "react-dom"
import VideoSection from "./components/VideoSection"
import "./index.css"

function Main() {
  return (
    <div>
      <VideoSection />
    </div>
  )
}

ReactDOM.render(<Main />, document.getElementById("root"))
