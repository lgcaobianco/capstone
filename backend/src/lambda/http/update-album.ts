import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'


import { parseUserId } from '../../auth/utils'
import { update } from '../../repository/album-repository'
import { UpdateAlbumRequest } from '../../requests/update-album-request';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const albumId = event.pathParameters.albumId
    const updatedAlbum: UpdateAlbumRequest = JSON.parse(event.body)
    console.log(`album id received: ${albumId}`)
    console.log(`album id received: ${JSON.stringify(updatedAlbum)}`)
    
    const userId = parseUserId(event.headers.Authorization.split(" ")[1]);
    console.log(`userId id received: ${userId}`)

    const response = update(albumId, updatedAlbum, userId);

    console.log("[INFO] response from update: " + JSON.stringify(response));

    return {
      statusCode: 200,  
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(response)
    };
  });

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
