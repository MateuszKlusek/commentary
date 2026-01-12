import { Button, Input, Title } from "@mantine/core";
import { useMemo, useState } from "react";
import { HStack } from "../../../library/src/ui/layout/HStack";
import { VStack } from "../../../library/src/ui/layout/VStack";

import { Separator } from "../components/Separator";

const CONFIG = {
  baseUrl: "http://localhost:3000/api/v1/file",
  userId: "84233d3d-523b-4373-8c15-5545c6f9d0f1",
  discussionId: "94c61dbf-1680-41c8-9029-ecf0bb301636",
  userName: "TestingUser001",
  userAvatarUrl: "https://i.pravatar.cc/150?img=1",
};

export const useCommentaryTestingController = () => {
  const [userId, setUserId] = useState(CONFIG.userId);
  const [discussionId, setDiscussionId] = useState(CONFIG.discussionId);
  const [userName, setUserName] = useState(CONFIG.userName);
  const [userAvatarUrl, _] = useState(CONFIG.userAvatarUrl);

  const Component = useMemo(() => {
    return (
      <section
        id="commentary-testing-controller"
        className="w-full border p-2 rounded-md gap-4 flex flex-col"
      >
        <Title order={2} className="mb-2">
          Commentary Testing Controller
        </Title>
        <ItemControlBlock value={userId} onChange={setUserId} title="User ID" />
        <Separator />
        <ItemControlBlock
          value={discussionId}
          onChange={setDiscussionId}
          title="Discussion ID"
        />
        <Separator />
        <ItemControlBlock
          value={userName}
          onChange={setUserName}
          title="User Name"
          disabled={true}
        />
        <Separator />
      </section>
    );
  }, [userId, discussionId]);

  return {
    user: {
      userId,
      name: userName,
      avatarUrl: userAvatarUrl,
    },
    discussionId,
    baseUrl: CONFIG.baseUrl,
    TestingController: Component,
  };
};

type ItemControlBlockProps<T> = {
  value: T;
  onChange: (value: T) => void;
  title: string;
  disabled?: boolean;
};

const ItemControlBlock = <T extends string | null | undefined>({
  value,
  onChange,
  title,
  disabled = false,
}: ItemControlBlockProps<T>) => {
  return (
    <VStack className="flex gap-2 flex-col items-start ">
      <HStack className="gap-2 justify-between w-full items-center">
        <Title order={3}>{title}</Title>
        <HStack className="gap-2 ">
          <Button
            disabled={disabled}
            onClick={() => onChange(crypto.randomUUID() as T)}
          >
            Generate
          </Button>
          <Button
            disabled={disabled}
            onClick={() => onChange(null as T)}
            color="orange"
          >
            Unset
          </Button>
        </HStack>
      </HStack>
      <Input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full"
      />
    </VStack>
  );
};
