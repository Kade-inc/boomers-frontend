import { useEffect, useCallback } from "react";
import { useSocket } from "../../context/SocketContext";
import { ChatMessage } from "../../entities/ChatMessage";

interface UseChatSocketOptions {
  chatId: string | undefined;
  onNewMessage?: (message: ChatMessage) => void;
  onUserTyping?: (userId: string) => void;
  onUserStoppedTyping?: (userId: string) => void;
}

export const useChatSocket = ({
  chatId,
  onNewMessage,
  onUserTyping,
  onUserStoppedTyping,
}: UseChatSocketOptions) => {
  const { socket, isConnected } = useSocket();

  // Join and leave chat room
  useEffect(() => {
    if (!socket || !chatId || !isConnected) return;

    // Join the chat room
    socket.emit("joinChat", { chatId });

    // Listen for new messages
    if (onNewMessage) {
      socket.on("newMessage", onNewMessage);
    }

    // Listen for typing indicators
    if (onUserTyping) {
      socket.on("userTyping", ({ userId }: { userId: string }) => {
        onUserTyping(userId);
      });
    }

    if (onUserStoppedTyping) {
      socket.on("userStoppedTyping", ({ userId }: { userId: string }) => {
        onUserStoppedTyping(userId);
      });
    }

    // Cleanup: leave room and remove listeners
    return () => {
      socket.emit("leaveChat", { chatId });

      if (onNewMessage) {
        socket.off("newMessage", onNewMessage);
      }
      if (onUserTyping) {
        socket.off("userTyping");
      }
      if (onUserStoppedTyping) {
        socket.off("userStoppedTyping");
      }
    };
  }, [
    socket,
    chatId,
    isConnected,
    onNewMessage,
    onUserTyping,
    onUserStoppedTyping,
  ]);

  // Emit typing indicator
  const emitTyping = useCallback(
    (userId: string) => {
      if (socket && chatId && isConnected) {
        socket.emit("typing", { chatId, userId });
      }
    },
    [socket, chatId, isConnected],
  );

  // Emit stop typing indicator
  const emitStopTyping = useCallback(
    (userId: string) => {
      if (socket && chatId && isConnected) {
        socket.emit("stopTyping", { chatId, userId });
      }
    },
    [socket, chatId, isConnected],
  );

  return {
    emitTyping,
    emitStopTyping,
    isConnected,
  };
};

export default useChatSocket;
