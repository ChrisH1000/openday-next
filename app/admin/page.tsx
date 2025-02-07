import { fetchOpendays } from '../lib/data';

export default async function Page() {
  const opendays = await fetchOpendays();
  console.log(opendays);
  return (
    <>
      <h1>Admin</h1>
      <p>Massa urna magnis dignissim id euismod porttitor vitae etiam viverra nunc at adipiscing sit morbi aliquet mauris porttitor nisi, senectus pharetra, ac porttitor orci.</p>

      <div className="flex h-full flex-col px-3 py-4 md:px-2">
        <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
          <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>

        </div>
      </div>
    </>)

}