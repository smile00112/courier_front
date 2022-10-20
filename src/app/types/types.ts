export type RoomType = {
  _id: string;
  roomNumber: number | string;
  countReviews?: number;
  rate?: number;
  images?: Array<string>;
  price: number;
  type?: 'Стандарт' | 'Люкс';
  comforts?: Array<string>;
  bookings?: Array<string> | null;
  hasWifi?: boolean;
  hasConditioner?: boolean;
  hasWorkSpace?: boolean;
  canSmoke?: boolean;
  canPets?: boolean;
  canInvite?: boolean;
  hasWideCorridor?: boolean;
  hasDisabledAssistant?: boolean;
};
export type Client = {
  _id?: string;
  name: string;
  phone: string;
}
export type AddressData = {
  sity: string;
  streetName: string;
  streetAddress: string;
  address: string;
  entrance: string;
  floor: string;
  flat: string;
}
export type OrderProducts = {
  id: string;
  name: string;
  price: string;
  quantity: string;
}
export type OrderType = {
  _id: number;
  id: number;
  address_from: number | string;
  address_to: AddressData;
  client_id: number;  
  coordinates_from: string;
  coordinates_to: string;
  courier: CourierType; 
  description?: string
  number: number;   
  order_close_at: Date | string;   
  order_close_time: Date | string;
  deliveryTimer: string;  
  order_created_at: Date | string;   
  order_delivery_start_at: Date | string; 
  price: number; 
  status: string;
  client: Client,
  products: Array<OrderProducts>,
  delivery_price: number,
  productsTotal: number,  
  courier_id: number | null,
 // address_data: AddressData 
};
export type CourierType = {
  _id: number;
  id: number;
  last_name: string;
  otchestvo: string;
  first_name: string; 
  fio: string; 
  avatar: string | undefined;   
  coordinates: string | null; 
  score: string; 
  rating: string; 
  status: string;   
  transport: string;
  current_order: number | null,
  orders: Array<OrderTypeMini>,
  show_route: boolean,
};
export type OrderTypeMini = {
  id: number;
  address_from: number | string;
  address_to: AddressData;
  client_id: number;  
  coordinates_from: string;
  coordinates_to: string;
  number: number;   
  order_close_at: Date | string;   
  order_close_time: Date | string;
  order_created_at: Date | string;   
  order_delivery_start_at: Date | string; 
  price: number; 
  status: string;
  courier_id: number | null,
 // address_data: AddressData 
};
export type BookingType = {
  _id?: string;
  adults: number;
  babies: number;
  children: number;
  arrivalDate: Date;
  departureDate: Date;
  roomId: string;
  userId: string;
  totalPrice: number;
  expires_at?: number;
};

export type UserType = {
  _id?: string;
  firstName: string;
  secondName: string;
  subscribe?: boolean;
  birthYear: Date | number;
  avatarPhoto?: string;
  email?: string;
  password?: string;
  role: 'user' | 'admin';
  gender: 'male' | 'female';
};

export type ReviewType = {
  _id?: string;
  content: string;
  rating: number;
  roomId: string;
  userId?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
};

export type LikeType = {
  _id: string;
  reviewId: string;
  userId: string;
  created_at?: Date;
  updated_at?: Date;
};

export type SignInDataType = {
  email: string;
  password: string;
};

