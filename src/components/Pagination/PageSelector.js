import React, { useState, useRef, useEffect } from 'react';
import ASSETS from '../../assets';
import { ITEMS_PER_PAGE } from '../../app.config';

const RowsPerPageDropdown = ({
  defaultRows = ITEMS_PER_PAGE,
  options = [10, 25, 50, 100],
  onChange,
}) => {
  const [selectedRows, setSelectedRows] = useState(defaultRows);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionClick = (value) => {
    setSelectedRows(value);
    setIsOpen(false);
    if (onChange) {
      onChange(value);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="flex items-center space-x-2">
      <div className="text-[14.5px] text-gray-700">Show records:</div>
      <div className="relative inline-block">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
        >
          {selectedRows}
          <img src={ASSETS.arrowDown} alt="" />
        </div>

        {isOpen && (
          <ul className="absolute z-10 w-20 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleOptionClick(option)}
                className="px-3 py-2 text-sm text-gray-800 cursor-pointer hover:bg-blue-100"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RowsPerPageDropdown;
