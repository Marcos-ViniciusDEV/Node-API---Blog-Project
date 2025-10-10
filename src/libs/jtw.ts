import jwt from "jsonwebtoken";

export const createUserJWT = (playload: any) => {
  return jwt.sign(playload, process.env.JWT_KEY as string);
};

export const readJWT = (hash: string) => {
  try {
    return jwt.verify(hash, process.env.JWT_KEY as string);
  } catch (err) {
    return false;
  }
};
