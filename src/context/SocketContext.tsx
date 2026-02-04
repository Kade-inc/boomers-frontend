import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import useAuthStore from "../stores/useAuthStore";
import * as Sentry from "@sentry/react";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.user_id) {
      const serverUrl =
        import.meta.env.VITE_SERVER_URL || "http://localhost:5001";
      const newSocket = io(serverUrl, {
        transports: ["websocket", "polling"],
      });

      newSocket.on("connect", () => {
        setIsConnected(true);
        // Join user's personal room for direct notifications
        newSocket.emit("joinUser", { userId: user.user_id });
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        Sentry.captureException(error, {
          extra: { context: "Socket connection error" },
        });
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [user?.user_id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export default SocketContext;
