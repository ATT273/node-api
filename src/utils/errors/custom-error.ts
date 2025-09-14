export class HttpError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code || "error";

    // Fix prototype chain for `instanceof` to work
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
