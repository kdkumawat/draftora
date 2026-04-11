import { useSyncExternalStore } from "react";

/** True in the browser after hydration; false on the server (avoids hydration mismatch with theme-dependent UI). */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
