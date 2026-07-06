import { useCallback, useEffect, useState } from 'react';

type UseCooldownOptions = {
  initialSeconds?: number;
};

export const useCooldown = (options: UseCooldownOptions = {}) => {
  const { initialSeconds = 0 } = options;
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const timeoutId = window.setTimeout(() => {
      setRemainingSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [remainingSeconds]);

  const start = useCallback((seconds: number) => {
    setRemainingSeconds(Math.max(Math.floor(seconds), 0));
  }, []);

  const reset = useCallback(() => {
    setRemainingSeconds(0);
  }, []);

  return {
    isActive: remainingSeconds > 0,
    remainingSeconds,
    reset,
    start,
  };
};
