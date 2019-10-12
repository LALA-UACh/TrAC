export const AuthPath =
  process.env.NODE_ENV === "production"
    ? "/api/auth"
    : "http://localhost:3000/api/auth";
export { default as Track } from "./Tracking";
export * from "./Tracking";
