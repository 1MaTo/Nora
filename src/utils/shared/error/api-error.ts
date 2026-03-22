export class ApiError extends Error {
  constructor(response: Response, customMessage?: string) {
    super(customMessage || response.statusText);
    this.name = `API error ${customMessage || response.status}`;
  }
}
