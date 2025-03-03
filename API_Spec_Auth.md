 # Authentication API Specification
 
 This document describes the authentication API implemented at app/api/auth/[...nextauth]/route.ts using NextAuth.
 
 ## Overview
 
 The API supports two HTTP methods:
 - GET: Retrieves session information and validates the current session.
 - POST: Initiates authentication flows.
 
 ## Authentication Flow
 
 The API utilizes NextAuth with the following configuration:
 
 - **Provider:** GitHub via next-auth/providers/github.
 - **JWT Generation:** When a user authenticates, a JWT token is generated using the jsonwebtoken's sign method with the HS256 algorithm and expires in 100 days.
 - **Session Callback:**
    - Augments the session object with `userId` retrieved from the token.
    - Adds `jwtToken` to the session.
 - **JWT Callback:**
    - On account update, stores `user_id` from account.providerAccountId in the token.
 
 ## Endpoint Details
 
 ### GET
 
 - **Description:** Returns the current session data including user details and the JWT token.
 
 ### POST
 
 - **Description:** Initiates the authentication process via NextAuth, setting the JWT token and user_id upon successful login.
 
 ## Configuration Parameters
 
 - **GITHUB_CLIENT_ID** and **GITHUB_CLIENT_SECRET:** Credentials for GitHub authentication.
 - **JWT_SECRET:** Secret key for signing JWT tokens.
 - **NEXTAUTH_SECRET:** Secret used by NextAuth.
 
 ## Additional Information
 
 - Debug mode is controlled by the `isPrd` flag in the configuration.
 - The same handler is exported for both GET and POST methods.
