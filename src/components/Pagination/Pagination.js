import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import ASSETS from "../../assets";

const Pagination = ({ pages, setPage, page }) => {
  const [pageCount, setPageCount] = useState(pages);

  useEffect(() => {
    setPageCount(pages);
  }, [pages, pageCount]);

  return (
    <div className="text-black mt-5">
      <ReactPaginate
        key={pageCount} // Add key prop to force re-render when pageCount changes
        nextLabel={
          <div className="flex items-start gap-1">
            <img
              src={ASSETS.arrowRight}
              className="transform"
              width={24}
              height={24}
              alt="arrow"
            />
          </div>
        }
        forcePage={page - 1}
        onPageChange={(selected) => setPage(selected.selected + 1)}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        previousLabel={
          <div className="flex items-start gap-1">
            <img
              src={ASSETS.arrowRight}
              className="transform rotate-180"
              width={24}
              height={24}
              alt="arrow"
            />
          </div>
        }
        renderOnZeroPageCount={null}
        containerClassName="flex items-center justify-center"
        className="flex lg:justify-center gap-2"
        pageClassName="w-11 h-11 flex items-center justify-center"
        pageLinkClassName="w-full h-full flex items-center justify-center rounded-lg bg-primary-100 text-[#A4ACB7] bg-transparent"
        activeLinkClassName="rounded-lg !bg-bryt-primary-main text-white"
        nextClassName="w-22 h-11 flex items-center justify-center"
        previousClassName="w-22 h-11 flex items-center justify-center"
        breakClassName="flex items-center justify-center text-[#A4ACB7]"
        nextLinkClassName="w-full h-full flex items-center justify-center bg-primary-100 rounded-full bg-primary-100 text-primary-500"
        previousLinkClassName="w-full h-full flex items-center justify-center bg-primary-100 rounded-full bg-primary-100 text-primary-500"
      />
    </div>
  );
};

export default Pagination;
