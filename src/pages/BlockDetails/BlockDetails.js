import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlockTabs from "../../components/BlockTabs/BlockTabs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import BlockOverviewDetail from "./blockOverviewDetail";
import BlockTransaction from "./blockTransaction";
import BlockWithdrawals from "./blockWithdrawals";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const BlockDetails = () => {
  const blockNumber = useParams().id;
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");

  return (
    <div className="flex-grow bg-blocks px-20 py-8 pt-5 pb-5 md:pb-[174px]">
      <BlockTabs
        activeTab={tab}
        onChange={(val) => {
          if (val === "transactions") {
            navigate(`/block/${blockNumber}/transactions`, {
              state: { blockNumber },
            });
            return;
          }
          // if (val === "withdrawals") {
          //   // navigate to withdrawals route if you have one, or just set tab
          //   navigate(`/block/${blockNumber}/withdrawals`);
          //   setTab(val);
          //   return;
          // }
          setTab(val);
        }}
      />
      {tab === "overview" ? (
        <BlockOverviewDetail />
      ) : tab === "transactions" ? (
        <BlockTransaction />
      ) : (
        <BlockWithdrawals />
      )}
    </div>
  );
};

export default BlockDetails;
