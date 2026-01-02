/// <reference types="vite/client" />
/// <reference types="react" />

import type { WebComponentProps } from "@core/types";

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      "commentary-container": WebComponentProps;
      "commentary-header": WebComponentProps;
    }
  }
}

export {};
