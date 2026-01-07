import { Commentary } from "@ui/Commentary";
import { UserIdInput } from "@ui/UserIdInput";
import { useMemo, useState } from "react";
import { GenericRestClient } from "../adapters/rest-adapter";
import customCss from "/styles/custom-css-1.css?url";

const CONFIG = {
  baseUrl: "http://localhost:3000/api/v1/file",
  userId: "84233d3d-523b-4373-8c15-5545c6f9d0f1",
  discussionId: "94c61dbf-1680-41c8-9029-ecf0bb301636",
};

function App() {
  const [userId, setUserId] = useState<string | undefined | null>(
    CONFIG.userId
  );

  const client = useMemo(() => {
    return new GenericRestClient({
      baseUrl: CONFIG.baseUrl,
      discussionId: CONFIG.discussionId,
    });
  }, []);

  const handleUserIdChange = (newUserId: string | undefined | null) => {
    setUserId(newUserId);
  };

  return (
    <div className="w-full p-10 flex flex-col gap-2">
      <UserIdInput userId={userId} onUserIdChange={handleUserIdChange} />
      <Commentary
        getTopLevelComments={client.getTopLevelComments}
        getReplies={client.getReplies}
        // TODO: implement
        updateLike={() => Promise.resolve()}
        addComment={() => Promise.resolve()}
        discussionId={CONFIG.discussionId}
        userId={userId}
        customCss={customCss}
      />
    </div>
  );
}

export default App;
