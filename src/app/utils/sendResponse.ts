import { Response } from "express";

interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface ISendResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: IMeta;
}

const sendResponse = <T>(res: Response, data: ISendResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data,
  });
};

export default sendResponse;
