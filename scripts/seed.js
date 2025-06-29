const { db } = require("@vercel/postgres");
const { opendays, events, sessions, users } = require("../app/lib/placeholder-data.js");
const bcrypt = require("bcrypt");

async function seedOpendays(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS openday (
        id UUID DEFAULT uuid_generate_v1mc() PRIMARY KEY,
        title VARCHAR(255) NOT NULL UNIQUE,
        campus VARCHAR(255) NOT NULL,
        starttime INT NOT NULL,
        endtime INT NOT NULL,
        status VARCHAR(255)
      );
    `;

    console.log(`Created "openday" table`);

    // Insert data into the "users" table
    const insertedOpendays = await Promise.all(
      opendays.map(async (openday) => {
        return client.sql`
        INSERT INTO openday (id, title, campus, starttime, endtime, status)
        VALUES (${openday.id}, ${openday.title}, ${openday.campus}, ${openday.starttime}, ${openday.endtime}, ${openday.status})
        ON CONFLICT (id) DO NOTHING;
      `;
      })
    );
    console.log(`Seeded ${insertedOpendays.length} opendays`);

    return {
      createTable,
      openday: insertedOpendays,
    };
  } catch (error) {
    console.error("Error seeding opendays:", error);
    throw error;
  }
}

async function seedEvents(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS event (
        id UUID DEFAULT uuid_generate_v1mc() PRIMARY KEY,
        title VARCHAR(255) NOT NULL UNIQUE,
        description VARCHAR(255) NOT NULL,
        interests VARCHAR(255) NOT NULL,
        openday_fk UUID REFERENCES openday(id) ON DELETE CASCADE
      );
    `;

    console.log(`Created "event" table`);

    // Insert data into the "users" table
    const insertedEvents = await Promise.all(
      events.map(async (event) => {
        return client.sql`
        INSERT INTO event (id, title, description, interests, openday_fk)
        VALUES (${event.id}, ${event.title}, ${event.description}, ${event.interests}, ${event.openday_fk})
        ON CONFLICT (id) DO NOTHING;
      `;
      })
    );
    console.log(`Seeded ${insertedEvents.length} events`);

    return {
      createTable,
      event: insertedEvents,
    };
  } catch (error) {
    console.error("Error seeding events:", error);
    throw error;
  }
}

async function seedSessions(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS session (
        id UUID DEFAULT uuid_generate_v1mc() PRIMARY KEY,
        starttime INT NOT NULL,
        endtime INT NOT NULL,
        event_fk UUID REFERENCES event(id) ON DELETE CASCADE
      );
    `;

    console.log(`Created "session" table`);

    // Insert data into the "users" table
    const insertedSessions = await Promise.all(
      sessions.map(async (session) => {
        return client.sql`
        INSERT INTO session (id, starttime, endtime, event_fk)
        VALUES (${session.id}, ${session.starttime}, ${session.endtime}, ${session.event_fk})
        ON CONFLICT (id) DO NOTHING;
      `;
      })
    );
    console.log(`Seeded ${insertedSessions.length} sessions`);

    return {
      createTable,
      session: insertedSessions,
    };
  } catch (error) {
    console.error("Error seeding sessions:", error);
    throw error;
  }
}

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        admin BOOLEAN DEFAULT FALSE
      );
    `;

    console.log(`Created "user" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password, admin)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.admin})
        ON CONFLICT (id) DO NOTHING;
      `;
      })
    );
    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      user: insertedUsers,
    };
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();
  await seedOpendays(client);
  await seedEvents(client);
  await seedSessions(client);
  await seedUsers(client);
  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
