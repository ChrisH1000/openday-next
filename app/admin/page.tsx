import { getUser } from "@/app/lib/auth";

export default async function Page() {
  const user = await getUser('user@openday.com', '123456');
  console.log(user);
  return (
    <>
      <p>Connected to DB</p>
      <h1>Admin ${user?.name}</h1>
      <p>Massa urna magnis dignissim id euismod porttitor vitae etiam viverra nunc at adipiscing sit morbi aliquet mauris porttitor nisi, senectus pharetra, ac porttitor orci.</p>
    </>)

}