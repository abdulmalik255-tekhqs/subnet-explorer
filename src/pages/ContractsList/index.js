import React, { useEffect, useState } from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { BiSolidCalendarAlt, BiSolidBookmarkAltPlus } from "react-icons/bi";
import { MdVerified } from "react-icons/md";
import { RiContractFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import Pagination from "../../components/Pagination/Pagination";
import RowsPerPageDropdown from "../../components/Pagination/PageSelector";
import { ITEMS_PER_PAGE } from "../../app.config";
import ASSETS from "../../assets";
import { downloadAsCSV, shortenString } from "../../utils";
import ClipBoardComponet from "../../components/Pagination/ClipBoard";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const ContractList = () => {
  const dispatch = useDispatch();
  const {
    AddressPages,
    tokenHeight,
    verfiedContracts,
    deployedContractsInfromation,
  } = useSelector((state) => state.tokens);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ITEMS_PER_PAGE);
  const handleRowsChange = (rows) => {
    setLimit(rows);
  };
  useEffect(() => {
    const lastID = verfiedContracts?.[verfiedContracts.length - 1]?.number;
    dispatch.tokens.getVerifiedContract({ page, limit, lastID });

    // eslint-disable-next-line
  }, [page, limit]);

  return (
    <>
      {" "}
      <div className="pt-8 px-20">
        <p className="inline-flex text-[16px] w-full text-bryt-primary-main font-semibold gap-3 border-b border-b-bryt-primary-main pb-4">
          Verified Contracts
        </p>
      </div>
      <div className="px-20 py-8">
        <div className="flex items-center gap-5 mb-6">
          <div className="border border-bryt-grey-200 rounded-[16px] p-5 shadow-md hover:bg-hover flex-1">
            <div className="flex items-start gap-3">
              <BiSolidCalendarAlt
                size={20}
                className="text-bryt-primary-main"
              />
              <div className="flex flex-col">
                <h2 className="text-[14px] text-bryt-primary-main font-semibold">
                  CONTRACTS DEPLOYED (TOTAL)
                </h2>
                <p className="text-[18px] font-semibold text-bryt-grey-700">
                  {deployedContractsInfromation?.totalDeployedContracts || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="border border-bryt-grey-200 rounded-[16px] p-5 shadow-md hover:bg-hover flex-1">
            <div className="flex items-start gap-3">
              <RiContractFill size={20} className="text-bryt-primary-main" />
              <div className="flex flex-col">
                <h2 className="text-[14px] text-bryt-primary-main font-semibold">
                  CONTRACTS DEPLOYED (24H)
                </h2>
                <p className="text-[18px] font-semibold text-bryt-grey-700">
                  {deployedContractsInfromation?.totalDeployedContractsLast24Hours ||
                    0}
                </p>
              </div>
            </div>
          </div>
          <div className="border border-bryt-grey-200 rounded-[16px] p-5 shadow-md hover:bg-hover flex-1">
            <div className="flex items-start gap-3">
              <BiSolidBookmarkAltPlus
                size={20}
                className="text-bryt-primary-main"
              />
              <div className="flex flex-col">
                <h2 className="text-[14px] text-bryt-primary-main font-semibold">
                  CONTRACTS VERIFIED (TOTAL)
                </h2>
                <p className="text-[18px] font-semibold text-bryt-grey-700">
                  {deployedContractsInfromation?.totalVerifiedContracts || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="border border-bryt-grey-200 rounded-[16px] p-5 shadow-md hover:bg-hover flex-1">
            <div className="flex items-start gap-3">
              <MdVerified size={20} className="text-bryt-primary-main" />
              <div className="flex flex-col">
                <h2 className="text-[14px] text-bryt-primary-main font-semibold">
                  CONTRACTS VERIFIED (24H)
                </h2>
                <p className="text-[18px] font-semibold text-bryt-grey-700">
                  {deployedContractsInfromation?.totalVerifiedContractsLast24Hours ||
                    0}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white  border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3">
          <div className="flex items-center justify-between py-5 px-[17px]">
            <div className="flex items-center gap-2">
              <img src={ASSETS.arrowDownList} alt="" />
              <p className="text-[14.5px]">
                Latest {verfiedContracts?.length || 0} from a total of{" "}
                <span className="text-bryt-primary-main">
                  {tokenHeight ? tokenHeight : 0}
                </span>{" "}
                Verified Contracts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                onClick={() =>
                  downloadAsCSV(
                    verfiedContracts,
                    `verified_contracts_page_${page}.csv`
                  )
                }
                className="flex items-center gap-[6px] border border-bryt-grey-200 h-[29px] px-[10px] rounded-md cursor-pointer"
              >
                <img src={ASSETS.download} alt="" />
                <p className="text-[12.5px]"> Download Page Data</p>
              </div>
              {/* <div className="flex items-center gap-[6px] border border-bryt-grey-200 h-[29px] px-[10px] rounded-md cursor-not-allowed">
              <img src={ASSETS.cone} alt="" />
              <img src={ASSETS.arrowDown} alt="" />
            </div> */}
            </div>
          </div>
          <div className="w-full overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bryt-primary-main h-[38px] [&_td]:px-4">
                  <td className="text-[11.5px] font-bold text-white">
                    Txn Hash
                  </td>
                  <td className="text-[11.5px] font-bold text-white">
                    Address
                  </td>
                  <td className="text-[11.5px] font-bold text-white">Name</td>
                  <td className="text-[11.5px] font-bold text-white">
                    Version
                  </td>
                  <td className="text-[11.5px] font-bold text-white">Txns</td>
                  <td className="text-[11.5px] font-bold text-white">
                    Settings
                  </td>
                  <td className="text-[11.5px] font-bold text-white">
                    Verified
                  </td>
                  <td className="text-[11.5px] font-bold text-white">
                    License
                  </td>
                </tr>
              </thead>
              <tbody>
                {verfiedContracts?.map((contract) => (
                  <tr
                    key={contract?.id}
                    className="h-12 [&_td]:px-4 [&_td]:border-b [&_td]:border-b-bryt-grey-200
                              [&:last-of-type_td]:border-b-0 cursor-pointer"
                  >
                    <td className="text-[14.5px] text-bryt-primary-main">
                      <div className="flex gap-3 items-center">
                        <Link to={`/tx/${contract?.creation_tx_hash}`}>
                          <p className="text-[14.5px] text-bryt-primary-main overflow-hidden text-ellipsis">
                            {shortenString(contract?.creation_tx_hash)}
                          </p>
                        </Link>
                        <ClipBoardComponet
                          val={contract?.creation_tx_hash}
                          message={"Transaction Hash copied!"}
                        />
                      </div>
                    </td>
                    <td className="text-[14.5px] text-bryt-primary-main">
                      <div className="flex gap-3 items-center">
                        <Link to={`/address/${contract?.id}`}>
                          <p
                            className="text-[12.5px] px-2 rounded-md flex justify-center items-center
                   border-2 border-transparent 
                   hover:bg-bryt-grey-200
                   hover:border-bryt-primary-main 
                   hover:border-dotted"
                          >
                            {shortenString(contract?.id)}
                          </p>
                        </Link>
                        <ClipBoardComponet
                          val={contract?.id}
                          message={"Address copied!"}
                        />
                      </div>
                    </td>
                    <td className="text-[14.5px] text-bryt-primary-main">
                      {contract?.contract_name}
                    </td>
                    <td className="text-[14.5px] text-bryt-primary-main capitalize">
                      {contract?.compiler_version}
                    </td>
                    <td className="text-[14.5px] text-bryt-primary-main capitalize">
                      {contract?.compiler_version}
                    </td>
                    <td className="text-[14.5px] text-bryt-primary-main capitalize">
                      {String(contract?.optimization_used) === "true" && (
                        <div className="relative flex items-center">
                          <AiFillThunderbolt className="text-yellow-500 w-5 h-5 cursor-pointer" />
                          <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            Optimization Enabled
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="text-[14.5px] text-bryt-primary-main ">
                      {dayjs(Number(contract?.timestamp)).format("DD/MM/YYYY")}
                    </td>
                    <td className="text-[14.5px] text-bryt-primary-main ">
                      {contract?.license || "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {verfiedContracts &&
          verfiedContracts.length > 0 &&
          AddressPages > 0 && (
            <div className="flex items-center justify-between py-5 px-[17px]">
              <RowsPerPageDropdown onChange={handleRowsChange} />
              <Pagination pages={AddressPages} page={page} setPage={setPage} />
            </div>
          )}
        <div className="flex items-start gap-[14.5px] mt-[14px]">
          <img src={ASSETS.bulb} alt="" />
          <p className="text-[11.5px] text-bryt-grey-700">
            Blocks are batches of transactions linked via cryptographic hashes.
            Any tampering of a block would invalidate all following blocks as
            all subsequent hashes would change. Learn more about this page in
            our <span className="text-bryt-primary-main">Knowledge Base</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default ContractList;
