export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: "admin" | "user";
  };
  accessToken: string;
  refreshToken: string;
}
