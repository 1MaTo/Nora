export class UnexpectedCommandError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Unexpected error";
    this.message = message;
  }
}
