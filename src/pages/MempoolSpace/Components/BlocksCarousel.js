import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { Swiper, SwiperSlide } from "swiper/react";
import { invalidBlock, ITEMS_PER_PAGE } from "../../../app.config";
import { GET_BLOCKS } from "../../../queries";
import "swiper/swiper-bundle.css";

const BlockCarousel = () => {
  const { unconfirmedBlocks } = useSelector((state) => state.blocks);
  const [page, setPage] = useState(1);
  const [limit] = useState(ITEMS_PER_PAGE);
  const [showLeftNav, setShowLeftNav] = useState(false);
  const swiperRef = useRef(null);
  const { data, loading, fetchMore } = useQuery(GET_BLOCKS, {
    variables: {
      lastId: String((page - 1) * limit),
      limit: String(limit),
    },
    // skip: page === 1,
    pollInterval: page === 1 ? 10000 : 0,
  });

  const handleSlideChange = (swiper) => {
    setShowLeftNav(swiper.activeIndex > 0 || page > 1);
  };

  const handleLeftNavClick = () => {
    if (swiperRef.current) {
      setPage(1);
      swiperRef.current.slideTo(0);
      setShowLeftNav(false);
    }
  };

  const handleReachEnd = () => {
    if (loading) return;
    if (data?.blocks?.blocks?.length) {
      fetchMore({
        variables: {
          lastId: String((page - 1) * limit),
          limit: String(limit),
        },
      }).then(() => setPage((prev) => prev + 1));
    }
  };
  const tempBlock = Number(data?.blocks?.blocks[0]?.blockNumber);
  const filteredUnconfirmedBlocksBlocks = unconfirmedBlocks?.filter(
    (block) => block?.blockNumber !== null
  );
  // const filteredUnconfirmedBlocksBlocks = unconfirmedBlocks?.filter(
  //   (block) =>
  //     block?.blockNumber !== null && Number(block?.blockNumber) > tempBlock
  // );
  return (
    <div className="mx-5 my-8 relative">
      <Swiper
        slidesPerView={8}
        spaceBetween={20}
        onReachEnd={handleReachEnd}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 7 },
          1280: { slidesPerView: 8 },
        }}
        className="swiper-container"
      >
        {/* Render Unconfirmed Blocks */}
        {filteredUnconfirmedBlocksBlocks?.length > 0 ? (
          unconfirmedBlocks
            ?.filter((block) => block?.blockNumber !== null)
            .map((block) => (
              <SwiperSlide
                key={block?.blockNumber}
                className={`p-3 mb-2 ${
                  block?.type === "Unconfirmed"
                    ? "bg-unconfirmedBlock"
                    : "bg-ballotedBlock"
                } rounded-lg transition-shadow duration-300 flex flex-col justify-center items-center`}
              >
                <div className="flex flex-col justify-center items-center">
                  <h4 className="font-semibold text-lg">
                    {block?.blockNumber}
                  </h4>
                  <p className="text-sm w-[10ch] overflow-hidden text-ellipsis text-center">
                    {block?.blockHash || invalidBlock?.block_hash}
                  </p>
                  <p className="text-sm text-gray-600">
                    {block?.totalTransactions || 0} transactions
                  </p>
                </div>
              </SwiperSlide>
            ))
        ) : tempBlock ? (
          <SwiperSlide
            key={tempBlock}
            className="p-3 mb-2 bg-unconfirmedBlock rounded-lg transition-shadow duration-300 flex flex-col justify-center items-center"
          >
            <div className="flex flex-col justify-center items-center">
              <h4 className="font-semibold text-lg">{tempBlock + 1}</h4>
              <p className="text-sm w-[10ch] overflow-hidden text-ellipsis text-center">
                {invalidBlock?.block_hash}
              </p>
              <p className="text-sm text-gray-600">0 transactions</p>
            </div>
          </SwiperSlide>
        ) : null}

        {/* Render Blocks */}
        {data?.blocks?.blocks?.map((block) => (
          <SwiperSlide
            key={block.blockNumber}
            className="p-3 mb-2 bg-mempoolfinalblock rounded-lg transition-shadow duration-300 flex flex-col justify-center items-center"
          >
            <div className="flex flex-col justify-center items-center">
              <h4 className="font-semibold text-lg">{block?.blockNumber}</h4>
              <p className="text-sm w-[10ch] overflow-hidden text-ellipsis text-center">
                {block?.blockHash}
              </p>
              <p className="text-sm text-gray-600">
                {block?.transactions?.length || 0} transactions
              </p>
            </div>
          </SwiperSlide>
        ))}

        {/* Render Skeletons at the End */}
        {loading &&
          Array.from({ length: 3 }).map((_, index) => (
            <SwiperSlide
              key={`skeleton-${index}`}
              className="p-3 mb-2 bg-gray-200 animate-pulse rounded-lg flex flex-col justify-center items-center"
            >
              <div className="h-6 w-12 bg-gray-300 rounded"></div>
              <div className="h-4 w-20 bg-gray-300 rounded my-2"></div>
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Left Navigation Button */}
      {showLeftNav && (
        <button
          className="swiper-button-prev absolute !text-sm left-0 !top-[68px] transform -translate-y-1/2 !text-bryt-primary-main p-2 rounded-full"
          onClick={handleLeftNavClick}
        />
      )}
    </div>
  );
};

export default BlockCarousel;
