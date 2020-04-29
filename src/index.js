import React, { useState } from "react";
import ReactDOM from "react-dom";

import { ControlledEditor } from "@monaco-editor/react";

const BAD_WORD = "eval";
const WORNING_MESSAGE = " <- hey man, what's this?";

function App() {
  const [value, setValue] = useState("// write javascript code here \n");

  const handleEditorChange = (ev, value) => {
    setValue(
      value.includes(BAD_WORD) && !value.includes(WORNING_MESSAGE)
        ? value.replace(BAD_WORD, BAD_WORD + WORNING_MESSAGE)
        : value.includes(WORNING_MESSAGE) && !value.includes(BAD_WORD)
        ? value.replace(WORNING_MESSAGE, "")
        : value
    );
  };

  return (
    <ControlledEditor
      height="90vh"
      value={value}
      onChange={handleEditorChange}
      language="javascript"
    />
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
