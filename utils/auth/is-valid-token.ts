import { config } from "@/config";
import jwt from "jsonwebtoken";

type DecodedToken = {
  id: string;
  exp: number;
  iat: number;
};

export function isValidToken(userId: string, jwtToken: string) {
  const decodedToken = jwt.verify(jwtToken, config.JWT_SECRET || "") as DecodedToken;
  const currentTime = Math.floor(Date.now() / 1000);

  if (
    decodedToken &&
    decodedToken.exp &&
    decodedToken.exp > currentTime &&
    decodedToken.iat &&
    decodedToken.iat < currentTime &&
    decodedToken.id === userId
  ) {
    return true;
  }

  return false;
}
