

type Result<T> =
  | { data: T; error: null }
  | { data: null; error: Error };


async function tryCatch<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    return { data: await promise, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e : new Error(String(e)) };
  }
}

export default tryCatch;
