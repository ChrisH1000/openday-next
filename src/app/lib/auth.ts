import { connectToDB } from "@/app/lib/data";
// import bcrypt from 'bcrypt';

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
  const query = 'SELECT * FROM users WHERE email = $1';
  // const hashedPassword = await bcrypt.hash(password, 10);
  const values = [email];
  console.log(values);
  const res = await client.query(query, values);
  await client.end(); // Close the database connection
  console.log(res);
  const user = res.rows[0];
  console.log(user);
  return user;
}