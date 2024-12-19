import {useEffect, useRef, useState, useCallback} from 'react';

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null || isPaused) {
      return;
    }

    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay, isPaused]);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  return {pause, resume, isPaused};
}

export default useInterval;
