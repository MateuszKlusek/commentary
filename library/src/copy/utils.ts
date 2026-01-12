import type { QuantityRangeRule } from "@shared/src/types/copy";

type Props = {
  quantity: number;
  rules: QuantityRangeRule;
  template?: PluralizationTemplate;
};

/**
 * A string that must contain both {quantity} and {label}
 */
type PluralizationTemplate =
  | `${string}{quantity}${string}{label}${string}`
  | `${string}{label}${string}{quantity}${string}`;

export const handlePluralization = ({
  quantity,
  rules,
  template = "{quantity} {label}",
}: Props) => {
  const rule = rules.find((rule) => quantity <= rule.from);
  return template
    .replace("{quantity}", quantity.toString())
    .replace("{label}", rule?.label ?? rules[rules.length - 1].label)
    .trim();
};
