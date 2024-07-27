import { ApiPath, api } from "./client";

type User = {
  id: string;
  username: string;
};

export async function login(username: string, password: string): Promise<User> {
  const user = await api
    .post(`${ApiPath.Auth}/login`, {
      json: { username, password },
      credentials: "include",
    })
    .json<User>();

  console.log(user);

  return user;
}

export async function me(): Promise<User> {
  const user = await api
    .get(`${ApiPath.Auth}/me`, {
      credentials: "include",
    })
    .json<User>();

  console.log(user);

  return user;
}
