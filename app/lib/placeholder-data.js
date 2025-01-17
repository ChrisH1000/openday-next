const opendays = [
  {
    id: "a5e08164-b12b-4e72-9191-2f7daadb4e88",
    title: "ECU South West, Bunbury",
    campus: "South West",
    starttime: 1679796000,
    endtime: 1679806800,
    status: "live"
  },
  {
    id: "6bd38af3-8a95-4a7a-add7-fd69c6b8f124",
    title: "Joondalup Campus",
    campus: "Joondalup",
    starttime: 1680400800,
    endtime: 1680418800,
    status: "live"
  },
  {
    id: "836b0611-e82e-4b5e-8ab9-8e9f98e43549",
    title: "Mount Lawley Campus",
    campus: "Mount Lawley",
    starttime: 1682820000,
    endtime: 1682838000,
    status: "live"
  }
];

const events = [
  {
    id: "87bdf8ab-f660-490b-bd85-bb0121c2de7a",
    title: "School of Business and Law drop-in session",
    description: "Come and chat to us about courses and careers in Business or Law.",
    interests: "Business & Law,Business,Law",
    openday_fk: "a5e08164-b12b-4e72-9191-2f7daadb4e88"
  },
  {
    id: "7e7f7c0a-d02b-4021-ad76-c70891c49138",
    title: "Health Science Course Information",
    description: "Explore how majors in Health Promotion, Nutrition, Occupational & Environmental Health & Safety, and Occupational Safety & Health lead to diverse career opportunities.",
    interests: "Medical & Health Sciences,Health Science,Nutrition & Dietetics,Occupational Health & Safety,Public Health",
    openday_fk: "a5e08164-b12b-4e72-9191-2f7daadb4e88"
  },
  {
    id: "7f62c50c-b2b9-40c4-aaca-f55db39f02ed",
    title: "Hand hygiene with the Glitter Bug",
    description: "How clean are your hands? Check them out with the special UV Glitter Bug!",
    interests: "Nursing & Midwifery",
    openday_fk: "a5e08164-b12b-4e72-9191-2f7daadb4e88"
  }
];

const sessions = [
  {
    id: "ef63d799-8001-4eb3-930a-c8a462617189",
    starttime: 1679796000,
    endtime: 1679797800,
    event_fk: "87bdf8ab-f660-490b-bd85-bb0121c2de7a"
  },
  {
    id: "4888d744-c66a-475d-93ca-f9999732dbf0",
    starttime: 1679796000,
    endtime: 1679797800,
    event_fk: "7e7f7c0a-d02b-4021-ad76-c70891c49138"
  },
  {
    id: "1406a2e7-4c7c-4c56-80db-c4d7908ffaf7",
    starttime: 1679796000,
    endtime: 1679797800,
    event_fk: "7f62c50c-b2b9-40c4-aaca-f55db39f02ed"
  },
  {
    id: "aa821652-0283-4bef-8503-7ce5413a0232",
    starttime: 1679797800,
    endtime: 1679799600,
    event_fk: "7f62c50c-b2b9-40c4-aaca-f55db39f02ed"
  }
];

const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@openday.com',
    password: '123456',
    admin: true
  },
];

module.exports = {
  opendays,
  events,
  sessions,
  users
};
