/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { isValidToken } from "./is-valid-token";
import jwt from "jsonwebtoken";
import { config } from "@/config";

// Mock config to have a consistent secret for tests
jest.mock("@/config", () => ({
  config: {
    JWT_SECRET: "test-secret",
  },
}));

describe("isValidToken", () => {
  const userId = "user-123";
  const secret = "test-secret";

  // ===== solitary =====
  describe("solitary", () => {
    const token = "mock-token";

    beforeEach(() => {
      jest.spyOn(jwt, "verify").mockClear();
    });

    afterEach(() => {
      (jwt.verify as jest.Mock).mockRestore();
    });

    it("should return true for a valid token with correct userId and not expired", () => {
      // Verify that a token with correct userId, iat in past and exp in future returns true
      const currentTime = Math.floor(Date.now() / 1000);
      const decodedToken = {
        id: userId,
        iat: currentTime - 10,
        exp: currentTime + 10,
      };
      jest.spyOn(jwt, "verify").mockReturnValue(decodedToken as any);

      const result = isValidToken(userId, token);
      expect(result).toBe(true);
      expect(jwt.verify).toHaveBeenCalledWith(token, secret);
    });

    it("should return false if userId does not match", () => {
      // Verify that a token with a different userId returns false
      const currentTime = Math.floor(Date.now() / 1000);
      const decodedToken = {
        id: "wrong-user",
        iat: currentTime - 10,
        exp: currentTime + 10,
      };
      jest.spyOn(jwt, "verify").mockReturnValue(decodedToken as any);

      const result = isValidToken(userId, token);
      expect(result).toBe(false);
    });

    it("should return false if token is expired", () => {
      // Verify that a token with exp in the past returns false
      const currentTime = Math.floor(Date.now() / 1000);
      const decodedToken = {
        id: userId,
        iat: currentTime - 20,
        exp: currentTime - 10,
      };
      jest.spyOn(jwt, "verify").mockReturnValue(decodedToken as any);

      const result = isValidToken(userId, token);
      expect(result).toBe(false);
    });

    it("should return false if token iat is in the future", () => {
      // Verify that a token with iat in the future returns false
      const currentTime = Math.floor(Date.now() / 1000);
      const decodedToken = {
        id: userId,
        iat: currentTime + 10,
        exp: currentTime + 20,
      };
      jest.spyOn(jwt, "verify").mockReturnValue(decodedToken as any);

      const result = isValidToken(userId, token);
      expect(result).toBe(false);
    });

    it("should return false if jwt.verify throws", () => {
      // Verify that any error thrown by jwt.verify is caught and returns false
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const result = isValidToken(userId, "invalid-token");
      expect(result).toBe(false);
    });

    it("should return false if decoded token is missing expected fields", () => {
      // Verify that a token missing exp or iat returns false
      const decodedToken = {
        id: userId,
        // exp missing
        iat: Math.floor(Date.now() / 1000) - 10,
      };
      jest.spyOn(jwt, "verify").mockReturnValue(decodedToken as any);

      const result = isValidToken(userId, token);
      expect(result).toBe(false);
    });
  });

  // ===== sociable =====
  describe("sociable", () => {
    it("should return true for a real signed token that is valid", () => {
      // Verify that a real JWT signed with the secret and correct payload is accepted
      const currentTime = Math.floor(Date.now() / 1000);
      const token = jwt.sign(
        { id: userId, iat: currentTime - 10, exp: currentTime + 10 },
        secret
      );

      const result = isValidToken(userId, token);
      expect(result).toBe(true);
    });

    it("should return false for a real signed token with wrong userId", () => {
      // Verify that a real JWT with wrong userId is rejected
      const currentTime = Math.floor(Date.now() / 1000);
      const token = jwt.sign(
        { id: "wrong-user", iat: currentTime - 10, exp: currentTime + 10 },
        secret
      );

      const result = isValidToken(userId, token);
      expect(result).toBe(false);
    });

    it("should return false for a real signed token that is expired", () => {
      // Verify that a real expired JWT is rejected
      const currentTime = Math.floor(Date.now() / 1000);
      const token = jwt.sign(
        { id: userId, iat: currentTime - 20, exp: currentTime - 10 },
        secret
      );

      const result = isValidToken(userId, token);
      expect(result).toBe(false);
    });

    it("should return false for a token signed with a different secret", () => {
      // Verify that a JWT signed with a different secret is rejected
      const currentTime = Math.floor(Date.now() / 1000);
      const token = jwt.sign(
        { id: userId, iat: currentTime - 10, exp: currentTime + 10 },
        secret + "-wrong"
      );

      const result = isValidToken(userId, token);
      expect(result).toBe(false);
    });

    it("should return false for a completely invalid token string", () => {
      // Verify that a non-JWT string is rejected
      const result = isValidToken(userId, "not-a-token");
      expect(result).toBe(false);
    });
  });
});
