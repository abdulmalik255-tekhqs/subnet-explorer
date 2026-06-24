import React, { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import TransactionsTabs from "../../components/TransactionTabs";
import TransactionOverviewDetails from "./TransactionOverviewDetails";
import InternalTransaction from "./InternalTransaction";
import EventLogs from "./EventLogs";
import State from "./State";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const TransactionDetails = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");

  const txHash = useParams().id;

  return (
    <>
      <div className="flex-grow bg-blocks px-20 py-8 py-5">
        <TransactionsTabs
          activeTab={tab}
          onChange={(val) => {
            if (val === "internal") {
              navigate(`/tx/${txHash}/internal`, {
                state: { txHash },
              });
              return;
            }
            if (val === "logs") {
              // navigate to logs route if you have one, or just set tab
              navigate(`/tx/${txHash}/eventlog`);
              setTab(val);
              return;
            }
            if (val === "state") {
              // navigate to state route if you have one, or just set tab
              navigate(`/tx/${txHash}/state`);
              setTab(val);
              return;
            }
            setTab(val);
          }}
        />
        {tab === "overview" ? (
          <TransactionOverviewDetails />
        ) : tab === "internal" ? (
          <InternalTransaction />
        ) : tab === "logs" ? (
          <EventLogs />
        ) : tab === "state" ? (
          <State />
        ) : (
          <TransactionOverviewDetails />
        )}
      </div>
    </>
  );
};

export default TransactionDetails;
