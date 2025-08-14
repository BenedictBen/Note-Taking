export interface Note {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export type ApiError = {
  message: string;
  status?: number;
};