import { apiEndpoint } from '../config'
import { Album } from '../types/Album';
import { CreateAlbumRequest } from '../types/CreateAlbumRequest';
import Axios from 'axios'
import { UpdateAlbumRequest } from '../types/UpdateAlbumRequest';

export async function getAlbums(idToken: string): Promise<Album[]> {
  console.log('albums are being retrieved')

  const response = await Axios.get(`${apiEndpoint}/albums`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Albums:', response.data)
  return response.data.items
}

export async function createAlbum(
  idToken: string,
  newAlbum: CreateAlbumRequest
): Promise<Album> {
  const response = await Axios.post(`${apiEndpoint}/albums`,  JSON.stringify(newAlbum), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item;
}

export async function patchAlbum(
  idToken: string,
  albumId: string,
  updatedAlbum: UpdateAlbumRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/albums/${albumId}`, JSON.stringify(updatedAlbum), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteAlbum(
  idToken: string,
  albumId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/albums/${albumId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  albumId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/albums/${albumId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
