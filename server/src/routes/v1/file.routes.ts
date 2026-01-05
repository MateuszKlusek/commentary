import { Router } from "express";
import { commentaryService } from "../../services/file.service";
const router: Router = Router();

router.get("/comments/count", async (req, res) => {
  const count = await commentaryService.getTopLevelCommentCount();
  res.send({ count });
});

router.get("/comments", async (req, res) => {
  const offset = parseInt(req?.query?.offset as string) || 0;
  const limit = parseInt(req?.query?.limit as string) || 10;
  const comments = await commentaryService.getTopLevelComments(offset, limit);
  res.send({ comments });
});

router.get("/replies", async (req, res) => {
  const commentId = req?.query?.commentId as string;
  const offset = parseInt(req?.query?.offset as string) || 0;
  const limit = parseInt(req?.query?.limit as string) || 10;
  const replies = await commentaryService.getReplies(commentId, offset, limit);
  console.log(replies);
  res.send({ replies });
});

export default router;
