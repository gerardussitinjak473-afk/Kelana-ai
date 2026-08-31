export interface User {
  id: number;
  name: string;
  email: string;
  trip_count: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}
