import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import {
  parseUserId
} from '../../auth/utils'
import { CreateAlbumRequest } from '../../requests/create-album-request';


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise < APIGatewayProxyResult > => {
    const newAlbum: CreateAlbumRequest = JSON.parse(event.body)
    if (newAlbum.name == null || newAlbum.name.trim().length < 1) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          field: 'name',
          error: 'please input name of album!!'
        })
      };
    }
    const userId = parseUserId(event.headers.Authorization.split(" ")[1]);
    const todo = await save(newTodo, userId);
    console.log("todo created:" + JSON.stringify(todo));

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: todo
      })
    };
  });