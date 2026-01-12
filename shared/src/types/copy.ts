import z from "zod";
import { SortingStrategySchema } from "./core";

export const QuantityRangeRuleSchema = z.array(
  z.object({
    from: z.number().int().nonnegative(),
    label: z.string(),
  })
);

export type QuantityRangeRule = z.infer<typeof QuantityRangeRuleSchema>;

export const CopySchema = z.object({
  language: z.string().nonempty(),
  comment: QuantityRangeRuleSchema,
  addCommentButtonLabel: z.string().nonempty(),
  addReplyButtonLabel: z.string().nonempty(),
  addCommentPlaceholder: z.string().nonempty(),
  addReplyPlaceholder: z.string().nonempty(),
  addCommentCancelButtonLabel: z.string().nonempty(),
  addReplyCancelButtonLabel: z.string().nonempty(),
  sortingOptions: z.array(
    z.object({ label: z.string().nonempty(), value: SortingStrategySchema })
  ),
  sortByLabel: z.string().nonempty(),
});

export type Copy = z.infer<typeof CopySchema>;

/**
 * A string that must contain both {quantity} and {label}
 */
export type PluralizationTemplate =
  | `${string}{quantity}${string}{label}${string}`
  | `${string}{label}${string}{quantity}${string}`;
