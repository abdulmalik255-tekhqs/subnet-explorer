import React, { useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Info } from "@phosphor-icons/react";
import { commonURL, baseUrl } from "../../app.config";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const VerifyContract = () => {
  const navigate = useNavigate();
  const [contractAddress, setContractAddress] = useState("");
  const [complierVersion, setComplierVersion] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [inputError, setInputError] = useState("");
  const [optimizer, setOptimizer] = useState(false);

  const [runs, setRuns] = useState(200);
  const [loading, setLoading] = useState(false);
  const [license, setLicense] = useState(null);
  const [evmVersion, setEVMversion] = useState(null);
  // const [selectedFile, setSelectedFile] = useState(null);

  // const fileInputRef = useRef(null);

  // const handleFileClick = () => {
  //   fileInputRef.current?.click();
  // };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setSelectedFile(file);
  //   }
  // };
  const validateInput = (value) => {
    const isAddress = /^0x[a-fA-F0-9]{40}$/.test(value);
    return {
      isValid: isAddress,
      type: isAddress ? "address" : null,
    };
  };
  const handleChange = (value) => {
    setContractAddress(value);
    const { isValid } = validateInput(value);
    if (!value) {
      setInputError("");
    } else if (!isValid) {
      setInputError("Please enter a contract address");
    } else {
      setInputError("");
    }
  };
  const handleVerifyContract = async () => {
    const payload = {
      files: sourceCode,
      address: contractAddress.toLocaleLowerCase(),
      compilerVersion: complierVersion, // fix typo too
      optimizer: {
        enabled: optimizer === "Yes" ? true : false,
        runs: Number(runs),
      },
      evmVersion: evmVersion || "null",
      viaIR: false,
      license: license || "null",
      libraries: {},
      constructorArgs: [],
      importRemappings: {},
    };
    try {
      setLoading(true);

      const res = await axios.post(
        `http://18.216.102.37:3300/v1/user/contractVerification`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key":
              "sMDllcMQ0hqEmScetVc7wOqM6mX7YQ5yCSJjgZi1wZhqh4Krrl4grWBu7hMGI8st",
          },
        },
      );
      if (res) {
        toast.success("Contract verification submitted successfully!");
        setLoading(false);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.error(
        "Verification Error:",
        error?.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 flex justify-center flex-col items-center">
      <p className="text-[22px]">Verify & Publish Contract Source Code</p>
      {/* Info Card */}
      <div className="w-1/2 bg-blue-50 border border-blue-200 rounded-[12px] p-4 mt-3 flex items-start gap-3">
        <Info size={20} className="text-blue-500 mt-0.5" />
        <p className="text-sm text-bryt-primary-main">
          For multi-file contracts, ensure your code has been flattened before
          uploading.
        </p>
      </div>
      {/* Contract Address Input */}
      <div className="p-5 w-1/2 bg-white border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3">
        <label className="block text-sm font-medium text-bryt-primary-main mb-1">
          Contract Address
        </label>
        <p>Insert the contract address</p>
        <input
          type="text"
          placeholder="0x"
          value={contractAddress}
          onChange={(e) => handleChange(e.target.value)}
          className={`mt-1 w-full px-4 py-2 bg-bryt-grey-200 border rounded-md 
      ${inputError ? "border-red-500" : "border-bryt-grey-200"} 
      text-blue-500 focus:outline-none`}
        />

        {inputError && (
          <p className="text-red-500 text-xs mt-1">{inputError}</p>
        )}
      </div>

      {/* Conditional Rendering of Verify Contract UI */}
      {validateInput(contractAddress).isValid && !inputError && (
        <div className="bg-white border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3 p-6 w-1/2 max-w-3xl mx-auto">
          {/* Title */}
          <h2 className="text-[14px] font-semibold text-bryt-primary-main mb-2">
            Verify Contract
          </h2>

          {/* Compiler */}
          <div className="flex gap-3">
            <div className="mb-2 flex-1">
              <label className="text-sm text-bryt-primary-main font-medium">
                Compiler Version
              </label>
              <input
                onChange={(e) => setComplierVersion(e.target.value)}
                type="text"
                placeholder="v0.8.30+commit.73712a01"
                className="mt-2 w-full px-4 py-2 bg-bryt-grey-200 border border-bryt-grey-200 rounded-md text-bryt-primary-ligh focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-2 flex-1">
              <label className="text-sm text-bryt-primary-main font-medium">
                EVM Version
              </label>
              <select
                onChange={(e) => setEVMversion(e.target.value || null)}
                className="mt-[7px] w-full px-4 py-[9.5px] bg-bryt-grey-200 border border-bryt-grey-200 
               rounded-md text-bryt-primary-ligh focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">default</option>
                <option value="Shanghai">Shanghai</option>
                <option value="Paris">Paris</option>
                <option value="London">London</option>
                <option value="Berlin">Berlin</option>
                <option value="Istanbul">Istanbul</option>
                <option value="Petersburg">Petersburg</option>
                <option value="Constantinople">Constantinople</option>
                <option value="Byzantium">Byzantium</option>
                <option value="Spurious-Dragon">Spurious Dragon</option>
                <option value="Tangerine-Whistle">Tangerine Whistle</option>
                <option value="Homestead">Homestead</option>
              </select>
            </div>
            <div className="mb-2 flex-1">
              <label className="text-sm text-bryt-primary-main font-medium">
                Runs (Optimizer)
              </label>
              <input
                onChange={(e) => setRuns(e.target.value)}
                type="number"
                placeholder="200"
                className="mt-2 w-full px-4 py-2 bg-bryt-grey-200 border border-bryt-grey-200 rounded-md text-bryt-primary-ligh focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-2 flex-1">
              <label className="text-sm text-bryt-primary-main font-medium">
                Optimization
              </label>
              <select
                onChange={(e) => setOptimizer(e.target.value || null)}
                className="mt-[7px] w-full px-4 py-[9.5px] bg-bryt-grey-200 border border-bryt-grey-200 
               rounded-md text-bryt-primary-ligh focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">Select</option>
                <option value="No">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>
          <div className="mb-2">
            <label className="text-sm text-bryt-primary-main font-medium">
              Select License
            </label>
            <select
              onChange={(e) => setLicense(e.target.value || null)}
              className="mt-[7px] w-full px-4 py-[9.5px] bg-bryt-grey-200 border border-bryt-grey-200 
               rounded-md text-bryt-primary-ligh focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="">Select License</option>
              <option value="None">No License</option>
              <option value="Unlicense">The Unlicense</option>
              <option value="MIT">MIT License</option>
              <option value="mozilla">
                Mozilla Public License 2.0 (MPL-2.0)
              </option>
              <option value="open-software">Open Software License</option>
              <option value="GPL-3.0">GNU GPL 3.0</option>
              <option value="AGPL-3.0">GNU AGPL 3.0</option>
              <option value="Apache-2.0">Apache 2.0</option>
              <option value="business-source-license">
                Business Source License (BSL 1.1)
              </option>
            </select>
          </div>
          <div className="mb-5">
            <label className="text-sm text-bryt-primary-main font-medium">
              Source Code
            </label>
            <textarea
              rows={6}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder="Place source code"
              className="mt-2 w-full px-4 py-2 bg-bryt-grey-200 border border-bryt-grey-200 rounded-md text-bryt-primary-ligh focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Upload Contract Source File */}
          {/* <div className="mb-6">
            <label className="text-sm text-bryt-primary-main font-medium">
              Upload Contract Source File
            </label>

            <div
              className="mt-2 w-full py-10 bg-bryt-grey-200 border-2 border-dashed border-bryt-grey-200 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition"
              onClick={handleFileClick}
            >
              {selectedFile ? (
                <p className="text-blue-500 font-medium">{selectedFile.name}</p>
              ) : (
                <>
                  <p className="text-blue-500 text-sm">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Solidity (.sol), Vyper (.vy)
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              accept=".sol,.vy"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div> */}
          {/* Submit Button */}
          <button
            onClick={() => handleVerifyContract()}
            className="w-full bg-bryt-primary-main hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition"
          >
            {loading ? "Verifying..." : "Verify Contract"}
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyContract;
