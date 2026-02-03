export class CommentaryIntegrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommentaryIntegrationError";
  }

  public static is(err: Error): err is CommentaryIntegrationError {
    return err.name === "CommentaryIntegrationError";
  }
}
