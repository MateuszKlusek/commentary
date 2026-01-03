import { webComponentWrappers } from "../types/web-components";

class SlotWrapperElement extends HTMLElement {
  constructor() {
    super();
    // If you want shadow DOM
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `<slot></slot>`;
    } else {
      this.innerHTML = `<slot></slot>`;
    }
  }
}

webComponentWrappers.forEach((tagName) =>
  customElements.define(tagName, SlotWrapperElement)
);
