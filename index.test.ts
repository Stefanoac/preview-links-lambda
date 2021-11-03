import { headers, handle, EMPTY_BODY_ERROR_MSG } from '.';

const FAKE_PROP_CONTENT = 'https://www.facebook.com';
const SUCCESS_MSG:string = JSON.stringify({ title:"teste", description:null, image:null, origin:FAKE_PROP_CONTENT }, null, 2)

jest.mock('./api', () => ({ 
  get: jest.fn(() => Promise.resolve("<html><head><title>teste</title></head></html>"))
}));

jest.mock('@sentry/serverless', () => ({ 
  AWSLambda: { 
    wrapHandler: (a:any) => a, init: () => {} 
  }, 
  captureException: () => {},
  flush: () => {}
}));

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

test('on success, should log payload and return 200 code', async () => {
  const fakePayload = {
    body: JSON.stringify({
      url: FAKE_PROP_CONTENT,
    }),
  };
  // @ts-ignore next-line
  const result = await handle(fakePayload);

  expect(result).toEqual({
    headers,
    statusCode: 200,
    body: SUCCESS_MSG,
  });
});
