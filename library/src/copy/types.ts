import type { QuantityRangeRule } from "@shared/src/types/copy";
import * as z from "zod/v4";

export const createQuantityRangeSchema = (rules: QuantityRangeRule) =>
  z
    .object({
      quantity: z.number().int().nonnegative(),
      label: z.string(),
    })
    .superRefine((value, ctx) => {
      const rule = [...rules]
        .sort((a, b) => a.from - b.from)
        .filter((r) => value.quantity >= r.from)
        .at(-1);

      if (!rule) {
        ctx.addIssue({
          code: "custom",
          message: "No matching rule for quantity",
        });
        return;
      }

      if (value.label !== rule.label) {
        ctx.addIssue({
          code: "custom",
          path: ["label"],
          message: `Expected "${rule.label}" for quantity ${value.quantity}`,
        });
      }
    });
