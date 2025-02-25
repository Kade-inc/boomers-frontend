import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import useNotificationsStore from "../../stores/useNotificationsStore";
// import useNotificationsStore from "../stores/useNotificationsStore"; // your store or state updater

let socket: Socket;

const serverUrl = 'http://localhost:5001'
const useRealtimeNotifications = (userId: string) => {
    
  useEffect(() => {
    // Connect to your Socket.IO server
    socket = io(serverUrl);

    // Once connected, join the room for this user
    socket.on("connect", () => {
      socket.emit("join", userId);
    });

    // Listen for new notifications
    socket.on("newNotification", (notification) => {
        console.log("WHAT: ", notification)
      // For example, add it to your notifications store or trigger a refetch
      useNotificationsStore.getState().addNotification(notification);
      // Alternatively, you can trigger a toast notification or update local state
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);
};

export default useRealtimeNotifications;
