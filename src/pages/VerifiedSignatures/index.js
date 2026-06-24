import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import ASSETS from "../../assets";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import Pagination from "../../components/Pagination/Pagination";
import RowsPerPageDropdown from "../../components/Pagination/PageSelector";
import { ITEMS_PER_PAGE } from "../../app.config";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const VerifiedSignatures = () => {
  const dispatch = useDispatch();
  const {
    pages,
    verfiedSignatures,
    // tokenHeight
  } = useSelector((state) => state.tokens);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ITEMS_PER_PAGE);
  const handleRowsChange = (rows) => {
    setLimit(rows);
  };
  useEffect(() => {
    const lastID = verfiedSignatures?.[verfiedSignatures.length - 1]?.id;
    dispatch.tokens.getNFTMintWithPagination({ page, limit, lastID });

    // eslint-disable-next-line
  }, [page, limit]);

  return (
    <>
      <div className="pt-8 px-20">
        <p className="inline-flex text-[16px] w-full text-bryt-primary-main font-semibold gap-3 border-b border-b-bryt-primary-main pb-4">
          Verified Signatures
        </p>
      </div>
      <div className="px-20 py-8">
        {/* table section */}
        {/* table */}
        <div className="bg-white  border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3">
          <div className="flex items-center justify-between py-5 px-[17px]">
            <div className="flex items-center gap-2">
              <img src={ASSETS.arrowDownList} alt="" />
              <p className="text-[14.5px]">
                Latest {0} from a total of{" "}
                <span className="text-bryt-primary-main">{0}</span> Verified
                Signatures
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-[6px] border border-bryt-grey-200 h-[29px] px-[10px] rounded-md cursor-not-allowed">
                <img src={ASSETS.download} alt="" />
                <p className="text-[12.5px]"> Download Page Data</p>
              </div>
              <div className="flex items-center gap-[6px] border border-bryt-grey-200 h-[29px] px-[10px] rounded-md cursor-not-allowed">
                <img src={ASSETS.cone} alt="" />
                <img src={ASSETS.arrowDown} alt="" />
              </div>
            </div>
          </div>
          <div className="w-full overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bryt-primary-main h-[38px] [&_td]:px-4">
                  <td className="text-[11.5px] font-bold text-white">
                    Creator
                  </td>
                  <td className="text-[11.5px] font-bold text-white">
                    Transactions count
                  </td>
                  <td className="text-[11.5px] font-bold text-white">
                    Block Hash
                  </td>
                  <td className="text-[11.5px] font-bold text-white">
                    Validator
                  </td>
                  <td className="text-[11.5px] font-bold text-white">
                    Block Reward
                  </td>
                  <td className="text-[11.5px] font-bold text-white">Age</td>
                </tr>
              </thead>
              <tbody>
                {verfiedSignatures?.length > 0 ? (
                  verfiedSignatures.map((txn, index) => (
                    <tr key={index} className="h-[38px] [&_td]:px-4">
                      <td>{/* icon or something */}</td>
                      <td>{txn.parentHash}</td>
                      <td>{txn.block}</td>
                      <td>{txn.from}</td>
                      <td>{txn.to}</td>
                      <td>{txn.value}</td>
                      <td>{dayjs(txn.timestamp).fromNow()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      No Verified Signatures Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {verfiedSignatures && verfiedSignatures.length > 0 && pages > 0 && (
          <div className="flex items-center justify-between py-5 px-[17px]">
            <RowsPerPageDropdown onChange={handleRowsChange} />
            <Pagination pages={pages} page={page} setPage={setPage} />
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

export default VerifiedSignatures;
