export interface Address {
  id?: number;
  user?: number; // User ID as a number
  name: string;
  type: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
}
