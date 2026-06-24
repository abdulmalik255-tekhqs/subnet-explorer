import React, { useState, useEffect } from "react";
import { bryt } from "../http";

const useBlocks = () => {
  const [blockHeight, setBlockHeight] = useState(0);
  const [lastBlockFetched, setLastBlockFetched] = useState(0);

  const handleGetBlock = async () => {
    try {
      let prevHeight = lastBlockFetched;
      const res = await bryt.getBlockHeight();
      const height = res.result.height;
      for (let i = prevHeight + 1; i <= height; i++) {
        try {
          const res = await bryt.getBlockByBLockNumber(i.toString());
        } catch (err) {
          console.log("Error at " + i);
        }
      }
    } catch (error) {
      console.error("Error fetching block height:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleGetBlock();
    }, 5000);

    // Clear the interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  return { blockHeight, lastBlockFetched };
};

export default useBlocks;
