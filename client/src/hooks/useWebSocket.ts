import { useEffect, useRef, useState } from "react";

interface WebSocketMessage {
  type: string;
  action?: string;
  data: any;
}

interface UseWebSocketProps {
  onMessage?: (data: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export function useWebSocket({
  onMessage,
  onOpen,
  onClose,
  onError,
}: UseWebSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function connect() {
      // Close any existing socket connection
      if (socketRef.current) {
        socketRef.current.close();
      }

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const socket = new WebSocket(wsUrl);

      socketRef.current = socket;

      socket.addEventListener("open", () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        if (onOpen) onOpen();
      });

      socket.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onMessage) onMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      });

      socket.addEventListener("close", () => {
        console.log("WebSocket disconnected, reconnecting...");
        setIsConnected(false);
        if (onClose) onClose();
        
        // Attempt to reconnect after a delay
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 2000);
      });

      socket.addEventListener("error", (error) => {
        console.error("WebSocket error:", error);
        if (onError) onError(error);
      });

      return socket;
    }

    const socket = connect();

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.close();
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [onMessage, onOpen, onClose, onError]);

  // Method to send messages to the server if needed
  const sendMessage = (data: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not connected, cannot send message");
    }
  };

  return {
    isConnected,
    sendMessage,
  };
}
