import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Icon, IconButton, Toolbar, AppBar } from '@material-ui/core';
import Janus from './janus.js';

let server = "/janusbase/janus"
let myid = null
let opaqueId = "videoroomtest-"+Janus.randomString(12);
let janus;
let sfutest = null;
let started = false;
let myusername = Math.floor((Math.random() * 1000));
let roomId = 1234;
let mystream = null;

let feeds = []

var bitrateTimer = [];

Janus.init({debug: "all", callback: function() {
    if(started)
        return;
    started = true;
}});


function TopNavbar() {
    return (
        <AppBar position='static' id='top-app-bar'>
            <Toolbar>
                <IconButton color='inherit'><Icon>perm_media</Icon></IconButton>
                <IconButton color='inherit'><Icon>assignment</Icon></IconButton>
                <IconButton color='inherit'><Icon>today</Icon></IconButton>
                <IconButton color='inherit'><Icon>description</Icon></IconButton>
                <IconButton color='inherit'><Icon>settings</Icon></IconButton>
            </Toolbar>
        </AppBar>
    );
}

class BottomNavbar extends React.Component {
    constructor(props) {
        super(props);
        //this.state = {
            //isMute: false
        //};
    }

    //toggleMuteOn() {
        //this.props.toggleAudioMute();
    //}

    //toggleMuteOff() {
        //this.props.toggleAudioMute();
    //}

    //toggleVideoOn() {
        //alert('video on');
    //}

    //toggleVideoOff() {
        //alert('video off');
    //}

    //toggleScreenShareOn() {
        //alert('screen sharing');
    //}

    //toggleScreenShareOff() {
        //alert('screen sharing off');
    //}

    //createRoom() {
        //alert('room has been created');
    //}

    render() {
        return (
            <div>
                <AppBar position='static' id='bottom-app-bar'>
                    <Toolbar>
                        <IconButton color='inherit' onClick={this.createRoom}><Icon>create</Icon></IconButton>
                        <ToggleButton toggleOn={this.props.toggleAudioMute} toggleOff={this.props.toggleAudioMute} color='inherit' toggledIcon='mic_off' regularIcon='mic' />
                        <ToggleButton toggleOn={this.props.toggleVideoMute} toggleOff={this.props.toggleVideoMute} color='inherit' toggledIcon='videocam_off' regularIcon='videocam' />
                        <ToggleButton toggleOn={this.toggleScreenShareOn} toggleOff={this.toggleScreenShareOff} color='inherit' toggledIcon='screen_share' regularIcon='stop_screen_share' />
                    </Toolbar>
                </AppBar>
            </div>
        );
    };
}

class ToggleButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggled: false
        };
    }

    handleClick() {
        this.setState((state) => ({
            toggled: !state.toggled
        }));

        if (!this.state.toggled) {
            this.props.toggleOn();
        } else {
            this.props.toggleOff();
        }
    }

    render() {
        const show = this.state.toggled ? <Icon>{this.props.toggledIcon}</Icon> : <Icon>{this.props.regularIcon}</Icon>;
        return <IconButton color={this.props.color} onClick={() => this.handleClick()}>{show}</IconButton>;
    }
}

class Video extends React.Component {
    constructor(props) {
        super(props);
        this.videoSrc = React.createRef();
    }

    componentDidMount() {
    }

    render() {
        if (this.videoSrc.current) {
            this.videoSrc.current.srcObject = this.props.srcObject;
        }

        return(
            <video ref={this.videoSrc} autoPlay muted={this.props.muted}/>
        );
    }
}

class VideoSection extends React.Component {
    constructor(props) {
        super(props);

        this.toggleAudioMute = this.toggleAudioMute.bind(this)
        this.toggleVideoMute = this.toggleVideoMute.bind(this)

        this.state = { 
            localstream: new MediaStream(),
            info: 'Initializing',
            status: 'init',
            roomID: '',
            isFront: true,
            selfViewSrc: null,
            selfViewSrcKey: null,
            remoteList: {},
            remoteListPluginHandle: {},
            textRoomConnected: false,
            textRoomData: [],
            textRoomValue: '',
            publish: false,
            speaker: false,
            audioMute: false,
            videoMute: false,
            visible: false
        };
    }

