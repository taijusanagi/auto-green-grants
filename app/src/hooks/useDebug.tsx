import { useState } from "react";

export function useDebug() {
  const [isDebugStarted, setIsDebugStarted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const debug = {
    start: () => {
      setLogs([]);
      setIsDebugStarted(true);
    },
    log: (...messages: string[]) => {
      console.log(...messages);
      setLogs((logs) => [...logs, messages.join(" ")]);
    },
    end: () => {
      setIsDebugStarted(false);
    },
  };

  return { debug, isDebugStarted, logs };
}
