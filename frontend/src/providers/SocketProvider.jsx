import { io } from "socket.io-client";
import SocketContext from "../contexts/SocketContext";
import { useEffect, useRef } from "react";

const SocketProvider = ({ children }) => {
  const socketClientRef = useRef(
    io(process.env.REACT_APP_BE_URL, {
      autoConnect: false,
    }),
  );

  useEffect(() => {
    const socketClient = socketClientRef.current;
    const token = localStorage.getItem("token");
    if (token) {
      socketClient.auth = { token: token };
      socketClient.connect();
      return () => {
        socketClient.disconnect();
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={socketClientRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
