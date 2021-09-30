import * as AWS from "aws-sdk";
import { CreateAlbumRequest } from '../requests/create-album-request';
import { Album } from '../models/album';
import * as uuid from "uuid";
import { UpdateAlbumRequest } from '../requests/update-album-request';


const tableName = 'Album-dev';
const indexName = 'AlbumUserIndex'

export function findAllByUserId(userId: String) {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  return documentClient.query({
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId
      }
    })
    .promise();
}

export async function save(albumRequest: CreateAlbumRequest, userId: string) {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const album = { ...albumRequest } as Album;
  album.albumId = uuid.v4();
  album.userId = userId;
  album.createdAt = new Date().toISOString();
  await documentClient
    .put({
      TableName: tableName,
      Item: album,
    })
    .promise();

  return album;
}

export function update(id: String, albumUpdated: UpdateAlbumRequest, userId: String) {
  console.log(`Id to be used in update item: ${id}. user id received was: ${userId}`)
  const documentClient = new AWS.DynamoDB.DocumentClient();
  return documentClient.update({
    TableName: tableName,
    Key: {
      "albumId": id,
      "userId": userId
    },
    UpdateExpression: "set #name = :n, #releaseDate = :due, #done = :d",
    ExpressionAttributeValues: {
      ":n": albumUpdated.name,
      ":due": albumUpdated.releaseDate,
      ":d": albumUpdated.done,
    },
    ExpressionAttributeNames: {
      "#name": "name",
      "#releaseDate": "releaseDate",
      "#done": "done",
    },
  }).promise();
}

export async function deleteOne(id: string, userId: string) {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  await documentClient.delete({
    TableName: tableName,
    Key: {
      "albumId": id,
      "userId": userId
    },
    ConditionExpression: 'albumId = :albumId',
    ExpressionAttributeValues: {
      ':albumId': id
    }
  }).promise();
}



export async function getPresignedImageUrl(
  albumId: String,
  imageId: String,
  userId: String
): Promise < string > {

  console.log(`albumId: ${albumId} - imageId: ${imageId} - userId: ${userId}`)
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const s3 = new AWS.S3({signatureVersion: 'v4'});
  const attachmentUrl = await s3.getSignedUrl("putObject", {
    Bucket: '1523563-serverless-udagram-images-dev',
    Key: imageId,
    Expires: 300,
  });
  console.log(`Attachment url received was ${attachmentUrl}`);
  await documentClient.update({
      TableName: tableName,
      Key: {
        "albumId": albumId,
        "userId": userId
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
        ":attachmentUrl": `https://1523563-serverless-udagram-images-dev.s3.amazonaws.com/${imageId}`,
      },
    }).promise();
  return attachmentUrl;
}