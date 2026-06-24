import { createModel } from "@rematch/core";
import { graphqlClient } from "../../apolloClient";
import {
  GET_BLOCK_DETAILS,
  GET_BLOCK_TRANSACTIONS,
  GET_BLOCKS,
  GET_BLOCKS_WITH_PAGINATION,
  GET_DASHBOARD,
  GET_LAST_14_DAYS_TXS,
  GET_LATEST_BLOCK_ID,
  GET_UNCONFIRMED_AND_BALLOTED_BLOCKS,
} from "../../queries";
import { invalidBlock } from "../../app.config";

export const blocks = createModel()({
  name: "blocks",
  state: {
    loading: false,
    blocks: [],
    lastFetched: 0,
    blockHeight: 0,
    pages: 0,
    blocksData: [],
    blocksPaginatedData: [],
    block: invalidBlock,
    unconfirmedBlocks: [],
    dashboard: {},
    txnHistory: {},
  },
  reducers: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setBlocks(state, payload) {
      state.blocks = payload;
    },
    setLastFetch(state, payload) {
      state.lastFetched = payload;
    },
    setBlockHeight(state, payload) {
      state.blockHeight = payload;
    },
    setPages(state, payload) {
      state.pages = payload;
    },
    setBlocksData(state, payload) {
      state.blocksData = payload;
    },
    setBlocksDataPagination(state, payload) {
      state.blocksPaginatedData = payload;
    },
    setBlock(state, payload) {
      state.block = payload;
    },
    setUnconfimedBlocks(state, payload) {
      state.unconfirmedBlocks = payload;
    },
    setDashboardData(state, payload) {
      state.dashboard = payload;
    },
    setTransactionHistory(state, payload) {
      state.txnHistory = payload;
    },
  },
  effects: (dispatch) => ({
    async handleGetAllBlocks() {
      try {
        dispatch.blocks.setLoading(true);
        const response = await graphqlClient.request(GET_BLOCKS, {
          limit: "6",
        });

        dispatch.blocks.setBlocks(response?.blocks);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.blocks.setLoading(false);
      }
    },
    async handleGetdashboardDetail() {
      try {
        dispatch.blocks.setLoading(true);
        const response = await graphqlClient.request(GET_DASHBOARD);
        dispatch.blocks.setDashboardData(response);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.blocks.setLoading(false);
      }
    },
    async handleGetLatestBlockId() {
      try {
        dispatch.blocks.setLoading(true);
        const response = await graphqlClient.request(GET_LATEST_BLOCK_ID);
        let count = response?.blocks[0]?.id;
        const height = Number(count);
        const pages = Math.ceil(height / 10);
        dispatch.blocks.setBlockHeight(height);
        dispatch.blocks.setPages(pages);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.blocks.setLoading(false);
      }
    },
    // async getBlockWithPagination({ page, limit, lastID }, rootState) {
    //   try {
    //     dispatch.blocks.setLoading(true);

    //     const blockHeightNumber = Number(rootState.blocks.blockHeight) || 0;
    //     let lastIdToUse = "0";

    //     // 🧩 Case 1 — First page
    //     if (page === 1) {
    //       lastIdToUse = "0";
    //     }
    //     // 🧩 Case 2 — Sequential navigation (Next/Prev)
    //     else if (lastID && page > 1) {
    //       lastIdToUse = String(lastID);
    //     }
    //     // 🧩 Case 3 — User jumps directly to any page (e.g., 5, 10, last)
    //     else if (blockHeightNumber > 0) {
    //       const targetOffset = (page - 1) * Number(limit);
    //       const targetId = blockHeightNumber - targetOffset;
    //       lastIdToUse = String(targetId > 0 ? targetId : 0);
    //     }

    //     const response = await graphqlClient.request(
    //       GET_BLOCKS_WITH_PAGINATION,
    //       {
    //         lastId: lastIdToUse,
    //         limit: String(limit),
    //       }
    //     );

    //     const blocks = response?.blocks || [];

    //     if (blocks.length > 0) {
    //       // 🧮 Compute height + total pages again if limit changed
    //       const height = Number(blockHeightNumber || blocks[0]?.id);
    //       const pages = Math.ceil(height / Number(limit));

    //       dispatch.blocks.setBlockHeight(height);
    //       dispatch.blocks.setPages(pages);
    //       dispatch.blocks.setBlocksDataPagination(blocks);

    //       // 🧠 Return the new "last ID" so the caller can use it for next page
    //       return blocks[blocks.length - 1]?.id;
    //     }
    //   } catch (err) {
    //     console.error("Error in pagination:", err.message);
    //   } finally {
    //     dispatch.blocks.setLoading(false);
    //   }
    // },
    async getBlockWithPagination({ page, limit, lastID }, rootState) {
      try {
        dispatch.blocks.setLoading(true);
        const blockHeightNumber = rootState.blocks.blockHeight;
        let lastId;

        if (page === 1) {
          lastId = "0";
        } else if (blockHeightNumber) {
          const targetTxnIndex = (page - 1) * limit;
          const targetTxnId = blockHeightNumber - targetTxnIndex;
          lastId = String(targetTxnId > 0 ? targetTxnId : 0);
        } else {
          lastId = "0";
        }
        // let startIndex = (page - 1) * limit;
        const response = await graphqlClient.request(
          GET_BLOCKS_WITH_PAGINATION,
          {
            lastId: String(lastId),
            limit: String(limit),
          }
        );
        const blocks = response?.blocks || [];
        if (blocks.length > 0) {
          // ✅ Always recalculate total pages if limit changes
          // const lastID = blocks?.[blocks.length - 1]?.number;
          const height = Number(rootState.blocks.blockHeight);
          const pages = Math.ceil(height / Number(limit));

          dispatch.blocks.setBlockHeight(height);
          dispatch.blocks.setPages(pages);

          // Replace transactions for current page
          dispatch.blocks.setBlocksDataPagination(blocks);
        }
        // dispatch.blocks.setBlocksDataPagination(response?.blocks);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.blocks.setLoading(false);
      }
    },
    async getSingleBlock(blockNumber) {
      try {
        dispatch.blocks.setLoading(true);

        const response = await graphqlClient.request(GET_BLOCK_DETAILS, {
          id: String(blockNumber),
        });

        dispatch.blocks.setBlock(response?.block);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.blocks.setLoading(false);
      }
    },
    async getUnconfirmedAndBallotedBlocks() {
      try {
        dispatch.blocks.setLoading(true);
        const response = await graphqlClient.request(
          GET_UNCONFIRMED_AND_BALLOTED_BLOCKS
        );

        dispatch.blocks.setUnconfimedBlocks(
          response?.unconfirmedAndBallotedBlock || []
        );
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.blocks.setLoading(false);
      }
    },
    async handleGetAllBlocksTransactions(blockNumber) {
      try {
        dispatch.blocks.setLoading(true);
        const response = await graphqlClient.request(GET_BLOCK_TRANSACTIONS, {
          id: String(blockNumber),
        });
        dispatch.blocks.setBlocks(response?.blockTransactions);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.blocks.setLoading(false);
      }
    },
    async handleGetTxns() {
      try {
        dispatch.blocks.setLoading(true);
        const response = await graphqlClient.request(GET_LAST_14_DAYS_TXS);
        dispatch.blocks.setTransactionHistory(response?.last14DaysTxs);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.blocks.setLoading(false);
      }
    },
  }),
});
