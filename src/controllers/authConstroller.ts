import { RequestHandler, Response } from "express";
import { z } from "zod";
import { createUser, verifyUser } from "../services/userServices";
import { createToken } from "../services/jwtServices";
import { userProps } from "../services/TypeuserProps";
import { ExtendedRequest } from "../types/extended-request";

export const signup: RequestHandler = async (req, res) => {
  const schemaZ = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  });

  const data = schemaZ.safeParse(req.body);
  if (!data.success) {
    res.json({ error: data.error.flatten().fieldErrors });
    return;
  }

  const newUser = await createUser(data.data);

  if (!newUser) {
    res.json({ error: " erro ao criar usúario" });
    return;
  }

  const token = createToken(newUser);

  res.status(201).json({ user: { id: newUser.id, email: newUser.email }, token });
};

export const signin: RequestHandler = async (req, res) => {
  const schemaZ = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const data = schemaZ.safeParse(req.body);

  if (!data.success) {
    res.json({ error: data.error.flatten().fieldErrors });
    return;
  }

  const user = await verifyUser(data.data);

  if (!user) {
    res.json({
      error: "Acesso Negado",
    });
    return;
  }

  const token = createToken(user);

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  });
};

export const validate = (req: ExtendedRequest, res: Response) => {
  res.json({ login: "Com sucesso" });
};
