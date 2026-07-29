import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type TimeoutHandle = ReturnType<typeof setTimeout>;

interface TabScrollContextValue {
  handleScrollBegin: () => void;
  handleScrollEnd: () => void;
  isTabScrolling: boolean;
}

const TabScrollContext = createContext<TabScrollContextValue | null>(null);

export function TabScrollProvider({ children }: PropsWithChildren) {
  const [isTabScrolling, setIsTabScrolling] = useState(false);
  const settleTimeoutRef = useRef<TimeoutHandle | null>(null);

  const clearSettleTimeout = useCallback(() => {
    if (!settleTimeoutRef.current) {
      return;
    }

    clearTimeout(settleTimeoutRef.current);
    settleTimeoutRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      clearSettleTimeout();
    };
  }, [clearSettleTimeout]);

  const handleScrollBegin = useCallback(() => {
    clearSettleTimeout();
    setIsTabScrolling(true);
  }, [clearSettleTimeout]);

  const handleScrollEnd = useCallback(() => {
    clearSettleTimeout();
    settleTimeoutRef.current = setTimeout(() => {
      setIsTabScrolling(false);
      settleTimeoutRef.current = null;
    }, 120);
  }, [clearSettleTimeout]);

  const value = useMemo<TabScrollContextValue>(
    () => ({
      handleScrollBegin,
      handleScrollEnd,
      isTabScrolling,
    }),
    [handleScrollBegin, handleScrollEnd, isTabScrolling]
  );

  return <TabScrollContext.Provider value={value}>{children}</TabScrollContext.Provider>;
}

export function useTabScroll() {
  const context = useContext(TabScrollContext);

  if (!context) {
    throw new Error("useTabScroll must be used within TabScrollProvider");
  }

  return context;
}

export function useTabScrollHandlers() {
  const { handleScrollBegin, handleScrollEnd } = useTabScroll();

  return useMemo(
    () => ({
      onMomentumScrollBegin: handleScrollBegin,
      onMomentumScrollEnd: handleScrollEnd,
      onScrollBeginDrag: handleScrollBegin,
      onScrollEndDrag: handleScrollEnd,
      scrollEventThrottle: 16,
    }),
    [handleScrollBegin, handleScrollEnd]
  );
}
