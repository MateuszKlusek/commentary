import { Commentary } from "@ui/CommentaryContainer/CommentaryContainer";
import { UserIdInput } from "@ui/UserIdInput";
import { useMemo, useState } from "react";
import { GenericRestClient } from "../adapters/rest/test-client";

const CONFIG = {
  baseUrl: "http://localhost:3000/api/v1/file",
  userId: "84233d3d-523b-4373-8c15-5545c6f9d0f1",
  slug: "test-slug",
};

function App() {
  const [userId, setUserId] = useState<string | undefined | null>(
    CONFIG.userId
  );

  const client = useMemo(() => {
    return new GenericRestClient(CONFIG.baseUrl);
  }, []);

  const handleUserIdChange = (newUserId: string | undefined | null) => {
    setUserId(newUserId);
  };

  return (
    <div className="w-full p-10 flex flex-col gap-2">
      <UserIdInput userId={userId} onUserIdChange={handleUserIdChange} />
      <Commentary
        getTopLevelCommentCount={() => client.getTopLevelCommentCount()}
        getTopLevelComments={(offset, limit) =>
          client.getTopLevelComments(offset, limit)
        }
        getReplies={(commentId, offset, limit) =>
          client.getReplies(commentId, offset, limit)
        }
        updateLike={(commentId, like) => client.updateLike(commentId, like)}
        addComment={(content, userId, parentId) =>
          client.addComment(content, userId, parentId)
        }
        userId={userId}
        slug={CONFIG.slug}
      />
    </div>
  );
}

export default App;
