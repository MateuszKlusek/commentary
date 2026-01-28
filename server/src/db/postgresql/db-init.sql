CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id UUID NOT NULL, 
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(comment_id) ON DELETE CASCADE, 
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comment_stats (
    comment_id UUID PRIMARY KEY REFERENCES comments(comment_id) ON DELETE CASCADE,
    like_count INTEGER NOT NULL DEFAULT 0,
    dislike_count INTEGER NOT NULL DEFAULT 0,
    reply_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_sentiments (
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    comment_id UUID NOT NULL REFERENCES comments(comment_id) ON DELETE CASCADE,
    sentiment INTEGER NOT NULL CHECK (sentiment IN (-1, 0, 1)),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, comment_id)
);

-- NEEDED for making sured that we handle two entries on cascade delete
CREATE OR REPLACE FUNCTION decrement_parent_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.parent_id IS NOT NULL THEN
        UPDATE comment_stats
        SET reply_count = GREATEST(0, reply_count - 1)
        WHERE comment_id = OLD.parent_id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_decrement_reply_count ON comments;

CREATE TRIGGER trigger_decrement_reply_count
AFTER DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION decrement_parent_reply_count();