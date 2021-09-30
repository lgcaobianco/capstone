import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'
import * as middy from 'middy'

import {
  parseUserId
} from '../../auth/utils'
import * as uuid from "uuid";
import { getPresignedImageUrl } from '../../repository/album-repository'

export const handler = middy(
async (event: APIGatewayProxyEvent): Promise < APIGatewayProxyResult > => {
  const albumId = event.pathParameters.albumId
  const userId = parseUserId(event.headers.Authorization.split(" ")[1]);
  const imageId = uuid.v4();

  const signedUrl: String = await getPresignedImageUrl(
    albumId,
    imageId,
    userId
  );
  console.log("[INFO] signed url: " + signedUrl);
  

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      uploadUrl: signedUrl
    }),
  };
});