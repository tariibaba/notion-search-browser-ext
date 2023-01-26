export class AbortControllers {
  controllers: {
    [timesatmp: number]: {
      abortController: AbortController;
      query: string;
    };
  } = {};

  create(query: string): [abortController: AbortController, timestamp: number] {
    const abortController = new AbortController();
    const now = Date.now();
    // console.info(`Create ${now} ${query}`);
    this.controllers[now] = {
      abortController,
      query,
    };
    return [abortController, now];
  }

  abortPast(current: number) {
    const currentQuery = this.controllers[current].query;
    for (const [_timestamp, value] of Object.entries(this.controllers)) {
      const timestamp = Number(_timestamp);
      if (timestamp > current) {
        continue;
      } else if (timestamp === current) {
        // console.info(`Succeeded ${current} ${value.query}`);
      } else {
        console.info(
          `Abort past request: ${timestamp} ${value.query}\n` +
            `                 by ${current} ${currentQuery}`,
        );
        value.abortController.abort();
      }
      delete this.controllers[timestamp];
    }
  }
}
