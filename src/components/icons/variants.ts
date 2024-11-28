import { type VariantProps, cva } from "class-variance-authority";
import { type SVGProps } from "react";

export const iconVariants = cva("", {
  variants: {
    size: {
      base: "w-5 h-5",
      sm: "w-4 h-4",
      lg: "w-6 h-6",
    },
  },
  defaultVariants: {
    size: "base",
  },
});

export type IconProps = SVGProps<SVGSVGElement> &
  VariantProps<typeof iconVariants>;
