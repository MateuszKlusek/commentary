import {
    type DependencyList,
    type EffectCallback,
    useEffect,
    useRef,
} from "react";

export const useAfterEffect = (
  effect: EffectCallback,
  deps?: DependencyList
) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;

      return;
    }

    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
