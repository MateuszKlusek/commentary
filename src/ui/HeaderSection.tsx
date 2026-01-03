import { HStack } from "./helpers/HStack";

type Props = {
  commentsCount: number;
};

export const HeaderSection = ({ commentsCount }: Props) => {
  return (
    <commentary-header>
      <section id="header-section" className="flex flex-col w-full">
        <HStack>
          <div>{commentsCount} Comments</div>
          <div> Sort By</div>
        </HStack>
        <HStack className="w-full">
          <div>P</div>
          <textarea placeholder="Add a comment..."></textarea>
        </HStack>
      </section>
    </commentary-header>
  );
};
