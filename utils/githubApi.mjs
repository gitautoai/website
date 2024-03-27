// https://api.github.com/users/nikitamalinov/orgs
import jwt from "jsonwebtoken";
import fs from "fs";
const GITHUB_APP_ID = "GITHUB_APP_ID";

function createJwt() {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const payload = {
    iat: now, // Issued at time
    exp: now + 600, // JWT expires in 10 minutes
    iss: GITHUB_APP_ID, // Issuer
  };
  const privateKey = fs.readFileSync("utils/local.pem", "utf8");
  return jwt.sign(payload, privateKey, {
    algorithm: "RS256",
  });
}

const token = createJwt();
fetch("https://api.github.com/users/nikitamalinov/orgs", {
  headers: {
    Accept: "application/vnd.github.v3+json",
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => {
    if (!response.ok) {
      console.error(response);
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    // Use the data as needed
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });
