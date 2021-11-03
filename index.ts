// eslint-disable-next-line import/no-extraneous-dependencies
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DOMWindow, JSDOM } from 'jsdom';
import { get } from './api'
import * as Sentry from '@sentry/serverless';

export const EMPTY_BODY_ERROR_MSG = 'An error occurred, nothing was sent to the server';

export interface Body {
  url: string
}

export interface ResponseBody
{
  title?: string,
  description?: string,
  origim?: string,
  image?: string
}

export const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true, 
};

if (!process.env.IS_LOCAL)
{
  Sentry.AWSLambda.init({
    dsn: "https://af12472d38ba4259bf265f4695185696@o565813.ingest.sentry.io/5993608",
    tracesSampleRate: 1.0,
  });
}

export const handle = Sentry.AWSLambda.wrapHandler(async ({ body }:APIGatewayProxyEvent) => {
  try {
    if (!body) {
      throw new Error(EMPTY_BODY_ERROR_MSG);
    }

    const payload: Body = body && typeof body === 'object' ? body : JSON.parse(body);
    const response = await get(payload.url)
    const responseBody:ResponseBody = makeValuesResponseBody(response, payload.url)

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify(responseBody, null, 2),
    };
  } 
  catch (err) {
    Sentry.captureException(err);
    Sentry.flush(2000);

    return {
      statusCode: 500,
      headers,
      body: err.message.toString(),
    };
  }
});

function makeValuesResponseBody (data: string, url: string) {
  const dom = new JSDOM(data, {url, contentType: "text/html"} )
  const metaImage = getMetaValue(dom.window, 'image')
  const metaDescription = getMetaValue(dom.window, 'description')
  const origin = dom.window.document.location.origin
  const image = metaImage && isValidUrl(metaImage) ? metaImage : null
  
  let metaTitle = getMetaValue(dom.window, 'title')
  if (!metaTitle) {
    metaTitle = getTitle(dom.window)
  }

  return { title: metaTitle, description: metaDescription, image, origin }
}

function getMetaValue(window: DOMWindow, metaTagName: string) {
  const meta = window.document.querySelector("meta[property='og:"+metaTagName+"']")
  if (meta) return meta.getAttribute("content")
  return null;
}

function getTitle(window: DOMWindow) {
  const title = window.document.querySelector('title')
  if (!title) return null
  return title.textContent
}

function isValidUrl(url: string) {
  return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(url)
}
