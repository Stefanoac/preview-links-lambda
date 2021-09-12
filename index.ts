// eslint-disable-next-line import/no-extraneous-dependencies
import { APIGatewayProxyHandler } from 'aws-lambda';

export const EMPTY_BODY_ERROR_MSG = 'Ocorreu um erro, não foi enviado nada ao servidor';
export const SUCCESS_MSG = 'Lambda bem sucedida';

export interface Body {
  myProp: string
}

export const headers = {
  'Access-Control-Allow-Origin': '*',
};

export const handle: APIGatewayProxyHandler = async ({ body }) => {
  try {
    if (!body) {
      throw new Error(EMPTY_BODY_ERROR_MSG);
    }

    const payload = JSON.parse(body) as Body;
    // eslint-disable-next-line no-console
    console.log('payload', payload.myProp);
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: err.message,
    };
  }
  return {
    headers,
    statusCode: 301,
    body: SUCCESS_MSG,
  };
};
