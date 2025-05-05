export interface CustomUser {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    role: "admin" | "user";
  }
  
  export interface UserState {
    currentUser: CustomUser | null;
  }
  