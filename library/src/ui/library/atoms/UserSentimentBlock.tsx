import type { CommentItem } from "@shared/src/types/core";
import type { UserSentiment } from "@shared/src/types/data";
import { useOptimistic, useState, useTransition } from "react";
import { useCommentaryAPI } from "../../../context/CommentaryAPIContext";
import { useUser } from "../../../context/UserContext";
import { useNoUserPopover } from "../../../hooks/useNoUserPopover";


type Props = {
    comment: CommentItem;
}

const sentimentList: UserSentiment['sentiment'][] = [-1, 0, 1]

export const UserSentimentBlock = ({ comment }: Props) => {
    const [data, setData] = useState({
        likes: comment.commentStats?.likeCount || 0,
        dislikes: comment.commentStats?.dislikeCount || 0,
        userSentiment: comment.userSentiment?.sentiment || 0
    });

    const { handleUserSentiment } = useCommentaryAPI();
    const { user, isUserSet } = useUser();

    const { NoUserPopover: NoUserPopoverLike } = useNoUserPopover({
        enabled: !isUserSet,
    });
    const { NoUserPopover: NoUserPopoverDislike } = useNoUserPopover({
        enabled: !isUserSet,
    });

    const [isPending, startTransition] = useTransition();

    const [optimisticSentiment, addOptimisticSentiment] = useOptimistic(
        data,
        (state, nextSentiment: UserSentiment['sentiment']) => {
            const prevState = state.userSentiment;
            let newLikes = state.likes;
            let newDislikes = state.dislikes;

            // Undo the previous sentiment's effect
            if (prevState === 1) newLikes--;
            if (prevState === -1) newDislikes--;

            // Apply the new sentiment's effect
            if (nextSentiment === 1) newLikes++;
            if (nextSentiment === -1) newDislikes++;

            return {
                likes: newLikes,
                dislikes: newDislikes,
                userSentiment: nextSentiment
            };
        }
    );

    async function handleReaction(sentiment: "like" | "dislike", userReaction: number) {
        if (isPending || !user?.userId) return;


        const finalSentiment = (() => {
            const f = sentiment === "like" ? Array.prototype.findLastIndex : Array.prototype.findIndex
            const idx = f.call(sentimentList, s => s !== userReaction)
            return sentimentList[idx]
        })();


        startTransition(async () => {
            addOptimisticSentiment(finalSentiment);

            try {
                const updatedReactions = await handleUserSentiment({
                    commentId: comment.comment.commentId,
                    userId: user.userId,
                    sentiment: finalSentiment,
                });
                setData({ likes: updatedReactions.likeCount, dislikes: updatedReactions.dislikeCount, userSentiment: finalSentiment });
            } catch (error) {
                console.error("Failed to like:", error);
            }
        });


    }

    return (
        <div className="flex gap-2">
            <NoUserPopoverLike>
                <button
                    className="cursor-pointer"
                    onClick={() => handleReaction("like", optimisticSentiment.userSentiment)}
                >
                    {optimisticSentiment.userSentiment === 1 ? (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M3 20v-8c0-1.1.9-2 2-2h3.9c.4 0 .8-.2 1-.5l2.4-4.8C13.1 3.1 14.5 2 16 2h.1c1.2 0 2.1 1.2 1.7 2.4L16.2 10h4.3c1.4 0 2.5 1.3 2.2 2.7l-2.3 8c-.3.8-1.1 1.3-2 1.3H5c-1.1 0-2-.9-2-2Z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 10v12" />
                            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                        </svg>
                    )}
                </button>
            </NoUserPopoverLike>
            <div>{optimisticSentiment.likes}</div>

            <NoUserPopoverDislike>
                <button
                    className="cursor-pointer"
                    onClick={() => handleReaction("dislike", optimisticSentiment.userSentiment)}
                >
                    {optimisticSentiment.userSentiment === -1 ? (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M21 4v8c0 1.1-.9 2-2 2h-3.9c-.4 0-.8.2-1 .5l-2.4 4.8c-.8 1.6-2.2 2.7-3.7 2.7h-.1c-1.2 0-2.1-1.2-1.7-2.4L7.8 14H3.5c-1.4 0-2.5-1.3-2.2-2.7l2.3-8C3.9 2.5 4.7 2 5.6 2H19c1.1 0 2 .9 2 2Z" />
                        </svg>
                    )
                        : (
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 14V2" />
                                <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                            </svg>
                        )
                    }
                </button>
            </NoUserPopoverDislike>
            <div>{optimisticSentiment.dislikes}</div>
        </div >
    );
};

