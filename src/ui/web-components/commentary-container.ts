class CommentaryWebComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
         <style>
           :host { display: flex; }
         </style>
         <slot></slot>
       `;
  }
}
customElements.define("commentary-container", CommentaryWebComponent);
