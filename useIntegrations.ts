const WEBSOCKET_TIMEOUT = 10000; // 10 seconds
@@ -20,0 +22,5 @@
function handleWebSocketTimeout(socket) {
  setTimeout(() => {
    if (socket.readyState === WebSocket.CONNECTING) {
      socket.close();
    }
  }, WEBSOCKET_TIMEOUT);
}
@@ -50,0 +57,1 @@
  handleWebSocketTimeout(socket);
