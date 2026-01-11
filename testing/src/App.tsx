import { Commentary } from "@commentary";
import { useMemo } from "react";
import { GenericRestClient } from "./adapters/rest-adapter";
import { useCommentaryTestingController } from "./hooks/useCommentaryTestingController";
import customCss from "/styles/custom-css-1.css?url";

function App() {
  const { userId, discussionId, baseUrl, TestingController } =
    useCommentaryTestingController();

  const client = useMemo(() => {
    return new GenericRestClient({
      baseUrl: baseUrl,
      discussionId: discussionId ?? "",
    });
  }, [discussionId, baseUrl]);

  const handleUserNameClick = (userId: string) => {
    console.log("userId", userId);
  };

  return (
    <>
      <div className="w-full p-10 flex flex-col gap-2 container mx-auto">
        {TestingController}
        <Commentary
          getTopLevelComments={client.getTopLevelComments}
          getReplies={client.getReplies}
          addComment={client.addComment}
          // TODO: implement
          updateLike={() => Promise.resolve()}
          //
          discussionId={discussionId}
          userId={userId}
          customCss={customCss}
          // just for rerendering
          key={`${userId}-${discussionId}`}
          onUserNameClick={handleUserNameClick}
        />
      </div>
    </>
  );
}

export default App;
