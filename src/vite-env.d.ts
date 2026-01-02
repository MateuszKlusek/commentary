/// <reference types="vite/client" />
/// <reference types="react" />

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      "commentary-container": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          value?: number[];
          checked?: boolean;
        },
        HTMLElement
      >;
    }
  }
}

export {};
