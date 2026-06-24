/* global BigInt */
import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useWriteContract } from "wagmi";
// import { switchNetwork } from "wagmi/actions";
// import { ethers } from "ethers";
// import { parseEther } from "viem";
import ASSETS from "../../assets";
import { brytNetwork } from "../../wagmi";
import { shortenString } from "../../utils";
import { useSelector } from "react-redux";
import ClipBoardComponet from "../Pagination/ClipBoard";
// import { publicClient } from "../../publicClient";
// import { waitForTransactionReceipt } from "viem";

const ContractAddressWrite = ({ addressInfo }) => {
  const { writeMethods } = useSelector((state) => state.transactions);
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const { writeContractAsync } = useWriteContract();

  const [txStatus, setTxStatus] = useState({});
  const [loadingFn, setLoadingFn] = useState(null);
  const [openPanels, setOpenPanels] = useState([]);
  const [inputsState, setInputsState] = useState({});

  const handleClickConnect = async () => {
    if (isConnected) return disconnect();
    if (connectors[0]) {
      try {
        await connect({ connector: connectors[0], chainId: brytNetwork.id });
      } catch (err) {
        console.error("Connect error:", err);
      }
    }
  };

  const togglePanel = (index) => {
    setOpenPanels((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleInputChange = (fnName, inputName, value) => {
    setInputsState((prev) => ({
      ...prev,
      [fnName]: { ...prev[fnName], [inputName]: value },
    }));
  };

  const handleWrite = async (fn, index) => {
    if (!isConnected) {
      setTxStatus((prev) => ({ ...prev, [fn.name]: "Connect wallet first!" }));
      return;
    }

    setLoadingFn(fn.name);

    try {
      // 1️⃣ Check network and switch if needed
      // if (
      //   window.ethereum &&
      //   window.ethereum.chainId !== brytNetwork.id.toString()
      // ) {
      //   try {
      //     await switchNetwork(brytNetwork.id);
      //   } catch (err) {
      //     setTxStatus((prev) => ({
      //       ...prev,
      //       [fn.name]: "Please switch your wallet to the correct network",
      //     }));
      //     return;
      //   }
      // }

      // 2️⃣ Gather inputs from state and convert uints
      const args = (fn.inputs || []).map((input) => {
        const value = inputsState?.[fn.name]?.[input.name];
        if (input.type.startsWith("uint") && value) {
          return BigInt(value);
        }
        return value;
      });

      // 3️⃣ Execute contract write
      const hash = await writeContractAsync({
        address: addressInfo.id,
        abi: addressInfo.abi,
        functionName: fn.name,
        args,
      });

      setTxStatus((prev) => ({
        ...prev,
        [fn.name]: (
          <span className="flex items-center gap-2">
            <span>Transaction sent:</span>

            <span className="font-mono truncate max-w-[220px]">{hash}</span>

            <ClipBoardComponet val={hash} message="Transaction hash copied!" />
          </span>
        ),
      }));

      // 4️⃣ Wait for confirmation using Viem
      // const receipt = await waitForTransactionReceipt(publicClient, { hash });

      // setTxStatus((prev) => ({
      //   ...prev,
      //   [fn.name]: `Transaction confirmed! Block: ${receipt.blockNumber}`,
      // }));

      // Keep panel open
      setOpenPanels((prev) => (prev.includes(index) ? prev : [...prev, index]));
    } catch (err) {
      console.error(err);
      setTxStatus((prev) => ({
        ...prev,
        [fn.name]: `Error: ${err?.message || err}`,
      }));
    } finally {
      setLoadingFn(null);
    }
  };

  return (
    <>
      {/* Wallet Connect / Status */}
      <div
        onClick={handleClickConnect}
        className="w-[22%] gap-2 hover:bg-hover border border-bryt-grey-200 rounded-[12px] p-4 shadow-md flex justify-center items-center cursor-pointer"
      >
        <img src={ASSETS.newLogo} alt="no-icon" width={70} height={40} />
        <h1>
          {address
            ? `Connected - Web3 ${shortenString(address)}`
            : "Connect to Web3"}
        </h1>
      </div>

      {/* Write Methods List */}
      <div className="space-y-4 mt-5">
        {writeMethods.map((fn, index) => {
          const isOpen = openPanels.includes(index);

          return (
            <div
              key={fn.name}
              className="border border-bryt-grey-200 rounded-[12px] p-4 shadow-md"
            >
              {/* Header */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => togglePanel(index)}
              >
                <h3 className="font-[400]">
                  {index + 1}. {fn.name}
                </h3>
                <span className="text-gray-600">{isOpen ? "▲" : "▼"}</span>
              </div>

              {/* Body */}
              {isOpen && (
                <div className="mt-3 space-y-2">
                  {(fn.inputs || []).length > 0 ? (
                    fn.inputs.map((input) => (
                      <input
                        key={input.name}
                        value={inputsState?.[fn.name]?.[input.name] || ""}
                        onChange={(e) =>
                          handleInputChange(fn.name, input.name, e.target.value)
                        }
                        placeholder={`${input.name} (${input.type})`}
                        className="mt-1 w-full px-4 py-2 bg-bryt-grey-200 border border-bryt-grey-200 rounded-md text-blue-500 focus:outline-none focus:border-blue-500"
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No inputs</p>
                  )}

                  <button
                    onClick={() => handleWrite(fn, index)}
                    disabled={loadingFn === fn.name}
                    className={`w-auto p-2 bg-bryt-primary-main hover:bg-blue-700 text-white py-3 rounded-md font-normal transition mt-2 flex items-center justify-center gap-2 ${
                      loadingFn === fn.name
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {loadingFn === fn.name ? "Executing..." : "Execute"}
                  </button>

                  {txStatus[fn.name] && (
                    <p className="mt-2 text-gray-700 whitespace-pre-wrap break-words">
                      {txStatus[fn.name]}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ContractAddressWrite;
