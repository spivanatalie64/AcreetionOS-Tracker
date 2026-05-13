async function test() {
  const response = await fetch('https://www.advocate.com/politics/transgender-law-center-sues-georgia', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      }
  });
  console.log('Status:', response.status);
}
test();
