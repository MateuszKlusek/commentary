export const CommentRender = ({ text }: { text: string }) => {
  return (
    <div className="text-[14px] font-normal text-[#f1f1f1]" id="comment-render">
      {text.split("\n").map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ))}
    </div>
  );
};
