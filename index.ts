// eslint-disable-next-line import/no-extraneous-dependencies
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DOMWindow, JSDOM } from 'jsdom';
import axios, { AxiosResponse } from 'axios';
import https from 'https';

export const EMPTY_BODY_ERROR_MSG = 'Ocorreu um erro, não foi enviado nada ao servidor';
export const SUCCESS_MSG = 'Lambda bem sucedida';

export interface Body {
  url: string
}

export const headers = {
  'Access-Control-Allow-Origin': '*',
};

const api = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false,
  }),
  timeout: 5000,
});

export const handle: APIGatewayProxyHandler = async ({ body, ...rest }) => {
  try {
    if (!body) {
      throw new Error(EMPTY_BODY_ERROR_MSG);
    }

    const payload: Body = body && typeof body === 'object' ? body : JSON.parse(body);

    const response = await api.get<string>(payload.url)
    const responseBody = makeValuesResponseBody(response, payload.url)
    
    return {
      headers,
      statusCode: 200,
      body: responseBody,
    };
  } 
  catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: err.toString(), input: rest}, null, 2),
    };
  }
};

function makeValuesResponseBody (response: AxiosResponse<string>, url: string) {
  const dom = new JSDOM(response.data, {url, contentType: "text/html"} )
  const metaImage = getMetaValue(dom.window, 'image')
  const metaDescription = getMetaValue(dom.window, 'description')
  const origin = dom.window.document.location.origin
  const image = metaImage && isValidUrl(metaImage) ? metaImage : null
  
  let metaTitle = getMetaValue(dom.window, 'title')
  if (!metaTitle) {
    metaTitle = getTitle(dom.window)
  }

  return JSON.stringify({
      title: metaTitle, description: metaDescription, image, origin 
    }, null, 2)
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