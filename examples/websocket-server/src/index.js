const WebSocket = require("ws");
const RpcExtensionWebSockets =
  require("@sap-devx/webview-rpc/out.ext/rpc-extension-ws").RpcExtensionWebSockets;
const InquirerGuiBackend = require("./inquirerGuiBackend");

class InquirerGuiWebSocketServer {
  init() {
    // web socket server
    const wss = new WebSocket.Server({ port: 8081 }, () => {
      console.log("Started websocket server on port 8081");
    });

    wss.on("listening", () => {
      console.log("Websocket server is listening on port 8081");
    });

    wss.on("error", (error) => {
      console.error(error);
    });

    wss.on("connection", (ws) => {
      console.log("new ws connection");
      const consoleLog = (msg, ...args) => {
        console.log(msg, args);
      };
      const noopLog = () => {};
      const warningLogger = {
        fatal: consoleLog,
        error: consoleLog,
        warn: consoleLog,
        info: noopLog,
        debug: noopLog,
        trace: noopLog,
        getChildLogger: () => {
          return warningLogger;
        },
      };
      this.rpc = new RpcExtensionWebSockets(ws, warningLogger);
      this.inquirerGui = new InquirerGuiBackend(this.rpc);
    });
  }
}

const wsServer = new InquirerGuiWebSocketServer();
wsServer.init();
