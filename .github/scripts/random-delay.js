const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function randomDelay() {
  const ms = Math.floor(Math.random() * 300000 + 300000);
  await sleep(ms);
}

module.exports = randomDelay;
