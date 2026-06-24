import React, { useState } from "react";
import ASSETS from "../../assets";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortenString } from "../../utils";
import { useSelector } from "react-redux";
import { publicClient } from "../../publicClient";
import { brytNetwork } from "../../wagmi";

const ContractAddressRead = ({ addressInfo }) => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const { readMethods } = useSelector((state) => state.transactions);
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});
  const [expanded, setExpanded] = useState({}); // Track open/close state per method

  const handleClickConnect = () => {
    isConnected
      ? disconnect()
      : connect({ connector: connectors[0], chainId: brytNetwork.id });
  };

  const handleToggle = (fnName) => {
    setExpanded((prev) => ({ ...prev, [fnName]: !prev[fnName] }));
  };
  // Recursively convert BigInt to string in an object/array
  const serializeBigInt = (data) => {
    if (typeof data === "bigint") {
      return data.toString();
    } else if (Array.isArray(data)) {
      return data.map(serializeBigInt);
    } else if (data && typeof data === "object") {
      const result = {};
      for (const key in data) {
        result[key] = serializeBigInt(data[key]);
      }
      return result;
    } else {
      return data;
    }
  };

  // const handleRead = async (fn) => {
  //   try {
  //     setLoading((prev) => ({ ...prev, [fn.name]: true }));

  //     // Gather inputs
  //     const inputs = (fn.inputs || []).map((input) => {
  //       const el = document.getElementById(`${fn.name}-${input.name}`);
  //       return el ? el.value : undefined;
  //     });

  //     const result = await publicClient.readContract({
  //       address: addressInfo?.id,
  //       abi: addressInfo?.abi, // full read ABI
  //       functionName: fn.name,
  //       args: inputs,
  //     });

  //     setResults((prev) => ({
  //       ...prev,
  //       [fn.name]: JSON.stringify(result),
  //     }));

  //     // Ensure the box is expanded after query
  //     setExpanded((prev) => ({ ...prev, [fn.name]: true }));
  //     if (result) setLoading((prev) => ({ ...prev, [fn.name]: false }));
  //   } catch (err) {
  //     setResults((prev) => ({
  //       ...prev,
  //       [fn.name]: `Error: ${err.message}`,
  //     }));
  //     setExpanded((prev) => ({ ...prev, [fn.name]: true }));
  //     setLoading((prev) => ({ ...prev, [fn.name]: false }));
  //   }
  // };
  const handleRead = async (fn) => {
    try {
      setLoading((prev) => ({ ...prev, [fn.name]: true }));

      // Gather inputs
      const inputs = (fn.inputs || []).map((input) => {
        const el = document.getElementById(`${fn.name}-${input.name}`);
        return el ? el.value : undefined;
      });

      const result = await publicClient.readContract({
        address: addressInfo?.id,
        abi: addressInfo?.abi,
        functionName: fn.name,
        args: inputs,
      });

      // Serialize BigInt / BigNumber safely
      const serializedResult = serializeBigInt(result);

      setResults((prev) => ({
        ...prev,
        [fn.name]: JSON.stringify(serializedResult, null, 2), // pretty print
      }));

      // Expand the box
      setExpanded((prev) => ({ ...prev, [fn.name]: true }));
    } catch (err) {
      setResults((prev) => ({
        ...prev,
        [fn.name]: `Error: ${err.message}`,
      }));
      setExpanded((prev) => ({ ...prev, [fn.name]: true }));
    } finally {
      setLoading((prev) => ({ ...prev, [fn.name]: false }));
    }
  };

  return (
    <>
      {/* Wallet Connect / Status */}
      {address ? (
        <div className="w-[22%] gap-2 hover:bg-hover border border-bryt-grey-200 rounded-[12px] p-4 shadow-md flex justify-center items-center cursor-pointer">
          <img src={ASSETS.newLogo} alt="no-icon" width={70} height={40} />{" "}
          <h1>Connected - Web3 {shortenString(address)}</h1>
        </div>
      ) : (
        <div
          onClick={handleClickConnect}
          className="w-[22%] gap-2 hover:bg-hover border border-bryt-grey-200 rounded-[12px] p-4 shadow-md flex justify-center items-center cursor-pointer"
        >
          <img src={ASSETS.newLogo} alt="no-icon" width={70} height={40} />{" "}
          <h1>Connect to Web3</h1>
        </div>
      )}

      {/* Read Methods List */}
      <div className="space-y-4 mt-5">
        {readMethods.map((fn, index) => (
          <div
            key={fn.name}
            className="border border-bryt-grey-200 rounded-[12px] shadow-md overflow-hidden"
          >
            {/* Header */}
            <div
              onClick={() => handleToggle(fn.name)}
              className="p-4 cursor-pointer bg-bryt-grey-100 hover:bg-bryt-grey-200 flex justify-between items-center"
            >
              <h3 className="font-[400]">
                {index + 1}. {fn.name}
              </h3>
              <span>{expanded[fn.name] ? "▲" : "▼"}</span>
            </div>

            {/* Expandable content */}
            {expanded[fn.name] && (
              <div className="p-4 space-y-2 bg-white">
                {(fn.inputs || []).map((input) => (
                  <input
                    key={input.name}
                    id={`${fn.name}-${input.name}`}
                    placeholder={`${input.name} (${input.type})`}
                    className="mt-1 w-full px-4 py-2 bg-bryt-grey-200 border border-bryt-grey-200 rounded-md text-blue-500 focus:outline-none focus:border-blue-500"
                  />
                ))}

                <button
                  onClick={() => handleRead(fn)}
                  disabled={loading[fn.name]}
                  className="w-auto p-2 bg-bryt-primary-main hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-md font-normal transition mt-2 flex items-center gap-2"
                >
                  {loading[fn.name] && (
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                  )}
                  {loading[fn.name] ? "Querying..." : "Query"}
                </button>

                {results[fn.name] && (
                  <pre className="mt-2 text-gray-700 whitespace-pre-wrap break-words">
                    Result: {results[fn.name]}
                  </pre>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ContractAddressRead;
