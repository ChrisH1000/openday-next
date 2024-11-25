import { connectToDB } from "@/app/lib/data";

export default async function Page() {
  const client = await connectToDB();
  return (
    <>
      {client && <p>Connected to DB</p>}
      <h1>Admin</h1>
      <p>Massa urna magnis dignissim id euismod porttitor vitae etiam viverra nunc at adipiscing sit morbi aliquet mauris porttitor nisi, senectus pharetra, ac porttitor orci.</p>
    </>)

}