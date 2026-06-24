import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountTransactions from '../pages/AccountTransactions/AccountTransactions';
import BlockTransactions from '../pages/BlockTransactions/BlockTransactions';
import Transactions from '../pages/Transactions/Transactions';

const TxsRouter = () => {
  const [searchParams] = useSearchParams();
  const address = searchParams.get('a');
  const block = searchParams.get('block');

  if (address) return <AccountTransactions address={address} />;
  if (block) return <BlockTransactions blockNumber={block} />;
  return <Transactions />;
};

export default TxsRouter;
