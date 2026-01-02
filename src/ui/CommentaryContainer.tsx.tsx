import { HeaderSection } from "./HeaderSection";

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
