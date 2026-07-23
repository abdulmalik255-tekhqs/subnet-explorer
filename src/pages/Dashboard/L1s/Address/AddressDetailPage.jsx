import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../../DashboardComponent/Navbar";
import AddressHeader from "./AddressHeader";
import AddressStats from "./AddressStats";
import AddressOverviewTab from "./AddressOverviewTab";
import AddressContractTab from "./AddressContractTab";
import AddressFirstTransactions from "./AddressFirstTransactions";
import AddressTransactionsSection from "./AddressTransactionsSection";

const TABS_BASE = ["Overview"];

export default function AddressDetailPage() {
  const { chainId, address } = useParams();
  const dispatch = useDispatch();
  const { orbitAddress, orbitAddressLoading, addressBalance } = useSelector(
    (s) => s.orbit,
  );
  const [tab, setTab] = useState("Overview");

  useEffect(() => {
    if (chainId && address) {
      dispatch.orbit.handleGetOrbitAddress({ chainId, address });
    }
    if (address) {
      dispatch.orbit.handleGetAddressBalance({ chainId, address });
    }
  }, [dispatch, chainId, address]);

  const acct = orbitAddress;
  const isContract = !!acct?.is_contract;
  const tabs = isContract ? [...TABS_BASE, "Contract"] : TABS_BASE;

  return (
    <div className="min-h-screen bg-[#060B15] text-white -m-5">
      <Navbar />

      <div className="px-6 py-5 space-y-4 max-w-6xl mx-auto">
        <AddressHeader
          chainId={chainId}
          address={address}
          isContract={isContract}
        />

        {orbitAddressLoading && !acct ? (
          <div className="h-64 flex items-center justify-center text-gray-600 text-sm">
            Loading address…
          </div>
        ) : !acct ? (
          <div className="h-64 flex items-center justify-center text-gray-600 text-sm">
            Address not found
          </div>
        ) : (
          <>
            <AddressStats acct={acct} addressBalance={addressBalance} />

            {/* Tabs */}
            <div className="flex items-center gap-0 border-b border-gray-800/60">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    tab === t
                      ? "text-white border-blue-500"
                      : "text-gray-500 border-transparent hover:text-gray-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === "Overview" ? (
              <AddressOverviewTab
                acct={acct}
                chainId={chainId}
                isContract={isContract}
              />
            ) : (
              <AddressContractTab acct={acct} />
            )}

            <AddressFirstTransactions chainId={chainId} address={address} />

            <AddressTransactionsSection chainId={chainId} address={address} />
          </>
        )}
      </div>
    </div>
  );
}
