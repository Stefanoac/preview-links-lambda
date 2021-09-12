import {
  headers, handle, SUCCESS_MSG, EMPTY_BODY_ERROR_MSG,
} from '.';

test('on fail, should return 500 code', async () => {
  const fakePayload = {
    body: undefined,
  };
  // @ts-ignore next-line
  const result = await handle(fakePayload);
  expect(result).toEqual({
    body: EMPTY_BODY_ERROR_MSG,
    headers,
    statusCode: 500,
  });
});

test('on success, should log payload and return 301 code', async () => {
  global.console.log = jest.fn();
  const FAKE_PROP_CONTENT = 'oi mundo';
  const fakePayload = {
    body: JSON.stringify({
      myProp: FAKE_PROP_CONTENT,
    }),
  };
  // @ts-ignore next-line
  const result = await handle(fakePayload);

  // eslint-disable-next-line no-console
  expect(console.log).toBeCalledWith('payload', FAKE_PROP_CONTENT);
  expect(result).toEqual({
    headers,
    statusCode: 301,
    body: SUCCESS_MSG,
  });
});
