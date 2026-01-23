import type {
  JsonComment,
  JsonCommentStats,
  JsonUser,
  JsonUserReaction,
} from "@shared/src/types/json";
import { readFileSync } from "fs";
import path from "path";
import { Client } from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/commentary_db";

interface SeedConfig<T> {
  client: Client;
  jsonPath: string;
  table: string;
  columns: string[];
  mapRow: (item: T) => any[];
  emptyMessage?: string;
  successMessage?: (count: number) => string;
}

export async function seedFromJson<T>({
  client,
  jsonPath,
  table,
  columns,
  mapRow,
  emptyMessage = "Nothing to seed",
  successMessage = (count) => `Seeded ${count} rows into ${table}`,
}: SeedConfig<T>) {
  const items: T[] = JSON.parse(readFileSync(path.join(jsonPath), "utf8"));

  if (items.length === 0) {
    console.log(emptyMessage);
    return;
  }

  const values: string[] = [];
  const params: any[] = [];

  items.forEach((item, i) => {
    const row = mapRow(item);
    const offset = i * row.length;

    values.push(`(${row.map((_, j) => `$${offset + j + 1}`).join(", ")})`);

    params.push(...row);
  });

  const query = `
      INSERT INTO ${table} (${columns.join(", ")})
      VALUES ${values.join(", ")}
    `;

  await client.query("BEGIN");
  await client.query(query, params);
  await client.query("COMMIT");

  console.log(successMessage(items.length));
}

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  await seedFromJson<JsonCommentStats>({
    client,
    jsonPath: "mocks/comment-stats.json",
    table: "comment_stats",
    columns: ["comment_id", "like_count", "dislike_count", "reply_count"],
    mapRow: (c) => [c.commentId, c.likeCount, c.dislikeCount, c.replyCount],
    emptyMessage: "No comment stats to seed",
    successMessage: (n) => `Seeded ${n} comment stats`,
  });

  await seedFromJson<JsonComment>({
    client,
    jsonPath: "mocks/comments.json",
    table: "comments",
    columns: [
      "discussion_id",
      "user_id",
      "parent_id",
      "content",
      "created_at",
      "updated_at",
    ],
    mapRow: (c) => [
      c.discussionId,
      c.userId,
      c.parentId,
      c.content,
      c.createdAt,
      c.updatedAt,
    ],
    emptyMessage: "No comments to seed",
    successMessage: (n) => `Seeded ${n} comments`,
  });

  await seedFromJson<JsonUserReaction>({
    client,
    jsonPath: "mocks/user-reactions.json",
    table: "user_reactions",
    columns: ["user_id", "comment_id", "reaction", "created_at", "updated_at"],
    mapRow: (r) => [
      r.userId,
      r.commentId,
      r.reaction,
      r.createdAt,
      r.createdAt,
    ],
    emptyMessage: "No user reactions to seed",
    successMessage: (n) => `Seeded ${n} user reactions`,
  });

  await seedFromJson<JsonUser>({
    client,
    jsonPath: "mocks/users.json",
    table: "users",
    columns: ["user_id", "name", "avatar_url"],
    mapRow: (u) => [u.userId, u.name, u.avatarUrl],
    emptyMessage: "No users to seed",
    successMessage: (n) => `Seeded ${n} users`,
  });

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
