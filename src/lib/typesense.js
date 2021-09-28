require('dotenv').config();
const Typesense = require('typesense');
const fetch = require('node-fetch');

(async () => {
  // Create a new client
  const client = new Typesense.Client({
    nodes: [
      {
        host: process.env.TYPESENSE_HOST,
        port: process.env.TYPESENSE_PORT,
        protocol: process.env.TYPESENSE_PROTOCOL,
      },
    ],
    apiKey: process.env.TYPESENSE_ADMIN_KEY,
    connectionTimeoutSeconds: 2,
  });

  // Delete the old posts collection if it exists
  try {
    await client.collections('posts').delete();
  } catch (error) {
    console.error('Could not delete posts collection');
  }

  // Create a post schema
  const postsSchema = {
    name: 'posts',
    fields: [
      { name: 'title', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'slug', type: 'string' },
    ],
  };

  // Create post schema
  await client.collections().create(postsSchema);

  // Retrieve data json
  const data = fetch(process.env.SEARCH_ENDPOINT).then((response) =>
    response.json()
  );

  // Loop over each item and create document
  data.then((res) => {
    for (post of res) {
      client.collections('posts').documents().create(post);
    }
  });
})().catch((err) => {
  console.error(err);
});
