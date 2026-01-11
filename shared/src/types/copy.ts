import z from "zod";

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
});

export type Copy = z.infer<typeof CopySchema>;
