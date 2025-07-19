import { gql } from "@apollo/client";

export const COUNTRIES_QUERY = gql`
  query Countries {
    countries {
      id
      name
      emoji
    }
  }
`;

export const STATES_QUERY = gql`
  query States($countryId: String!) {
    states(countryId: $countryId) {
      id
      name
    }
  }
`;

export const CITIES_QUERY = gql`
  query Cities($stateId: String!) {
    cities(stateId: $stateId) {
      id
      name
    }
  }
`;

export const CURRICULUMS_QUERY = gql`
  query Curriculums {
    curriculums {
      id
      name
      allowCustom
    }
  }
`;

export const SCHOOLS_QUERY = gql`
  query Schools(
    $name: String
    $limit: Int
    $offset: Int
    $accountType: BusinessModel
  ) {
    schools(
      name: $name
      limit: $limit
      offset: $offset
      accountType: $accountType
    ) {
      id
      name
      logoUrl
      contact {
        email
      }
      license {
        totalLicense
      }
      stats {
        totalTeachers
        totalStudents
      }
    }
  }
`;

export const SCHOOL_NAMES_QUERY = gql`
  query Schools($accountType: BusinessModel) {
    schools(accountType: $accountType) {
      id
      name
    }
  }
`;

export const TOTAL_SCHOOLS_QUERY = gql`
  query TotalSchools($name: String, $accountType: BusinessModel) {
    totalSchools(name: $name, accountType: $accountType)
  }
`;

export const SCHOOL_QUERY = gql`
  query School($schoolId: String!) {
    school(schoolId: $schoolId) {
      name
      logoUrl
      accountType
      address {
        country {
          id
          name
        }
        state {
          id
          name
        }
        city {
          id
          name
        }
        postalCode
        streetAddressLine1
        streetAddressLine2
        contactNumber
      }
      contact {
        name
        email
        contactNumber
      }
      license {
        totalLicense
      }
      curriculums {
        id
        name
        otherName
        allowCustom
      }
    }
  }
`;
