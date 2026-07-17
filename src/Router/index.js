import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
// import Home from "../pages/Home/Home";
import BlockDetails from "../pages/BlockDetails/BlockDetails";
import TransactionDetails from "../pages/TransactionDetails/TransactionDetails";
import Accounts from "../pages/Accounts/Accounts";
import Blocks from "../pages/Blocks/Blocks";
import MempoolPage from "../pages/MempoolSpace/MempoolSpace";
import TxsRouter from "./TxsRouter";
import BlockTransaction from "../pages/BlockDetails/blockTransaction";
import BlockWithdrawals from "../pages/BlockDetails/blockWithdrawals";
import InternalTransaction from "../pages/TransactionDetails/InternalTransaction";
import EventLogs from "../pages/TransactionDetails/EventLogs";
import State from "../pages/TransactionDetails/State";
import TokenTransfer from "../pages/TokenTransfer";
import NftTransfer from "../pages/NftTransfer";
import NftMint from "../pages/NftMint";
import VerifiedSignatures from "../pages/VerifiedSignatures";
import VerifyContract from "../pages/VerifyContract/index.js";
import ContractList from "../pages/ContractsList/index.js";
import TopAccounts from "../pages/TopAccounts/index.js";
import NftDetailPage from "../pages/NftTransfer/NftDetailPage.jsx";
import Dashboard from "../pages/Dashboard/index.jsx";
import L1Component from "../pages/Dashboard/L1s/L1.jsx";
import L1SLandingPage from "../pages/Dashboard/AllL1S/L1SLandingPage.jsx";
import BlocksPage from "../pages/Dashboard/L1s/Blocks/BlocksPage.jsx";
import TransactionsPage from "../pages/Dashboard/L1s/Transactions/TransactionsPage.jsx";

const Index = () => {
  return (
    <Routes>
      <Route path="" element={<MainLayout />}>
        {/* <Route path="" index element={<Home />} /> */}
        <Route path="" element={<Dashboard />} />
        <Route path="blocks" element={<Blocks />} />
        <Route path="/block/:id" element={<BlockDetails />} />
        <Route path="/block/:id/transactions" element={<BlockTransaction />} />
        <Route path="/block/:id/withdrawals" element={<BlockWithdrawals />} />
        <Route path="txs" element={<TxsRouter />} />
        <Route path="/tx/:id" element={<TransactionDetails />} />
        <Route path="/tx/:id/internal" element={<InternalTransaction />} />
        <Route path="/tx/:id/eventlog" element={<EventLogs />} />
        <Route path="/tx/:id/state" element={<State />} />
        <Route path="/address/:id" element={<Accounts />} />
        <Route path="/token/erc20-transfers" element={<TokenTransfer />} />
        <Route path="/token/nft-transfers" element={<NftTransfer />} />
        <Route path="/token/nft-mints" element={<NftMint />} />
        <Route
          path="/services/verified-signatures"
          element={<VerifiedSignatures />}
        />
        <Route path="/services/verify-contract" element={<VerifyContract />} />
        <Route
          path="/blockchain/verified-contracts"
          element={<ContractList />}
        />
        <Route path="/blockchain/accounts" element={<TopAccounts />} />
        <Route path="/nft/:id/:tokenID" element={<NftDetailPage />} />
        <Route path="mempoolspace" element={<MempoolPage />} />
        <Route path="/subnets" element={<L1Component />} />
        <Route
          path="/subnets/network/:subnetName"
          element={<L1SLandingPage />}
        />
        <Route path="/subnets/:chainId/blocks" element={<BlocksPage />} />
        <Route
          path="/subnets/:chainId/transactions"
          element={<TransactionsPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default Index;
