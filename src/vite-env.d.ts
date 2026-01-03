/// <reference types="vite/client" />
/// <reference types="react" />

import type { WrapperElements } from "@core/types";

declare global {
  namespace React.JSX {
    interface IntrinsicElements extends WrapperElements {}
  }
}

export {};
