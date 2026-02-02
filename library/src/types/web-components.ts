export type WebComponentProps<T extends object = object> =
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & T, HTMLElement>;

export const webComponentWrappers = [
  "commentary-container",
  "commentary-header",
  "commentary-top-level-thread",
  "commentary-reply-thread",
  "commentary-thread-line",
  "commentary-content",
  "commentary-parent-comment",
  "commentary-thread",
  "commentary-replies-control",
  "commentary-app-loader",
  "commentary-reply-skeleton",
] as const;

export type Wrapper = (typeof webComponentWrappers)[number];

export type WrapperElements = {
  [K in Wrapper]: WebComponentProps;
};
