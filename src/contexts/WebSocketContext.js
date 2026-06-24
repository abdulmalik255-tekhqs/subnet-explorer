import React, { createContext, useContext, useEffect } from "react";
import { socketUrl } from "../app.config";
import ReconnectingWebSocket from "reconnecting-websocket";
import { useDispatch } from "react-redux";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const ws = new ReconnectingWebSocket(socketUrl);

    ws.onopen = () => {
      dispatch.blocks.getUnconfirmedAndBallotedBlocks();
      dispatch.transactions.getUnconfirmedTransactions();
      dispatch.transactions.getBallotedTransactions();
    };

    ws.onmessage = (event) => {
      try {
        const parsedMessage = JSON.parse(event?.data);
        const { topic, message } = parsedMessage;
        switch (topic) {
          case "blocks":
            dispatch.blocks.setUnconfimedBlocks(message);
            break;
          case "unconfirmed-transactions":
            dispatch.transactions.addUnconfirmedTransaction(
              message?.TransferObj
            );
            break;
          case "balloted-transactions":
            dispatch.transactions.moveToBallotedTransactions(message);
            break;
          case "balloted-transaction-removed":
            dispatch.transactions.removeBallotedTransaction(message);
            break;

          default:
            console.log("Unknown topic:", topic);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WebSocketContext.Provider value={null}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
