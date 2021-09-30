import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import {findAllByUserId} from '../../repository/album-repository';
import { parseUserId } from '../../auth/utils'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("[INFO] get has been received");
    console.log(JSON.stringify(event));
    const userId = parseUserId(event.headers.Authorization.split(" ")[1]);
    console.log("[INFO] username is " + userId);
    
    const albumList = await findAllByUserId(userId);
    
    console.log("[INFO] album list received: " + JSON.stringify(albumList));

    return {
      statusCode: 200,
      body: JSON.stringify({items: albumList.Items})
    }
  });

handler.use(
  cors({
    credentials: true
  })
)
