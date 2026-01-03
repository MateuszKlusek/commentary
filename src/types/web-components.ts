export type WebComponentProps<T extends object = object> =
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & T, HTMLElement>;

export const webComponentWrappers = [
  "commentary-container",
  "commentary-header",
  "commentary-content",
  "commentary-thread",
] as const;

export type Wrapper = (typeof webComponentWrappers)[number];

export type WrapperElements = {
  [K in Wrapper]: WebComponentProps;
};
