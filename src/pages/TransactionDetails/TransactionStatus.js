import React from 'react';

const TransactionStatus = ({ status }) => {
  const statusOptions = ['Mempool', 'Balloted', 'Included'];
  const statusMap = {
    Unconfirmed: 'Mempool',
    Balloted: 'Balloted',
    Confirmed: 'Included',
    Finalized: 'Included',
  };

  const selectedStatus = statusMap[status];

  return (
    <div className="flex items-center border border-bryt-grey-200 bg-white shadow-navbar rounded-[12px] ml-2 overflow-hidden">
      {statusOptions.map((status, index) => (
        <div
          key={status}
          className={`py-[5px] px-[12px] text-[12.6px] font-semibold transition-all duration-300 border-bryt-grey-200 ${
            index === 0
              ? 'rounded-l-[12px]'
              : index === statusOptions.length - 1
              ? 'rounded-r-[12px]'
              : 'border-x'
          } ${
            status === selectedStatus ? 'bg-bryt-primary-main text-white' : ''
          }`}
        >
          {status}
        </div>
      ))}
    </div>
  );
};

export default TransactionStatus;
