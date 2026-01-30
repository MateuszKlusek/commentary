import type { Preview } from "@storybook/react-vite";
import "../src/ui/index.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        dark: { name: "Dark", value: "#333" },
        light: { name: "Light", value: "#F7F9F2" },
        maroon: { name: "Maroon", value: "#400" },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  initialGlobals: {
    backgrounds: { value: "maroon" },
  },
};

export default preview;