    publishOwnFeed(useAudio) {
        if(!this.state.publish){
            this.setState({ publish: true });
            sfutest.createOffer(
                {
                    media: { audioRecv: false, videoRecv: false, audioSend: useAudio, videoSend: true},
                    success: (jsep) => {
                        //Janus.log("Got: " + jsep);
                        var publish = { "request": "configure", "audio": useAudio, "video": true };
                        //var publish = { request: "configure", audio: useAudio, video: true };
                        sfutest.send({"message": publish, "jsep": jsep});
                    },
                    error: (error) => {
                        alert("WebRTC error:", error);
                        if (useAudio) {
                            this.publishOwnFeed(false);
                        } else {
                        }
                    }
                });
        } else {
            // this.setState({ publish: false });
            // let unpublish = { "request": "unpublish" };
            // sfutest.send({"message": unpublish});
        }
    }

    componentDidMount() {
        this.janusStart();
    }

    janusStart() {
        this.setState({visible: true});
        janus = new Janus(
            {
                server: server,
                success: () => {
                    janus.attach(
                        {
                            plugin: "janus.plugin.videoroom",
                            opaqueId: opaqueId,
                            success: (pluginHandle) => {
                                sfutest = pluginHandle;
                                Janus.log("Plugin attached! (" + sfutest.getPlugin() + ", id=" + sfutest.getId() + ")");
                                Janus.log("  -- This is a publisher/manager");
                                let register = { "request": "join", "room": roomId, "ptype": "publisher", "display": myusername.toString() };
                                sfutest.send({"message": register});
                            },
                            error: (error) => {
                                alert("  -- Error attaching plugin...", error);
                            },
                            consentDialog: (on) => {
                            },
                            mediaState: (medium, on) => {
                            },
                            webrtcState: (on) => {
                                console.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                            },
                            onmessage: (msg, jsep) => {
                                // console.log(msg)
                                var event = msg["videoroom"];
                                if(event != undefined && event != null) {
                                    if(event === "joined") {
                                        myid = msg["id"];
                                        this.publishOwnFeed(true);
                                        this.setState({visible: false});
                                        if (msg["publishers"] !== undefined && msg["publishers"] !== null) {
                                            var list = msg["publishers"];
                                            for(var f in list) {
                                                var id = list[f]["id"];
                                                var display = list[f]["display"];
                                                this.newRemoteFeed(id, display)
                                            }
                                        }
                                    } else if(event === "destroyed") {
                                    } else if(event === "event") {
                                        if(msg["publishers"]) {
                                            var list = msg["publishers"];
                                            for(var f in list) {
                                                let id = list[f]["id"]
                                                let display = list[f]["display"]
                                                this.newRemoteFeed(id, display)
                                            }
                                        } else if(msg["leaving"]) {
                                            var leaving = msg["leaving"];
                                            var remoteFeed = null;
                                            let numLeaving = parseInt(leaving)
                                            if(this.state.remoteList.hasOwnProperty(numLeaving)){
                                                console.log("Removing someone")
                                                let remoteList = Object.assign({}, this.state.remoteList);
                                                delete remoteList[numLeaving]
                                                //delete remoteList[numLeaving] = undefined;
                                                this.setState({remoteList: remoteList})
                                                //this.state.remoteListPluginHandle[numLeaving].detach();
                                                const remoteListPluginHandle = this.state.remoteListPluginHandle;
                                                delete remoteListPluginHandle.numLeaving;
                                                this.setState({remoteListPluginHandle: remoteListPluginHandle})
                                            }
                                        } else if(msg["unpublished"]) {
                                            var unpublished = msg["unpublished"];
                                            if(unpublished === 'ok') {
                                                sfutest.hangup();
                                                return;
                                            }
                                            let numLeaving = parseInt(msg["unpublished"])
                                            if(this.state.remoteList.hasOwnProperty(numLeaving)){
                                                //delete this.state.remoteList.numLeaving
                                                //this.setState({remoteList: this.state.remoteList})
                                                //this.state.remoteListPluginHandle[numLeaving].detach();
                                                //delete this.state.remoteListPluginHandle.numLeaving
                                                //const remoteList = this.state.remoteList;
                                                //remoteList[numLeaving] = undefined;
                                                let remoteList = Object.assign({}, this.state.remoteList);
                                                delete remoteList[numLeaving]
                                                this.setState({remoteList: remoteList})
                                                //this.state.remoteListPluginHandle[numLeaving].detach();
                                                const remoteListPluginHandle = this.state.remoteListPluginHandle;
                                                delete remoteListPluginHandle.numLeaving;
                                                this.setState({remoteListPluginHandle: remoteListPluginHandle})
                                            }
                                        } else if(msg["error"] !== undefined && msg["error"] !== null) {
                                        }
                                    }
                                }
                                if(jsep !== undefined && jsep !== null) {
                                    sfutest.handleRemoteJsep({jsep: jsep});
                                }
                            },
                            onlocalstream: (stream) => {
                                console.log("Your local stream has arrived:")
                                console.log(stream)
                                //this.videoSrc.current.srcObject = stream;
                                this.setState({localstream: stream});
                                this.setState({videoSrc: Math.floor(Math.random() * 1000)});
                                this.setState({status: 'ready', info: 'Please enter or create room ID'});
                            },
                            onremotestream: (stream) => {
                            },
                            oncleanup: () => {
                                mystream = null;
                            }
                        });
                },
                error: (error) => {
                    alert("  Janus Error", error);
                },
                destroyed: () => {
                    alert("  Success for End Call ");
                    this.setState({ publish: false });
                }
            })
    }

