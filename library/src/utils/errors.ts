export class CommentaryIntegrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommentaryIntegrationError";
  }

  public static is(err: Error): err is CommentaryIntegrationError {
    return err.name === "CommentaryIntegrationError";
  }
}

export class PayloadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PayloadValidationError";
  }

  public static is(err: Error): err is PayloadValidationError {
    return err.name === "PayloadValidationError";
  }
}
