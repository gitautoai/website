import { config } from "@/config";
import jwt from "jsonwebtoken";

export function isValidToken(userId: string, jwtToken: string) {
  const decodedToken: any = jwt.verify(jwtToken, config.JWT_SECRET || "");
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

export function isTokenExpired(jwtToken: string) {
      name="auth-token"
  const decodedToken: any = jwt.decode(jwtToken);
  const currentTime = Math.floor(Date.now() / 1000);

  if (decodedToken && decodedToken.exp && decodedToken.exp < currentTime) {
    return true;
  }
  return false;
}
