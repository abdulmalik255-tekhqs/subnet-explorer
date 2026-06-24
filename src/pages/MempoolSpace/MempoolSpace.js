import React from "react";
import BlockCarousel from "./Components/BlocksCarousel";
import UnconfirmedTransactions from "./Components/UnconfirmedTransactions";
import BallotedTransactions from "./Components/BallotedTransactions";

const MempoolPage = () => {
  return (
    <div className="flex-grow">
      <BlockCarousel />
      <div className="grid grid-cols-1 md:grid-cols-2 px-20 gap-4 my-5">
        <UnconfirmedTransactions />
        <BallotedTransactions />
      </div>
    </div>
  );
};

export default MempoolPage;
