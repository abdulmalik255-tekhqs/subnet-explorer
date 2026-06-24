import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { formatEther } from "viem";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import ASSETS from "../../assets";
import relativeTime from "dayjs/plugin/relativeTime";
import Pagination from "../../components/Pagination/Pagination";
import RowsPerPageDropdown from "../../components/Pagination/PageSelector";
import { ITEMS_PER_PAGE } from "../../app.config";
import { downloadAsCSV, shortenString } from "../../utils";
import ClipBoardComponet from "../../components/Pagination/ClipBoard";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const TopAccounts = () => {
  const dispatch = useDispatch();
  const { AddressPages, tokenHeight, verfiedContracts } = useSelector(
    (state) => state.tokens
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ITEMS_PER_PAGE);
  const handleRowsChange = (rows) => {
    setLimit(rows);
  };
  useEffect(() => {
    const lastID = verfiedContracts?.[verfiedContracts.length - 1]?.balance;
    dispatch.tokens.getTopAccounts({ page, limit, lastID });

    // eslint-disable-next-line
  }, [page, limit]);
  return (
    <>
      <div className="pt-8 px-20">
        <p className="inline-flex text-[16px] w-full text-bryt-primary-main font-semibold gap-3 border-b border-b-bryt-primary-main pb-4">
          Top Accounts
        </p>
      </div>
      <div className="px-20 py-8">
        <div className="bg-white  border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3">
          <div className="flex items-center justify-between py-5 px-[17px]">
            <div className="flex items-center gap-2">
              <img src={ASSETS.arrowDownList} alt="" />
              <p className="text-[14.5px]">
                Latest {verfiedContracts?.length || 0} from a total of{" "}
                <span className="text-bryt-primary-main">
                  {tokenHeight ? tokenHeight : 0}
                </span>{" "}
                Top Accounts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                onClick={() =>
                  downloadAsCSV(
                    verfiedContracts,
                    `top_accounts_page_${page}.csv`
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
                  <td className="text-[11.5px] font-bold text-white">Rank</td>
                  <td className="text-[11.5px] font-bold text-white">
                    Address
                  </td>
                  {/* <td className="text-[12.5px] font-bold text-white">Name Tag</td>
                <td className="text-[12.5px] font-bold text-white">Contract</td> */}
                  <td className="text-[11.5px] font-bold text-white">
                    Balance
                  </td>
                  <td className="text-[11.5px] font-bold text-white">
                    Txn Count
                  </td>
                </tr>
              </thead>
              <tbody>
                {verfiedContracts?.map((contract, index) => (
                  <tr
                    key={contract?.id}
                    className="h-12 [&_td]:px-4 [&_td]:border-b [&_td]:border-b-bryt-grey-200
                                              [&:last-of-type_td]:border-b-0 cursor-pointer"
                  >
                    <td className="text-[14.5px] text-bryt-primary-main">
                      {index + 1}
                    </td>
                    <td className="text-[12.5px] text-bryt-primary-main">
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
                    {/* <td className="text-[14.5px] text-bryt-primary-main">
                    {contract?.contract_name ?? "N/A"}
                  </td>
                  <td className="text-[14.5px] text-bryt-primary-main ">
                    {contract?.is_contract !== undefined
                      ? contract.is_contract
                        ? "Yes"
                        : "No"
                      : "N/A"}
                  </td> */}
                    <td className="text-[12.5px] text-bryt-primary-main capitalize">
                      {contract?.balance
                        ? `${Number(
                            formatEther(contract?.balance)
                          ).toLocaleString()} RYT`
                        : "0"}
                    </td>
                    <td className="text-[12.5px] text-bryt-primary-main ">
                      {contract?.total_transactions}
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

export default TopAccounts;
