import { Document, Types } from 'mongoose';

export interface User {
  id: Types.ObjectId | string;
  _id?: Types.ObjectId | string;
  username?: string;
  iat?: number;
  verification_code?: number;
  email?: string;
  fullname?: string;
  firstname?: string;
  lastname?: string;
}

interface AddressInterface {
  country: string;
  state: string;
  area: string;
  city: string;
  street: string;
  postal_code: string | number;
  zip_code: string | number;
}
export type CountryInterface = 'NG' | 'ES' | 'GB' | 'US' | 'FR' | 'CA' | 'IT' | 'DE';
interface Geolocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}
export interface Notifications {
  title: string;
  body: string;
  _id: Types.ObjectId;
  created_at: Date;
  is_read: boolean;
  notification_type: 'general' | 'updates' | 'security';
}
export interface UserInterface extends Document {
  // BASIC DETAILS
  firstname: string;
  lastname: string;
  email: string;
  about: string;
  password: string;
  username: string;
  default_country: CountryInterface;
  current_country: CountryInterface;
  // PEROSNAL DETAILS
  address: AddressInterface;
  phone_number: string;
  gender: 'male' | 'female' | 'others';
  profile_picture: string;
  date_of_birth: Date;
  profession: string;
  hobbies: string[];
  interest: string[];
  about_me: string;

  // ACCOUNT STATUS
  is_verified_email: boolean;
  profile_completed: boolean;
  allow_notifications: boolean;
  notifications: Notifications[];
  last_seen: Date;
  location: Geolocation;
  is_online: boolean;
  is_verified: boolean;
  visa_tokens: number;
  visa_expiration_date: Date;
  device_token: string;
  friends: Types.ObjectId[];
  communities: Types.ObjectId[];
  pending_friends: {
    sender: Types.ObjectId;
    status: 'sent' | 'received';
  }[];
  account_type: 'public' | 'private';
  role: 'user' | 'admin' | 'super_admin';
}
export interface CommunityInterface extends Document {
  community_name: string;
  community_id: string;
  community_members: Types.ObjectId[];
  community_description: string;
  community_communities: Types.ObjectId[];
  community_type: 'general' | 'country' | 'communities' | 'announcement';
  community_country: CountryInterface;
  community_admins: Types.ObjectId[];
  community_privacy: 'public' | 'private';
  community_icon: string;
}

export interface MessageInterface extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  message: string;
  message_type: 'text' | 'audio' | 'image' | 'video' | 'voice' | 'document';
}
