import {useState} from 'react';
import './App.css';
import {StartProxy, StopProxy} from "../wailsjs/go/main/App";
import {BrowserOpenURL, EventsOn} from "../wailsjs/runtime";
import Logo from "./assets/logo.svg"

function App() {
    const [resultText, setResultText] = useState("DISCONNECTED");
    const [proxyState, setProxyState] = useState("stopped");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [isStop, setIsStop] = useState(false);

    EventsOn("statusUpdate", function (typ: string, text: string) {
        switch (typ) {
            case "loading":
                setProxyState("loading");
                if (text == "stopping") {
                    text = "DISCONNECTING...";
                } else {
                    text = "CONNECTING...";
                }
                break
            case "error":
                setProxyState("error");
                setButtonDisabled(false);
                break
            case "ready":
                setIsStop(true);
                setButtonDisabled(false);
                setProxyState("ready");
                text = "CONNECTED";
                break
            case "stopped":
                setIsStop(false);
                setButtonDisabled(false);
                setProxyState("stopped");
                text = "DISCONNECTED";
                break
        }

        setResultText(text);
    })

    async function action() {
        if (buttonDisabled) {
            return
        }

        setButtonDisabled(true);
        if (!isStop) {
            await StartProxy();
        } else {
            await StopProxy();
        }
    }

    function toButtonState(state: string) {
        if (state === 'ready')
            return 'state-connected';
        if (state === 'loading')
            return 'state-connecting';
        return 'state-not-connected';
    }

    return (
        <div className={"app "+ (proxyState === 'ready' ? "map-active" : "map-inactive")}>
            <div className="logo-container">
                <img src={Logo} className="logo" alt=""/>
            </div>
            <div className="content-container">
                <div className="ip-container">
                    <label>Proxy IP</label>
                    <label className="big-text">127.0.0.1:8080</label>
                </div>
                <div className="button-container">
                    <button className={"button "+toButtonState(proxyState)} onClick={action}/>
                </div>
                <label className="big-text status">{resultText}</label>
            </div>
            <div className="author-container">
                <label>Developed by <a onClick={() => {BrowserOpenURL("https://github.com/xssnick/Tonutils-Proxy")}}>TonUtils</a></label>
                <label className="small-text">v1.5.0</label>
            </div>
        </div>
    )
}

export default App
