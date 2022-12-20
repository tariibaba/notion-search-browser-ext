export class RecordError extends Error {
  data: object;
  constructor(message: string, data: object) {
    super(message);
    this.name = this.constructor.name;
    this.data = data;
  }
}

export class RecordNotFoundError extends RecordError {}

export class RecordTypeError extends RecordError {}
