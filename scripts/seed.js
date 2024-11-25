const { db } = require("@vercel/postgres");
const { opendays } = require("../src/app/lib/placeholder-data.js");

async function seedOpendays(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS opendays (
        id UUID DEFAULT uuid_generate_v1mc() PRIMARY KEY,
        title VARCHAR(255) NOT NULL UNIQUE,
        campus VARCHAR(255) NOT NULL,
        starttime INT NOT NULL,
        endtime INT NOT NULL,
        status VARCHAR(255)
      );
    `;

    console.log(`Created "opendays" table`);

    // Insert data into the "users" table
    const insertedOpendays = await Promise.all(
      opendays.map(async (openday) => {
        return client.sql`
        INSERT INTO opendays (id, title, campus, starttime, endtime, status)
        VALUES (${openday.id}, ${openday.title}, ${openday.campus}, ${openday.starttime}, ${openday.endtime}, ${openday.status})
        ON CONFLICT (id) DO NOTHING;
      `;
      })
    );
    console.log(`Seeded ${insertedOpendays.length} opendays`);

    return {
      createTable,
      opendays: insertedOpendays,
    };
  } catch (error) {
    console.error("Error seeding opendays:", error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();
  await seedOpendays(client);
  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
