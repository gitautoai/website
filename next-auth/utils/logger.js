- return navigator.sendBeacon(url, body);
 return fetch(url, {
  method: "POST",
  body: body,