import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma";
import { CreateUser } from "../services/userType";
import { userProps } from "./TypeuserProps";
const prisma = new PrismaClient();

export const createUser = async ({ name, email, password }: CreateUser) => {
  email = email.toLowerCase();
  const newPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) return false;

  return await prisma.user.create({
    data: {
      name,
      email,
      password: newPassword,
    },
  });
};

export const verifyUser = async ({ email, password }: userProps) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) return false;
  if (!bcrypt.compareSync(password, user.password)) return false;
  return user;
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
    },
  });
};
