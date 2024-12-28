// export interface Order {
//   orderId : number;
//   amount: number;
//   orderStatus: string;
//   quantity: number;
//   orderDate: string;
//   deliveryDate: string;
//   userId: number;
//   addressId: number;

import { Product } from "../sheshine/services/product.service";

 
//   paymentStatus: string;

// }
// export interface Order {
//   [x: string]: any;

//   productName: any;
//   id: number;
//   orderId: number;
//   orderStatus: string;
//   amount: number;
  
//   orderItems: { quantity: number, product: { id: number; name: string; thumbnail: string; price: number; mrp: number; suitable: string; }; }

//   product: { id: number; name: string; thumbnail: string; price: number; mrp: number; suitable: string; }
//   orderAddress: { id: number; name: string; type: string; phone: number; addressLine1: string; addressLine2: string; city: string; state:string; zip:number}
//   customer: { id: number; name: string };
//   items: Array<{ product: { name: string }; quantity: number; price: number }>;
// }
export interface Order {
  totalPrice: any;
  orderId: number;
  addressId: number;
  userId: number;
  amount: number;
  deliveryDate: string;
  orderDate: string;
  orderStatus: string;
  paymentStatus: string;
  invoiceNumber: string;

  productId?: number | null;
  products?: Product[] | null;
  quantity: number;
  orderItems: {
    product: {
      id: number;
      favorited?: boolean | null;
      rating?: number | null;
      shine?: string | null;
      sheShine?: string | null;
      name?: string;
      description?: string;
      price?: number;
      image?: string;
      suitable: string;
      thumbnail: string;
      size: string;
    };
    productId?: number | null;
    quantity: number;
    totalPrice: number;
  }[];
  // Address details
  address: {
    id: number;
    name: string;
    type: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
  };
}


export interface OrderDetails {
  userId: number;
  productId?: number | null;
  quantity: number;
  addressId: number;
  orderId: number;
  orderStatus: string;
  amount: number;
  orderDate: string;
  deliveryDate: string;
  invoiceNumber: string;

  // Array of products ordered
  orderItems: {
    productId?: number | null;
    quantity: number;
    product: {
      id: number;
      favorited?: boolean | null;
      rating?: number | null;
      shine?: string | null;
      sheShine?: string | null;
      subcategory?: string | null;
      category: string;
      mainimage: string;
      cards?: string | null;
      images?: string | null;
      threeDImages?: string | null;
      thumbnail: string;
      title?: string | null;
      name: string | null;
      benefit?: string | null;
      suitable: string ;
      description: string;
      keybenefit?: string | null;
      howToUse?: string | null;
      ingredients?: string | null;
      size?: string | null;
      mrp: number;
      price: number;
      stockQuantity?: number | null;
      discount?: number | null;
      averageRating?: number | null;
      feature?: string | null;
      trend?: string | null;
      special?: string | null;
      specialLine: string;
      color?: string | null;
      reviews?: string | null;
    };
  }[];

  // Address details
  address: {
    id: number;
    name: string;
    type: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
  };
}
