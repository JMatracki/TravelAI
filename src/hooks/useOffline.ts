import { useState, useEffect } from "react";

/**
 * Hook that tracks online/offline status of the application
 * @returns boolean - True if offline, false if online
 */
export const useOffline = (): boolean => {
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    if (typeof navigator === "undefined") return false;
    return !navigator.onLine;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      setIsOffline(false);
      console.log("🌐 Connection restored");
    };

    const handleOffline = () => {
      setIsOffline(true);
      console.warn("📡 Connection lost - operating in offline mode");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOffline;
};

/**
 * Hook that provides network status and utilities
 * @returns Object with offline status and network utilities
 */
export const useNetworkStatus = () => {
  const isOffline = useOffline();

  return {
    isOffline,
    isOnline: !isOffline,
    connectionType:
      typeof navigator !== "undefined" && "connection" in navigator
        ? (navigator as unknown as { connection?: { effectiveType: string } })
            .connection?.effectiveType
        : "unknown",
  };
};
