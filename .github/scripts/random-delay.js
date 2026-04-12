const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function randomDelay() {
  const ms = Math.floor(Math.random() * 10000 + 5000);
  await sleep(ms);
}

module.exports = randomDelay;
