import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../DashboardComponent/Navbar";
// import ChainPulse from "../DashboardComponent/ChainPulse";
import L1Stats from "./L1Stats";
import PrimaryNetworkPinned from "./PrimaryNetworkPinned";
import RegisteredL1sTable from "./RegisteredL1sTable";
import L1DetailPanel from "./L1DetailPanel";

const L1Component = () => {
  const { chainID } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedChain = useSelector((s) => s.orbit.selectedDirectoryChain);
  const detailPanelRef = useRef(null);
  const hasSeededFromUrl = useRef(false);

  const closeSelectedChain = () => {
    dispatch.orbit.setSelectedDirectoryChain(null);
    navigate("/orbit");
  };

  const handleToggleChain = (chain, type) => {
    if (
      selectedChain?.chain?.chain_id === chain?.chain_id &&
      selectedChain?.type === type
    ) {
      closeSelectedChain();
      return;
    }

    dispatch.orbit.setSelectedDirectoryChain({ chain, type });
    navigate(`/orbit/${chain.chain_id}`);
  };

  useEffect(() => {
    if (selectedChain && detailPanelRef.current) {
      detailPanelRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedChain]);
  useEffect(() => {
    // Seed the selection from a direct deep-link only once on mount; never
    // reseed after a close, otherwise closing would immediately reopen it.
    if (chainID && !selectedChain && !hasSeededFromUrl.current) {
      hasSeededFromUrl.current = true;
      dispatch.orbit.setSelectedDirectoryChain({ chainID, type: "orbit" });
    }
  }, [chainID, dispatch, selectedChain]);
  return (
    <div className="min-h-screen bg-[#060B15] text-white -m-5">
      <Navbar />
      {/* <ChainPulse /> */}

      <div className="">
        <div className="flex items-center gap-2 text-xs text-gray-500 border-b border-gray-800 w-full max-w-full px-6 py-[8px]">
          <span className="text-blue-500">/</span>
          <span>Orbit directory</span>
        </div>
        <div className="flex flex-col items-start gap-2 mt-2 px-6 w-full">
          <h1 className="text-2xl font-bold text-white">Orbit Directory</h1>
          <L1Stats />
          <PrimaryNetworkPinned
            selectedChain={selectedChain}
            onToggleChain={handleToggleChain}
          />
          <RegisteredL1sTable
            selectedChain={selectedChain}
            onToggleChain={handleToggleChain}
          />
          {selectedChain && (
            <div ref={detailPanelRef} className="w-full">
              <L1DetailPanel
                chain={selectedChain.chain}
                onClose={closeSelectedChain}
                type={selectedChain.type}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default L1Component;
