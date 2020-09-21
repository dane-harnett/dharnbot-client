import io from "socket.io-client";
const socket = io(`http://${process.env.REACT_APP_SOCKET_HOST}:8080`);

export const useSocket = () => socket;
