export interface AccountDetails {
  name: string;
  surname: string;
  phone: string;
  email: string;
  logo: File | null; // Allow both File and null
}
