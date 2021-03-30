import io from "socket.io-client";
const socket = io(`http://${import.meta.env.VITE_SOCKET_HOST}:8080`);

export const useSocket = () => socket;
