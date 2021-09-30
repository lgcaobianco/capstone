/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateAlbumRequest {
  name: string;
  releaseDate: string;
  done: boolean;
}