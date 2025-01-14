import { connectToDB } from "@/app/lib/data";

export default async function Page() {
  const client = await connectToDB();
  if (!client) {
    console.error('Failed to connect to the database');
    return <p>Failed to connect to the database</p>;
  }
  const res = await client.query('SELECT * FROM users');
  const users = res.rows;
  console.log(users);
  return (
    <>
      <p>Connected to DB</p>
      <h1>Admin</h1>
      <p>Massa urna magnis dignissim id euismod porttitor vitae etiam viverra nunc at adipiscing sit morbi aliquet mauris porttitor nisi, senectus pharetra, ac porttitor orci.</p>
    </>)

}