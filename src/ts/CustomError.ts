import ExtensibleCustomError from 'extensible-custom-error';

export default class CustomError extends ExtensibleCustomError {
  constructor(message: string, error: unknown) {
    if (error instanceof Error) {
      super(message, error);
    } else {
      super(`${message}. ${JSON.stringify(error)}`);
    }
  }
}
