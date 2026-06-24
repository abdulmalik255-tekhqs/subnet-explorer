import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { ITEMS_PER_PAGE } from "../../app.config";
import ASSETS from "../../assets";
import RowsPerPageDropdown from "../../components/Pagination/PageSelector";
import Pagination from "../../components/Pagination/Pagination";
import { downloadAsCSV, shortenString } from "../../utils";
import { Link } from "react-router-dom";
import ClipBoardComponet from "../../components/Pagination/ClipBoard";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const AccountEvents = ({ address = "" }) => {
  const dispatch = useDispatch();
  const {
    transactionHeightAddress,
    AddressPages,
    transactions,
    contractEvents,
  } = useSelector((state) => state.transactions);
  const lastID = contractEvents?.[contractEvents.length - 1]?.number;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ITEMS_PER_PAGE);

  const handleRowsChange = (rows) => {
    setLimit(rows);
  };
  useEffect(() => {
    const lowerCaseAddress = address.toLowerCase();
    dispatch.transactions.getTransactionByAddressEventsWithPagination({
      address: lowerCaseAddress,
      page,
      limit,
      lastID,
    });

    // eslint-disable-next-line
  }, [address, limit, page]);
  useEffect(() => {
    dispatch.transactions.setAddressTransactionHeight(null);
  }, [address, dispatch]);
  const normalizeEventNames = (eventName) => {
    if (!eventName) return [];

    return (
      eventName
        .split(",")
        .map((e) => e.trim())
        // remove topic hashes (0x + 64 hex chars)
        .filter((e) => !/^0x[a-fA-F0-9]{64}$/.test(e))
        // remove empty strings
        .filter(Boolean)
    );
  };
  return (
    <div className="bg-white  border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3">
      <div className="flex items-center justify-between py-5 px-[17px]">
        <div className="flex items-center gap-2">
          <img src={ASSETS.arrowDownList} alt="" />
          <p className="text-[14.5px]">
            Latest {contractEvents?.slice(0, 10).length} from a total of{" "}
            <span className="text-bryt-primary-main">
              {transactionHeightAddress ? transactionHeightAddress : 0}
            </span>{" "}
            events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            onClick={() =>
              downloadAsCSV(contractEvents, `contract_events_${page}.csv`)
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
                Transaction Hash
              </td>
              <td className="text-[11.5px] font-bold text-white">Block</td>
              <td className="text-[11.5px] font-bold text-white">Method</td>
              <td className="text-[11.5px] font-bold text-white">Logs</td>
              <td className="text-[11.5px] font-bold text-white">Age</td>
            </tr>
          </thead>
          <tbody>
            {contractEvents?.map((block) => (
              <tr
                key={block.block_number}
                className="h-12 [&_td]:px-4 [&_td]:border-b [&_td]:border-b-bryt-grey-200
                [&:last-of-type_td]:border-b-0 cursor-pointer"
              >
                <td className="text-[12.5px] text-bryt-primary-main overflow-hidden text-ellipsis hover:underline hover:text-blue-600">
                  <div className="flex gap-2">
                    <Link to={`/tx/${block?.transaction_hash}`}>
                      <p className="flex gap-2 text-[12.5px] text-bryt-primary-main  overflow-hidden text-ellipsis hover:underline hover:text-blue-600">
                        {shortenString(block?.transaction_hash)}
                      </p>
                    </Link>
                    <ClipBoardComponet
                      val={block?.transaction_hash}
                      message={"Transaction hash copied!"}
                    />
                  </div>
                </td>
                <td className="text-[12.5px] text-bryt-primary-main hover:underline hover:text-blue-600">
                  <Link to={`/block/${block?.block_number}`}>
                    {block?.block_number}
                  </Link>
                </td>
                <td className="text-[12.5px] text-bryt-primary-main">
                  {normalizeEventNames(block?.event_name).length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {normalizeEventNames(block?.event_name).map(
                        (event, index) => (
                          <span
                            key={index}
                            className="px-2 py-[2px] text-[11px] font-medium
                     border border-bryt-primary-main/30
                     bg-bryt-primary-main/5
                     rounded-full"
                          >
                            {event}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <span
                      className="px-2 py-[2px] text-[11px] font-medium
                     border border-bryt-primary-main/30
                     bg-bryt-primary-main/5
                     rounded-full"
                    >
                      {shortenString(block?.event_name)}
                    </span>
                  )}
                </td>
                <td className="text-[12px]">
                  <div className="flex flex-col gap-2 py-4">
                    {Array.isArray(block?.topics) && block.topics.length > 0
                      ? block.topics.map((topic, index) => (
                          <div
                            key={`${block?.id}-topic-${index}`}
                            className="flex items-start gap-2"
                          >
                            <span className="text-[11px] font-semibold text-bryt-grey-600">
                              {index}
                            </span>
                            <span className="text-[12px] break-all">
                              {topic}
                            </span>
                          </div>
                        ))
                      : "—"}
                  </div>
                </td>
                <td className="text-[12.5px] text-bryt-primary-main">
                  {dayjs(Number(block?.timestamp)).fromNow()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions && transactions.length > 0 && AddressPages > 0 && (
          <div className="flex flex-col lg:flex-row lg:items-center justify-start lg:justify-between py-5 px-[17px]">
            <RowsPerPageDropdown onChange={handleRowsChange} />
            <Pagination pages={AddressPages} page={page} setPage={setPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountEvents;
