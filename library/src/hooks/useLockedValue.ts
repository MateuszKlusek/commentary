import { useEffect, useState } from "react";

type Props = {
  lockedValue: number;
  stableValue: number;
  condition: boolean;
};

export const useLockedValue = ({
  lockedValue,
  stableValue,
  condition,
}: Props) => {
  const [frozenValue, setFrozenValue] = useState(lockedValue);

  useEffect(() => {
    if (condition) {
      setFrozenValue(lockedValue + stableValue);
    }
  }, [lockedValue, stableValue, condition]);

  return frozenValue;
};
