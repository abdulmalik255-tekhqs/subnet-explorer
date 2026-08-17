import { useCallback, useEffect, useState } from "react";

export const PAGE_SIZE = 10;

const getLastNumber = (pageItems) =>
  pageItems?.[pageItems.length - 1]?.number ?? null;

// Generic keyset (cursor) pager: the underlying APIs only support "give me
// N items before this `number`", so pages can't be computed with a formula
// (the `number`s for a filtered/per-address list are a sparse subset of all
// chain-wide numbers). `lastIdStack[p]` caches the cursor used to fetch page
// p+1, so revisiting an already-seen page is a single fetch; jumping ahead
// walks forward one fetch per undiscovered page in between.
//
// `fetchPage(lastId)` must resolve to `{ items, total }` and is expected to
// be a stable (useCallback'd) reference.
export default function useKeysetPagination({
  chainId,
  address,
  active,
  fetchPage,
}) {
  const [lastIdStack, setLastIdStack] = useState(["0"]);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(
    async (lastId) => {
      setLoading(true);
      try {
        const data = await fetchPage(lastId);
        setItems(data?.items ?? []);
        setTotal(Number(data?.total ?? 0));
        return data;
      } finally {
        setLoading(false);
      }
    },
    [fetchPage],
  );

  useEffect(() => {
    setLastIdStack(["0"]);
    setPage(1);
  }, [chainId, address]);

  useEffect(() => {
    if (chainId && address && active) {
      load("0");
    }
  }, [chainId, address, active, load]);

  const goToPage = useCallback(
    async (target) => {
      if (!chainId || !address || target === page) return;

      const stack = [...lastIdStack];

      if (page === stack.length && items.length > 0 && !stack[page]) {
        const nextCursor = getLastNumber(items);
        if (nextCursor) {
          stack.push(nextCursor);
        }
      }

      if (target <= stack.length) {
        setPage(target);
        setLastIdStack(stack);
        await load(stack[target - 1]);
        return;
      }

      let resolvedPage = stack.length;

      for (let nextPage = stack.length + 1; nextPage <= target; nextPage++) {
        const data = await load(stack[nextPage - 1]);
        resolvedPage = nextPage;

        const lastNumber = getLastNumber(data?.items ?? []);
        if (!lastNumber) break;

        if (!stack[nextPage]) {
          stack.push(lastNumber);
        }
      }

      setLastIdStack(stack);
      setPage(resolvedPage);
    },
    [chainId, address, page, lastIdStack, items, load],
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return { items, total, totalPages, page, loading, goToPage };
}
