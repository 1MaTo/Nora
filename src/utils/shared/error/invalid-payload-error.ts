export class InvalidPayloadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Invalid option";
    this.message = message;
  }
}
