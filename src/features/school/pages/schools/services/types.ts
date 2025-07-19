import type {
  BusinessType,
  MutationResponse,
  PaginationInput,
} from "@/core/services/types";

export type BaseEntity = {
  id: string;
  name: string;
};

export type NumericEntity = {
  id: number;
  name: string;
};

export type Country = BaseEntity & {
  emoji: string;
};

// List response types
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
  curriculums: (NumericEntity & {
    allowCustom: boolean;
  })[];
};

// Common address components
type BaseLocation = {
  id: number;
  name: string;
};

type SimpleLocation = {
  name: string;
};

// Address types
export type Address = {
  streetAddressLine1: string;
  streetAddressLine2?: string;
  postalCode?: string;
  contactNumber?: string;
  city: Pick<BaseEntity, "id" | "name">;
  state: SimpleLocation;
  country: SimpleLocation;
};

export type DetailedAddress = {
  country: BaseLocation;
  city: BaseLocation;
  state: BaseLocation;
  postalCode: string;
  streetAddressLine1: string;
  streetAddressLine2: string;
  contactNumber: string;
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

export type DetailedCurriculum = {
  id: number;
  name: string;
  otherName: string;
  allowCustom: boolean;
};

export type License = {
  usedLicense: number;
  totalLicense: number;
};

export type SimpleLicense = {
  totalLicense: number;
};

export type BasicSchool = {
  id: string;
  name: string;
};

export type School = BasicSchool & {
  accountType: string;
  logoUrl: string;
  address: Address;
  contact: Contact;
  curriculums: Curriculum[];
  license: License;
  stats: {
    totalTeachers: number;
    totalStudents: number;
  };
};

export type SchoolDetails = {
  name: string;
  logoUrl: string;
  accountType: BusinessType;
  address: DetailedAddress;
  contact: Contact;
  license: SimpleLicense;
  curriculums: DetailedCurriculum[];
};

export type SchoolsQueryResponse = {
  schools: School[];
  totalSchools: number;
};

export type SchoolNamesQueryResponse = {
  schools: BasicSchool[];
};

export type SchoolQueryResponse = {
  school: SchoolDetails;
};

export type TotalSchoolsQueryResponse = {
  totalSchools: number;
};

type AddressPayload = {
  streetAddressLine1: string;
  streetAddressLine2: string | null;
  cityId: string;
  stateId: string;
  countryId: string;
  postalCode: string;
};

type DetailedAddressPayload = AddressPayload & {
  contactNumber: string;
};

type CurriculumPayload = {
  id: number | null;
  name: string | null;
};

export type CreateB2BSchoolPayload = {
  accountType: BusinessType;
  name: string;
  logoUrl: string;
  totalLicense: number;
  address: DetailedAddressPayload;
  contact: Contact;
  curriculums: CurriculumPayload[];
};

export type CreateB2CSchoolPayload = {
  name: string;
  accountType: BusinessType;
  address: AddressPayload;
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
