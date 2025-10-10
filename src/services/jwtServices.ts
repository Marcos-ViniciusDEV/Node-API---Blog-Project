import { User } from "../generated/prisma";
import { createUserJWT, readJWT } from "../libs/jtw";
import { Request } from "express";
import { TokenPayload } from "../types/token-payload";
import { getUserById } from "./userServices";

export const createToken = (user: User) => {
  return createUserJWT({ id: user.id });
};

export const verifyRequest = async (req: Request) => {
  const { authorization } = req.headers;

  if (authorization) {
    const authSplit = authorization.split("Bearer ");
    if (authSplit[1]) {
      const payload = readJWT(authSplit[1]);
      // console.log(payload);
      if (payload) {
        const userId = (payload as TokenPayload).id;
        const user = await getUserById(userId);
        if (user) return user; //  RETORNA O USUÁRIO, NÃO TRUE
      }
    }
  }
  console.log(authorization?.split("Bearer ")[1]);
  return false;
};
