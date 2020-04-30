import React, {useEffect, useState} from "react";
import socketIOClient from "socket.io-client";
import ReactDOM from "react-dom";

import {ControlledEditor} from "@monaco-editor/react";

const ENDPOINT = 'http://localhost:8080'
const BAD_WORD = "eval";
const WARNING_MESSAGE = " <- hey man, what's this?";

function App() {
    const [response, setResponse] = useState("");

    const handleEditorChange = (ev, value) => {
        setResponse(
            value.includes(BAD_WORD) && !value.includes(WARNING_MESSAGE)
            ? value.replace(BAD_WORD, BAD_WORD + WARNING_MESSAGE)
            : value.includes(WARNING_MESSAGE) && !value.includes(BAD_WORD)
              ? value.replace(WARNING_MESSAGE, "")
              : value
        );
    };

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on("FromAPI", data => {
            setResponse(data);
        });
    }, []);

    return (
        <div>
            <ControlledEditor
                height="90vh"
                value={response}
                onChange={handleEditorChange}
                language="javascript"
            />
            <p>
                It's <time dateTime={response}>{response}</time>
            </p>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
