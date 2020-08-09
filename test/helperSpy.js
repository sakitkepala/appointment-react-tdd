export const responFetchOk = body =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(body)
    });

export const responFetchError = () => Promise.resolve({ ok: false });

export const bodyRequestnya = spyFetch => JSON.parse(spyFetch.mock.calls[0][1].body);
