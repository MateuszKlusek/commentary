import { HeaderSection } from "./HeaderSection";

export class CommentaryWebComponent extends HTMLElement {
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

type Props = {
  commentsCount: number;
};

const Commentary = ({ commentsCount }: Props) => {
  return (
    <commentary-container>
      <HeaderSection commentsCount={commentsCount} />
      <div className="text-white bg-purple-200">Text mate</div>
    </commentary-container>
  );
};

export default Commentary;
