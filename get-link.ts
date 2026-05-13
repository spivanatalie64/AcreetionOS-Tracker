import { fetchAllFeeds } from './src/lib/fetchFeeds';

async function run() {
  const items = await fetchAllFeeds();
  console.log("Found:", items[0].link);
}
run();
