import ExtensibleCustomError from 'extensible-custom-error';

export default class MergeableError extends ExtensibleCustomError {
  constructor(message: string, error: unknown) {
    if (error instanceof Error) {
      super(
        `${message}${message.endsWith('.') ? '' : '.'} ${error.message}`,
        error,
      );
    } else {
      super(`${message}. ${JSON.stringify(error)}`);
    }
  }
}
