const pending: Record<string, Promise<any>> = {};

function dedupe<T>(
  identifier: string,
  _args: any,
  promiseFactory: () => Promise<T>
): Promise<T> {
  if (!pending[identifier]) {
    pending[identifier] = promiseFactory().finally(() => {
      delete pending[identifier];
    });
  }
  return pending[identifier];
}

export default dedupe;
