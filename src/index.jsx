import React from "react";
import ReactDom from 'react-dom'
import App from "./App";
import memoryUtils from "./utils/memoryUtils";
import storageUtils from "./utils/storageUtils";
const user = storageUtils.getUSer()
memoryUtils.user = user
ReactDom.render(<App/>,document.getElementById('root'))
