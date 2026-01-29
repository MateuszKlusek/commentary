import { useEffect, useRef, useState } from "react";

export const useFrozenValue = <T>(value: T, condition: boolean) => {
  const [frozenValue, setFrozenValue] = useState(value);

  const frozen = useRef<boolean>(false);

  useEffect(() => {
    if (!frozen.current && condition) {
      setFrozenValue(value);
      frozen.current = true;
    }
  }, [value]);

  return frozenValue;
};