    switchVideoType() {
        sfutest.changeLocalCamera();
    }

    toggleAudioMute() {
        let muted = sfutest.isAudioMuted();
        if (muted){
            sfutest.unmuteAudio();
            this.setState({ audioMute: false });
        } else {
            sfutest.muteAudio();
            this.setState({ audioMute: true });
        }
    }

    toggleVideoMute() {
        let muted = sfutest.isVideoMuted();
        if(muted){
            this.setState({ videoMute: false });
            sfutest.unmuteVideo();
        }else{
            this.setState({ videoMute: true });
            sfutest.muteVideo();
        }
    }

    endCall() {
        janus.destroy()
    }


    newRemoteFeed(id, display) {
        let remoteFeed = null;
        janus.attach(
            {
                plugin: "janus.plugin.videoroom",
                success: (pluginHandle) => {
                    remoteFeed = pluginHandle;
                    let listen = { "request": "join", "room": roomId, "ptype": "listener", "feed": id };
                    remoteFeed.send({"message": listen});
                },
                error: (error) => {
                    alert("  -- Error attaching plugin...", error);
                },
                onmessage: (msg, jsep) => {
                    let event = msg["videoroom"];
                    if(event !== undefined && event != null) {
                        if(event === "attached") {
                            // Subscriber created and attached
                        }
                    }
                    if(jsep !== undefined && jsep !== null) {
                        remoteFeed.createAnswer(
                            {
                                jsep: jsep,
                                media: { audioSend: false, videoSend: false },
                                success: (jsep) => {
                                    var body = { "request": "start", "room": roomId };
                                    remoteFeed.send({"message": body, "jsep": jsep});
                                },
                                error: (error) => {
                                    alert("WebRTC error:", error)
                                } 
                            });
                    }
                },
                webrtcState: (on) => {
                },
                onlocalstream: (stream) => {
                },
                onremotestream: (stream) => {
                    this.setState({info: 'One peer join!'});
                    console.log("Peer" + id + " stream:")
                    console.log(stream.constructor.name)
                    const remoteList = this.state.remoteList;
                    const remoteListPluginHandle = this.state.remoteListPluginHandle;
                    remoteList[id] = stream;
                    remoteListPluginHandle[id] = remoteFeed
                    this.setState({ remoteList: remoteList, remoteListPluginHandle: remoteListPluginHandle });
                },
                oncleanup: () => {
                    if(remoteFeed.spinner !== undefined && remoteFeed.spinner !== null)
                        remoteFeed.spinner.stop();
                    remoteFeed.spinner = null;
                    if(bitrateTimer[remoteFeed.rfindex] !== null && bitrateTimer[remoteFeed.rfindex] !== null)
                        clearInterval(bitrateTimer[remoteFeed.rfindex]);
                    bitrateTimer[remoteFeed.rfindex] = null;
                }
            });
    }
    render() {
        const remoteList = this.state.remoteList;
        const videoList = Object.keys(remoteList).map((key) => {
            return <Video key={key} srcObject={remoteList[key]} muted={false} />
        });
        return( 
            <div>
                <TopNavbar />
                <div id="videoGrid">
                    <Video srcObject={this.state.localstream} muted={true} />
                    {videoList}
                </div>
                <BottomNavbar toggleVideoMute={this.toggleVideoMute} toggleAudioMute={this.toggleAudioMute} />
            </div>
        );
    }
}

function Main() {
    return (
        <div>
            <VideoSection />
        </div>
    );
}

ReactDOM.render(
    <Main />,
    document.getElementById('root')
);

