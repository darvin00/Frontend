export interface User {
  id: number;
  name: string;
  email: string;
  mobileNumber?: string | null;  // Updated to match mobileNumber
  password: string;  // Include password
  dob?: string;  // Date of birth, optional
  gender?: string | null;  // Gender, optional and nullable
  phone?: string;  // Optional phone field (if still needed)
  address?: string;  // Optional address field
  avatarUrl?: string | null;  // Optional user profile picture
  orderHistory?: Order[];  // Optional field for order history
}
export interface Order {
  orderId: number;
  product: string;
  date: string;
  amount: number;
}



