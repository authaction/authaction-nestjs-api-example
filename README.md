# Integration Authorization in Nestjs API using AuthAction

This is a Nestjs application demonstrating how to integrate api authorization using [AuthAction](https://app.authaction.com/) with the `jwks-rsa` library.

## Overview

This application showcases how to configure and handle authorization using AuthAction’s access token in a NestJS API. It uses JSON Web Tokens (JWT) for authentication and authorization.

## Prerequisites

Before using this application, ensure you have:

1. **Node.js and npm installed**: You can download and install them from [nodejs.org](https://nodejs.org/).

2. **Authaction API credentials**: You will need to have the `tenantDomain`, `apiIdentifier` from your Authaction account.

## Installation

1. **Clone the repository** (if applicable):

   ```bash
   git clone git@github.com:authaction/authaction-nestjs-api-example.git
   cd authaction-nestjs-api-example
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure your Authaction credentials**:

   Edit the `.env` and replace the placeholders with your AuthAction configurations.

   ```bash
   AUTHACTION_DOMAIN=authaction-tenant-domain
   AUTHACTION_AUDIENCE=authaction-api-identifier
   ```

## Usage

1. **Start the development server**:

   ```bash
   npm start
   ```

   This will start the Nestjs application on `http://localhost:3000`.

2. **Testing Authorization**:

To obtain an access token via client credentials, run the following curl command:

```bash
 curl --request POST \
--url https://your-authaction-tenant-domain/oauth/token \
--header 'content-type: application/json' \
--data '{"client_id":"your-authaction-app-clientid","client_secret":"your-authaction-app-client-secret","audience":"your-authaction-api-identifier","grant_type":"client_credentials"}'
```

Replace your-authaction-app-clientid, your-authaction-app-client-secret, and your-authaction-api-identifier with your actual AuthAction credentials.

You should receive an access token in response, which you can use to access protected routes.

You can call the public API without any authentication token. The `GET /public` endpoint can be accessed by any user or service but protected endpoint need to be called with access token.

```bash
curl --request GET \
  --url http://localhost:3000/protected \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  --header 'content-type: application/json'
```

```json
{
  "message": "This is a protected message!"
}
```

## Code Explanation

### JWT Strategy (`JwtStrategy`)

- **Overview**:
  - This service integrates JWT (JSON Web Token) authentication into the NestJS application using the `@nestjs/passport` and `passport-jwt` libraries.
  - It uses RS256 encryption with a public key retrieved dynamically from a JWKS (JSON Web Key Set) endpoint hosted by AuthAction.

#### `super()` Configuration:

- **secretOrKeyProvider**:

  - Uses `jwks-rsa` to fetch and cache the public keys from the AuthAction domain.
  - Configures the JWKS URI dynamically based on the `AUTHACTION_DOMAIN` environment variable.
  - Caches the JWKS response for performance and limits the number of requests to prevent rate-limiting issues.

- **jwtFromRequest**:

  - Extracts the JWT token from the Authorization header using the `Bearer` schema (`Authorization: Bearer <token>`).

- **issuer**:

  - Specifies the expected JWT issuer (the AuthAction domain).
  - The value is dynamically derived from `process.env.AUTHACTION_DOMAIN`.

- **audience**:

  - Specifies the expected audience of the JWT, which helps ensure that the token is intended for the current application.
  - The audience value is taken from `process.env.AUTHACTION_AUDIENCE`.

- **algorithms**:
  - Enforces the use of the `RS256` algorithm to validate the JWT signature.

#### `validate(payload)`:

- This method validates the token and extracts the payload (claims).
- The payload contains user information such as the user ID and roles.
- **Logging**: It logs the payload for debugging purposes.

---

### AppController (`AppController`)

#### `getPublicMessage()`:

- This endpoint returns a public message that is accessible without any authentication.
- No guards are applied here, meaning any request can access it.

#### `getProtectedMessage()`:

- This endpoint returns a protected message and requires the user to be authenticated.
- The `@UseGuards(AuthGuard('jwt'))` decorator ensures that only users with valid JWTs can access this route.
- The `AuthGuard('jwt')` uses the `JwtStrategy` to validate and authenticate incoming requests.

---

### Common Issues

#### **Invalid Token Errors**:

- Ensure that the token being used is signed by AuthAction using the `RS256` algorithm and contains the correct issuer and audience claims.
- Verify that the `AUTHACTION_DOMAIN` and `AUTHACTION_AUDIENCE` environment variables are correctly set.

#### **Public Key Fetching Errors**:

- If there are issues retrieving the public keys from AuthAction, check the JWKS URI and ensure your application can reach the AuthAction servers.

#### **Unauthorized Access**:

- If requests to the protected route (`/protected`) are failing, ensure that the JWT token is being correctly included in the `Authorization` header and that the token is valid.

---

### Contributing

Feel free to submit issues or pull requests if you encounter bugs or have suggestions for improvement!
