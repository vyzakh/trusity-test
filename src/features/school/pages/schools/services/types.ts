import type {
  BusinessType,
  MutationResponse,
  PaginationInput,
} from "@/core/services/types";

export type BaseEntity = {
  id: string;
  name: string;
};

export type Country = BaseEntity & {
  emoji: string;
};

export type CountryListResponse = {
  countries: Country[];
};

export type StateListResponse = {
  states: BaseEntity[];
};

export type CityListResponse = {
  cities: BaseEntity[];
};

export type CurriculumListResponse = {
  curriculums: (Omit<BaseEntity, "id"> & {
    id: number;
    allowCustom: boolean;
  })[];
};

export type Address = {
  streetAddressLine1: string;
  streetAddressLine2?: string;
  postalCode?: string;
  contactNumber?: string;
  city: {
    id: string;
    name: string;
  };
  state: {
    name: string;
  };
  country: {
    name: string;
  };
};

export type Contact = {
  name: string;
  email: string;
  contactNumber: string;
};

export type Curriculum = {
  id: string;
  name: string;
  allowCustom: boolean;
  otherName?: string;
};

export type License = {
  usedLicense: number;
  totalLicense: number;
};

export type School = {
  id: string;
  name: string;
  accountType: string;
  logoUrl: string;
  address: Address;
  contact: Contact;
  curriculums: Curriculum[];
  license: License;
};

export type SchoolsQueryResponse = {
  schools: School[];
  totalSchools: number;
};

export type SchoolQueryResponse = {
  school: {
    name: string;
    logoUrl: string;
    accountType: string;
    address: {
      country: {
        id: number;
        name: string;
      };
      city: {
        id: number;
        name: string;
      };
      state: {
        id: number;
        name: string;
      };
      postalCode: string;
      streetAddressLine1: string;
      streetAddressLine2: string;
      contactNumber: string;
    };
    contact: {
      name: string;
      email: string;
      contactNumber: string;
    };
    license: {
      totalLicense: number;
    };
    curriculums: {
      id: number;
      name: string;
      otherName: string;
      allowCustom: boolean;
    }[];
  };
};

export type TotalSchoolsQueryResponse = { totalSchools: number };

///MUTATION PAYLOAD AND RESPONSE

export type CreateSchoolPayload = {
  accountType: BusinessType;
  name: string;
  logoUrl: string;
  totalLicense: number;
  address: {
    streetAddressLine1: string;
    streetAddressLine2: string | null;
    cityId: string;
    stateId: string;
    countryId: string;
    postalCode: string;
    contactNumber: string;
  };
  contact: {
    name: string;
    email: string;
    contactNumber: string;
  };
  curriculums: {
    id: number | null;
    name: string | null;
  }[];
};

export type CreateB2CSchoolPayload = {
  accountType: BusinessType;
  name: string;
  address: {
    streetAddressLine1: string;
    streetAddressLine2: string | null;
    cityId: string;
    stateId: string;
    countryId: string;
    postalCode: string;
  };
};

export type SchoolsInput = PaginationInput & {
  name?: string | null;
  accountType?: BusinessType;
};

export type CreateSchoolResponse = MutationResponse<
  "createSchool",
  { school: { id: string } }
>;
export type UpdateSchoolResponse = MutationResponse<"updateSchool">;
