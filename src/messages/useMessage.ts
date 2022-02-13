import { useCallback, useContext, useEffect } from "react";
import MessageContext from "./MessageContext";

type Callback = (event: any) => void;

export const useMessage = (callback: Callback, deps: any[]) => {
  const { subscribe } = useContext(MessageContext);
  const handleMessage = useCallback(callback, deps);
  useEffect(() => {
    subscribe(handleMessage);
    // eslint-disable-next-line
  }, []);
};
