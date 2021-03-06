import React, {useEffect, useState} from "react"
import queryString from 'query-string'
import io from 'socket.io-client'
import { ControlledEditor } from "@monaco-editor/react";
import './Chat.css'
import InfoBar from "../Infobar/Infobar";
import Messages from "../Messages/Messages";
import SplitPane, { Pane }  from 'react-split-pane';

let socket

const Chat = ({ location }) => {

    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [message, setMessage] = useState('')
    const [code, setCode] = useState('')
    const [messages, setMessages] = useState([])
    // const ENDPOINT = 'https://live-code-share-server.herokuapp.com'
    const ENDPOINT = 'localhost:5000'

    useEffect(() => {
        //acts like componentDidUpdate and componentDidMount
        const { name, room } = queryString.parse(location.search)
        socket = io(ENDPOINT)

        setRoom(room)
        setName(name)

        socket.emit('join', { name, room }, (error) => {
            if(error) {
                alert(error);
            }
        });
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message])
        })
    }, [messages])

    const sendMessage = (e) => {
        e.preventDefault()
        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    const BAD_WORD = "eval";
    const WARNING_MESSAGE = " <- hey man, what's this?";

    var valueList = []

    // ----------------------------------------------------

    const handleEditorChange = (ev, value) => {
        sendCode(value)
    }

    const sendCode = (value) => {
        socket.emit('sendCode', value, () => {
            console.log("1 value: " + value)
        })
    }

    useEffect(() => {
        socket.once('code', (code) => {
            console.log("3 frontend: " + code.text)
            setCode(code)
        })
    }, [code])

    return (
        <div>
            <SplitPane split="vertical" minSize={50} defaultSize={700}>
                <Pane initialSize="50%" minSize="10%" maxSize="500px" className="">
                <h3>Type your code here</h3>
                <ControlledEditor
                    height="90vh"
                    language="javascript"
                    value={code.text}
                    onChange={handleEditorChange}/>
                </Pane>

                <Pane initialSize="50%" minSize="10%" maxSize="500px" className="">
                <Messages messages={messages} name={name}/>
                <InfoBar room={room}/>
                <h3>Type your messages here</h3>
                <input value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}/>
                </Pane>
            </SplitPane>
        </div>
    )
}

export default Chat
