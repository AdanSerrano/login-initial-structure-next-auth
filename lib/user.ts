import { auth } from "@/auth";
import { db } from "@/utils/db";

export async function currentUser() {
  const session = await auth();
  return session?.user;
}

export async function getUser() {
  const user = await currentUser();
  return user;
}

export async function getUserById(id: string) {
  const user = await db.user.findUnique({
    where: { id: id },
  });
  return user;
}

export async function getUserByEmail(email: string) {
  const user = await db.user.findUnique({
    where: { email: email },
  });
  return user;
}

export async function getUserByUserName(userName: string) {
  const user = await db.user.findUnique({
    where: { userName: userName },
  });
  return user;
};