import { Button, Input, Title } from "@mantine/core";
import { useMemo, useState } from "react";
import { HStack } from "../../../library/src/ui/layout/HStack";
import { VStack } from "../../../library/src/ui/layout/VStack";

import { Separator } from "../components/Separator";

const CONFIG = {
  baseUrl: "http://localhost:3000/api/v1/file",
  userId: "84233d3d-523b-4373-8c15-5545c6f9d0f1",
  discussionId: "94c61dbf-1680-41c8-9029-ecf0bb301636",
};

export const useCommentaryTestingController = () => {
  const [userId, setUserId] = useState<string | undefined | null>(
    CONFIG.userId
  );
  const [discussionId, setDiscussionId] = useState<string | undefined | null>(
    CONFIG.discussionId
  );

  const handleUserIdChange = (newUserId: string | undefined | null) => {
    setUserId(newUserId);
  };
  const handleDiscussionIdChange = (
    newDiscussionId: string | undefined | null
  ) => {
    setDiscussionId(newDiscussionId);
  };

  const Component = useMemo(() => {
    return (
      <section
        id="commentary-testing-controller"
        className="w-full border p-2 rounded-md gap-4 flex flex-col"
      >
        <Title order={2} className="mb-2">
          Commentary Testing Controller
        </Title>
        <VStack className="flex gap-2 flex-col items-start ">
          <HStack className="gap-2 justify-between w-full items-center">
            <Title order={3}>User ID</Title>
            <HStack className="gap-2 ">
              <Button
                onClick={() => handleUserIdChange(crypto.randomUUID())}
                variant="filled"
              >
                Generate
              </Button>
              <Button
                onClick={() => handleUserIdChange(undefined)}
                color="orange"
              >
                Unset
              </Button>
            </HStack>
          </HStack>
          <Input
            value={userId ?? ""}
            onChange={(e) => handleUserIdChange(e.target.value)}
            className="w-full"
          />
        </VStack>
        <Separator />
        <VStack className="flex gap-2 flex-col items-start ">
          <HStack className="gap-2 justify-between w-full items-center">
            <Title order={3}>Discussion ID</Title>
            <HStack className="gap-2 ">
              <Button
                onClick={() => handleDiscussionIdChange(crypto.randomUUID())}
              >
                Generate
              </Button>
              <Button
                onClick={() => handleDiscussionIdChange(undefined)}
                color="orange"
              >
                Unset
              </Button>
            </HStack>
          </HStack>
          <Input
            value={discussionId ?? ""}
            onChange={(e) => handleDiscussionIdChange(e.target.value)}
            className="w-full"
          />
        </VStack>
      </section>
    );
  }, [userId, discussionId]);

  return {
    userId,
    discussionId,
    baseUrl: CONFIG.baseUrl,
    TestingController: Component,
  };
};
