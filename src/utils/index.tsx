export const AuthPath =
  process.env.NODE_ENV === "production"
    ? "/api/auth"
    : "http://localhost:3000/api/auth";
