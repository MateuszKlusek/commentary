export const CommentRender = ({ text }: { text: string }) => {
  return (
    <div className="text-sm">
      {text.split("\n").map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ))}
    </div>
  );
};
