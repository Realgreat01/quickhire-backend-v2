export interface AddressInterface {
  country: string;
  alpha_code: string;
  state: string;
  area?: string;
  city: string;
  street: string;
  postal_code?: string | number;
  zip_code?: string | number;
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  hashnode?: string;
  twitch?: string;
  github?: string;
}

export interface Skills {
  name: string;
  icon: string;
}

export type JobLocationType = 'remote' | 'onsite' | 'hybrid';
export type JobType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship' | 'Voluntary';
