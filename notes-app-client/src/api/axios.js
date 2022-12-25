import * as AxiosStatic from "axios";

export const axios = AxiosStatic.default.create({
  baseURL: "http://localhost:3001",
  headers: {
    "user-id": localStorage.userId
  }
});
