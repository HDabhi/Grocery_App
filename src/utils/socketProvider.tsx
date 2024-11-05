import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import SockJS from 'sockjs-client';
import Stomp, { Client, Message } from 'stompjs';

interface SocketContextType {
  isConnected: boolean;
  stompClient: Client | null;
  messages: {};
  productMessages: {};
  cartMessages: {}; // New state for cart topic messages
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
  userId: string;
  eKartID: string; // Added cartID prop
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, userId, eKartID }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState({});
  const [productMessages, setProductMessages] = useState({});
  const [cartMessages, setCartMessages] = useState({}); // New state for cart messages
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;
  const retryDelay = (attempt: number) => Math.min(1000 * 2 ** attempt, 30000); // Exponential backoff

  console.log("userId : " + userId);
  console.log("cartID : " + eKartID); // Log cartID for debugging

  useEffect(() => {
    // Function to establish a new connection
    const connectSocket = () => {
      if (!userId || !eKartID) return; // Skip connection if either userId or cartID is not provided

      const socket = new SockJS('https://fresh.farmsanta.com/ecommerce/ws');
      const client: Client = Stomp.over(socket);

      client.connect(
        {},
        (frame: string) => {
          console.log('Connected: ' + frame);
          setIsConnected(true);
          setStompClient(client);
          setRetryCount(0); // Reset retry count on successful connection

          // Subscribe to the orders topic
          client.subscribe(`/topic/user/${userId}/orders`, (message: Message) => {
            console.log('Message body (orders): ' + message?.body);
            setMessages(message?.body);
          });

          // Subscribe to the product topic
          client.subscribe(`/topic/user/${eKartID}/product`, (message: Message) => {
            console.log('Message body (product): ' + message?.body);
            setProductMessages(message?.body);
          });

          // // Subscribe to the cart topic based on cartID
          // client.subscribe(`/topic/cart/${cartID}/updates`, (message: Message) => {
          //   console.log('Message body (cart): ' + message?.body);
          //   setCartMessages(message?.body);
          // });
        },
        (error: any) => {
          console.error('Connection error: ', error);
          setIsConnected(false);
          handleReconnect(); // Trigger reconnection
        }
      );
    };

    const handleReconnect = () => {
      if (retryCount < maxRetries) {
        const delay = retryDelay(retryCount);
        console.log(`Attempting to reconnect... Retry #${retryCount + 1} in ${delay / 1000} seconds`);
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          connectSocket();
        }, delay);
      } else {
        console.error('Max retries reached. Could not reconnect.');
      }
    };

    // Initial socket connection
    connectSocket();

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log('Disconnected on unmount or userId/cartID change');
          setIsConnected(false);
        });
      }
    };
  }, [userId, eKartID]);

  return (
    <SocketContext.Provider value={{ isConnected, stompClient, messages, productMessages, cartMessages }}>
      {children}
    </SocketContext.Provider>
  );
};
