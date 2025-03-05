export interface UserRegistration {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: "student";
}

export interface UserLogin {
  email: string;
  password: string;
}
