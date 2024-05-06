import type { Types, Document } from 'mongoose';
import { AddressInterface, SocialLinks } from './utils';

export interface TaxInformation {
  tax_id?: string;
  vat_number?: string;
}

export interface CompanyInterface extends Document {
  company_name: string;
  email: string;
  status: 'company';
  company_id: string;
  password: string;
  website?: string;
  address: AddressInterface;
  description?: string;
  logo?: string;
  cover_image?: string;
  category: string;
  parent_company?: string;
  incorporation_date: Date;
  employee_count: number;
  contact_phone: string;
  operational_status: 'active' | 'inactive' | 'restructuring' | 'bankruptcy';
  social_media: SocialLinks;
  tax_info?: TaxInformation;
}
