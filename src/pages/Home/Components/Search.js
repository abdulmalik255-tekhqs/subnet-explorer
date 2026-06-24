import { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import ASSETS from "../../../assets";
import { isValidBlock } from "../../../utils";

const Search = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleAddressClick = () => {
    const cleanedSearch = search
      .replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "") // trims all types of spaces
      .toLowerCase(); // convert to lowercase

    if (!cleanedSearch) return;

    if (ethers.isAddress(cleanedSearch)) {
      navigate(`/address/${cleanedSearch}`);
    } else if (
      ethers.isHexString(cleanedSearch) &&
      cleanedSearch.length === 66
    ) {
      navigate(`/tx/${cleanedSearch}`);
    } else if (isValidBlock) {
      navigate(`/block/${cleanedSearch}`);
    }
  };

  return (
    <div className="w-full max-w-[783px] h-12 my-3 border border-bryt-grey-200 rounded-lg bg-white flex items-center pl-4 pr-[7px] py-[7px] gap-4 shadow-navbar">
      <div className="flex items-center gap-[33px] border-r border-r-bryt-grey-200 pr-4">
        <p className="text-[15px]">All Filters</p>
        <img src={ASSETS.arrowDown} alt="" />
      </div>
      <input
        type="search"
        name=""
        className="flex-grow h-full outline-none border-none bg-transparent text-bryt-primary-main text-[15px] placeholder:text-bryt-grey-500"
        placeholder="Search address, tx and blocks"
        id=""
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div
        className="h-full aspect-square bg-bryt-primary-main rounded-lg grid place-items-center cursor-pointer"
        onClick={handleAddressClick}
      >
        <img src={ASSETS.search} alt="" />
      </div>
    </div>
  );
};

export default Search;
