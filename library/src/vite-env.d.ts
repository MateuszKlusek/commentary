/// <reference types="vite/client" />
/// <reference types="react" />

import type { WrapperElements } from "./types/web-components";

declare global {
  namespace React.JSX {
    interface IntrinsicElements extends WrapperElements {}
  }
}

export {};
