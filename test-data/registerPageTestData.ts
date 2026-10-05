import path from "node:path";
export interface RegisterFormData {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  ssn: string;
  username: string;
}
export const registerFormData: RegisterFormData = {
  firstName: "zee",
  lastName: "Taylor",
  street: "123 Main Street",
  city: "Beverly Hills",
  state: "California",
  zipCode: "90210",
  phoneNumber: "5551234567",
  ssn: "123456789",
  username: "zeeTaylor",
};
export const registerPassword = "TestPassword123!";
export const MAX_RETRIES = 3;
export const registerUrl =
  "https://parabank.parasoft.com/parabank/register.htm";
export const authFile = path.join(process.cwd(), "playwright/.auth/user.json");
