import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import useAuthStore from "../stores/useAuthStore";
import useNotificationsStore from "../stores/useNotificationsStore";
import Cookies from "js-cookie";

interface SSEContextType {
  isConnected: boolean;
  reconnect: () => void;
}

const SSEContext = createContext<SSEContextType>({
  isConnected: false,
  reconnect: () => {},
});

interface SSEProviderProps {
  children: ReactNode;
}

export const SSEProvider = ({ children }: SSEProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [eventSource] = useState<EventSource | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuthStore();
  const addNotification = useNotificationsStore(
    (state) => state.addNotification,
  );

  const connect = useCallback(() => {
    if (!user?.user_id) {
      console.log("SSE: No user ID, skipping connection");
      return null;
    }

    const token = Cookies.get("token");
    if (!token) {
      console.log("SSE: No auth token, skipping connection");
      return null;
    }

    // Close existing connection if any
    if (eventSource) {
      eventSource.close();
    }

    // Create SSE connection with auth token in query params
    // Note: EventSource doesn't support custom headers, so we pass token as query param
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
    const sseUrl = `${baseUrl}/api/notifications/stream`;

    console.log("SSE: Connecting to", sseUrl);

    // Create a custom EventSource-like connection using fetch for auth headers
    const controller = new AbortController();

    fetch(sseUrl, {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`SSE connection failed: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("SSE: No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        setIsConnected(true);
        setRetryCount(0);
        console.log("SSE: Connected successfully");

        const readStream = () => {
          reader
            .read()
            .then(({ done, value }) => {
              if (done) {
                console.log("SSE: Stream ended");
                setIsConnected(false);
                handleReconnect();
                return;
              }

              buffer += decoder.decode(value, { stream: true });

              // Process complete events (events end with double newline)
              const events = buffer.split("\n\n");
              buffer = events.pop() || ""; // Keep incomplete event in buffer

              events.forEach((eventText) => {
                if (!eventText.trim()) return;

                const lines = eventText.split("\n");
                let eventType = "message";
                let data = "";

                lines.forEach((line) => {
                  if (line.startsWith("event: ")) {
                    eventType = line.slice(7);
                  } else if (line.startsWith("data: ")) {
                    data = line.slice(6);
                  }
                });

                if (eventType === "notification" && data) {
                  try {
                    const notification = JSON.parse(data);
                    console.log("SSE: Received notification:", notification);
                    addNotification(notification);
                  } catch (e) {
                    console.error("SSE: Failed to parse notification:", e);
                  }
                } else if (eventType === "connected") {
                  console.log("SSE: Connection confirmed:", data);
                }
              });

              // Continue reading
              readStream();
            })
            .catch((error) => {
              if (error.name !== "AbortError") {
                console.error("SSE: Read error:", error);
                setIsConnected(false);
                handleReconnect();
              }
            });
        };

        readStream();
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("SSE: Connection error:", error);
          setIsConnected(false);
          handleReconnect();
        }
      });

    return controller;
  }, [user?.user_id, addNotification]);

  const handleReconnect = useCallback(() => {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s
    const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
    console.log(`SSE: Reconnecting in ${delay}ms (attempt ${retryCount + 1})`);

    setTimeout(() => {
      setRetryCount((prev) => prev + 1);
      connect();
    }, delay);
  }, [retryCount, connect]);

  const reconnect = useCallback(() => {
    setRetryCount(0);
    connect();
  }, [connect]);

  useEffect(() => {
    const controller = connect();

    return () => {
      if (controller) {
        controller.abort();
      }
      if (eventSource) {
        eventSource.close();
      }
      setIsConnected(false);
    };
  }, [user?.user_id]); // Reconnect when user changes

  return (
    <SSEContext.Provider value={{ isConnected, reconnect }}>
      {children}
    </SSEContext.Provider>
  );
};

export const useSSE = () => {
  const context = useContext(SSEContext);
  if (context === undefined) {
    throw new Error("useSSE must be used within a SSEProvider");
  }
  return context;
};

export default SSEContext;
