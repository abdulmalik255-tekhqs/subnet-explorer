import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ContractTab from "../../components/Contract";
import ContractAddressCode from "../../components/Contract/code";
import ContractAddressRead from "../../components/Contract/read";
import ContractAddressWrite from "../../components/Contract/write";

const AccountContract = ({ addressInfo }) => {
  const creator = addressInfo?.creator;
  const creationTx = addressInfo?.creation_tx_hash;

  const address = useParams().id;
  const [tab, setTab] = useState("code");
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="text-[14.5px] font-semibold mb-2 md:mb-4 break-all">
          Contract {address}
        </p>
      </div>
      {!addressInfo?.is_contract ? (
        <>
          <div className="bg-white border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3 p-5 space-y-2">
            <p className="text-[13px] text-bryt-grey-700">
              Are you the contract creator?{" "}
              <Link to={`/services/verify-contract`}>
                <span className="text-[14.5px] text-bryt-primary-main underline cursor-pointer">
                  Verify and Publish
                </span>{" "}
              </Link>
              your contract source code today!
            </p>
            <p className="text-[13px] text-bryt-grey-700 break-all">
              This contract was created by{" "}
              <span className="text-[14.5px] text-bryt-primary-main break-all inline-block">
                {creator}
              </span>
            </p>
            <p className="text-[13px] text-bryt-grey-700 break-all">
              Creation Tx Hash:{" "}
              <span className="text-[14.5px] text-bryt-primary-main break-all inline-block">
                {creationTx}
              </span>
            </p>
          </div>
        </>
      ) : (
        <>
          <ContractTab
            activeTab={tab}
            onChange={(val) => {
              setTab(val);
            }}
          />
        </>
      )}
      {tab === "code" ? (
        <ContractAddressCode addressInfo={addressInfo} />
      ) : tab === "read" ? (
        <ContractAddressRead addressInfo={addressInfo} />
      ) : (
        <ContractAddressWrite addressInfo={addressInfo} />
      )}
    </>
  );
};

export default AccountContract;
