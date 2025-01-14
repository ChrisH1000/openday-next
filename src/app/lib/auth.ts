import { connectToDB } from "@/app/lib/data";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export async function getUser(email: string, password: string): Promise<User | null> {
  const client = await connectToDB();
  if (!client) {
    throw new Error("Failed to connect to the database");
  }
  const db = client.db();
  const user = await db.collection<User>('users').findOne({ email, password });
  return user;
}