import React, { useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TransactionsTabs from "../../components/TransactionTabs";

dayjs.extend(relativeTime);

const EventLogs = () => {
  const { id: txHash } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { transactionLogs, loading } = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    if (txHash) {
      dispatch.transactions.getTransactionLogs(txHash);
    }
  }, [txHash, dispatch]);

  return (
    <>
      <div className="flex-grow bg-blocks px-20 py-8">
        <TransactionsTabs
          activeTab={"logs"}
          onChange={(val) => {
            if (val === "overview") {
              navigate(`/tx/${txHash}`, {
                state: { txHash },
              });
              return;
            }
            if (val === "internal") {
              navigate(`/tx/${txHash}/internal`, {
                state: { txHash },
              });
              return;
            }
            if (val === "state") {
              navigate(`/tx/${txHash}/state`);
              return;
            }
          }}
        />
        <div className="bg-white px-[9px] py-5 border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3">
          {loading ? (
            <p className="text-[13px] text-bryt-grey-700">Loading logs…</p>
          ) : transactionLogs?.length === 0 ? (
            <p className="text-[13px] text-bryt-grey-700">
              No logs were emitted for this transaction.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {transactionLogs?.map((log, idx) => {
                // const logTime = dayjs(Number(log?.timestamp));
                // const displayTime = logTime.isValid()
                //   ? `${logTime.fromNow()} (${logTime.format(
                //     "MMM DD, YYYY HH:mm:ss A"
                //   )})`
                //   : "—";

                return (
                  <div
                    key={`${log?.id}-${log?.log_index}`}
                    className="border border-bryt-grey-200 rounded-[12px] p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap gap-4 items-start">
                      <div className="w-auto h-auto rounded-full bg-bryt-grey-100 border border-bryt-grey-200 grid place-items-center text-[13px] font-semibold text-bryt-primary-main p-3">
                        {log?.block_number}
                      </div>
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[12px] uppercase text-bryt-grey-600">
                            Address
                          </span>
                          <p className="text-[13px] font-semibold break-all">
                            {log?.address}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[12px] uppercase text-bryt-grey-600">
                            Name
                          </span>
                          <p className="text-[13px] text-bryt-primary-main font-semibold break-all">
                            {log?.event_name || "Unknown Event"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[12px] uppercase text-bryt-grey-600 mb-2">
                            Topics
                          </p>
                          <div className="flex flex-col gap-2">
                            {Array.isArray(log?.topics) && log.topics.length > 0
                              ? log.topics.map((topic, index) => (
                                  <div
                                    key={`${log?.id}-topic-${index}`}
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
                        </div>
                        <div>
                          <p className="text-[12px] uppercase text-bryt-grey-600 mb-1">
                            Data
                          </p>
                          <p className="text-[12.5px] break-all">
                            {log?.data || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default EventLogs;
