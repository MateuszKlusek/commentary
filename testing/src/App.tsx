import { Commentary } from "@commentary";
import { useMemo } from "react";
import { GenericRestClient } from "./adapters/rest-adapter";
import { useCommentaryTestingController } from "./hooks/useCommentaryTestingController";
import customCss from "/styles/custom-css-1.css?url";

function App() {
  const { user, discussionId, baseUrl, TestingControllerComponent } =
    useCommentaryTestingController();

  const client = useMemo(() => {
    return new GenericRestClient({
      baseUrl,
      discussionId,
    });
  }, [discussionId, baseUrl]);

  return (

    <div className="w-full p-10 flex flex-col gap-2 container mx-auto">
      {TestingControllerComponent}
      <Commentary
        getTopLevelComments={client.getTopLevelComments}
        getReplies={client.getReplies}
        addComment={client.addComment}
        handleUserSentiment={client.handleUserSentiment}
        user={user}
        discussionId={discussionId}
        customCss={customCss}

        // just for rerendering
        key={`${user.name}-${discussionId}`}
      />
    </div>
  );
}

export default App;
