const FETCH_TIMEOUT = 10000; // 10 seconds
@@ -15,0 +17,5 @@
function fetchWithTimeout(resource, options = {}) {
  const { timeout = FETCH_TIMEOUT } = options;
  return Promise.race([
    fetch(resource, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
  ]);
}
@@ -30,1 +37,1 @@
-fetch(url)
fetchWithTimeout(url)
