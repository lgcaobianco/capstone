import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { parseUserId } from '../../auth/utils'
import { deleteOne } from '../../repository/album-repository'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const albumId = event.pathParameters.albumId
    const userId = parseUserId(event.headers.Authorization.split(" ")[1]);

    const response = await deleteOne(albumId, userId);
  
   
    console.log("[INFO] response from delete: " + JSON.stringify(response));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(true)
    }
  }
);

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
