export class CommentaryContainerDOM extends HTMLElement {
  value: number[] | undefined;

  constructor() {
    super();
    // The value here will be overwritten by React
    // when initialized as an element
    this.value = undefined;
  }

  connectedCallback() {
    this.innerHTML = this.value?.join(", ") ?? "";
  }
}

customElements.define("commentary-container", CommentaryContainerDOM);

const CommentaryContainer = () => {
  return (
    <commentary-container
      value={[1, 2, 9, 10]}
      checked={true}
      className="bg-orange-400"
    >
      Text
    </commentary-container>
  );
};

export default CommentaryContainer;
