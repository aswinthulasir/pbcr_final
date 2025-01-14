export const FIELD_TYPES = {
    // I. IDENTIFYING INFORMATION
    // 1. Name of Participating Centre (red)
    centreName: 'mandatory',
    centreCode: 'mandatory',
    
    // 2. Incidence Registration Number (red)
    registrationNumber: {
      year: 'mandatory',  // First 2 digits
      regNo: 'mandatory'  // Next 5 digits
    },
    
    // 3.1 Source of Registration
    sourceRegistration: {
      name: 'mandatory',     // 3.1(a) (red)
      code: 'mandatory',     // Code (red)
      department: 'recommended',  // 3.1(b)
      departmentCode: 'recommended', 
      physician: 'recommended',   // 3.1(c)
      mobileNo: 'recommended'
    },
    
    // 3.2 Hospital Registration Number (red)
    hospitalRegNo: 'mandatory',
    
    // 3.3 Date of Registration (blue)
    dateOfRegistration: 'recommended',
    
    // 3.4 Case Registered As (blue)
    caseRegisteredAs: 'recommended',
    
    // 4. Other Sources of Registration (optional)
    otherSources: {
      code: 'optional',
      hospitalNo: 'optional',
      date: 'optional'
    },
    
    // 5. Date of First Diagnosis (red)
    dateOfFirstDiagnosis: 'mandatory',
    
    // 6.1 Full Name of Patient (red)
    fullName: {
      first: 'mandatory',    // At least one name is mandatory
      second: 'recommended',
      last: 'recommended'
    },
    
    // 6.2 Aadhaar Number (blue)
    aadhaar: 'recommended',
    
    // 7.1 Name of Relative (black)
    relativeInfo: {
      father: { 
        name: 'optional', 
        mobile: 'optional' 
      },
      mother: { 
        name: 'optional', 
        mobile: 'optional' 
      },
      spouse: { 
        name: 'optional', 
        mobile: 'optional' 
      },
      son: { 
        name: 'optional', 
        mobile: 'optional' 
      },
      daughter: { 
        name: 'optional', 
        mobile: 'optional' 
      },
      others: { 
        name: 'optional', 
        mobile: 'optional', 
        relation: 'optional' 
      }
    },
    
    // 7.2 Code of Relative (red)
    relativeCode: 'optional',
    
    // 8. Place of Residence (red)
    placeOfResidence: {
      type: 'mandatory',
      urban: {
        houseNo: 'recommended',
        roadName: 'recommended',
        areaLocality: 'recommended',
        wardNumber: 'mandatory',
        cityTown: 'recommended',
        district: 'mandatory',
        pinCode: 'mandatory'
      },
      rural: {
        houseNoAndWard: 'recommended',
        gramPanchayat: 'recommended',
        subUnitDistrict: 'recommended',
        phcName: 'recommended',
        district: 'mandatory',
        pinCode: 'mandatory'
      },
      contactInfo: {
        telephone: {
          office: 'recommended',
          residence: 'recommended'
        },
        mobile: 'recommended',
        email: 'recommended'
      }
    },
    
    // 9. Duration of Stay (red)
    durationOfStay: 'mandatory',
    
    // 10. Other Addresses (black)
    otherAddresses: {
      local: {
        address: 'optional',
        cityTownDistrict: 'optional',
        pinCode: 'optional'
      },
      office: {
        address: 'optional',
        cityTownDistrict: 'optional',
        pinCode: 'optional'
      },
      native: {
        address: 'optional',
        cityTownDistrict: 'optional',
        pinCode: 'optional'
      }
    },
    
    // 11. Place of Birth (black)
    placeOfBirth: {
      address: 'optional',
      cityTownDistrict: 'optional',
      pinCode: 'optional'
    },
    
    // 12. Age (red)
    age: 'mandatory',
    dateofBirth: 'optional',
    
    // 13. Age Estimated By (black)
    ageEstimatedBy: 'optional',
    
    // 14. Sex (red)
    sex: 'mandatory',
  
    // II. BASIC DEMOGRAPHIC PARAMETERS
    // 15. Marital Status (black/optional)
    maritalStatus: 'optional',
  
    // 16. Mother Tongue (black/optional)
    motherTongue: 'optional',
  
    // 17. Religion (black/optional)
    religion: 'optional',
    otherReligion: 'optional',
  
    // 18. Cultural Background (black/optional)
    culturalBackground: 'optional',
  
    // 19. Education (black/optional)
    education: 'optional',
  
    // III. DIAGNOSTIC DETAILS
    // 20. Diagnostic Status (black)
    diagnosticStatus: 'optional',
    
    // 21. Method of Diagnosis (red)
    methodOfDiagnosis: { 
        primaryMethod: 'mandatory', // One of: 'clinicalOnly', 'microscopic', 'xray', 'dco', 'others'
        secondaryMethod: 'mandatory', // Will be populated based on primaryMethod selection
    },
    
    // 22. Anatomical Site (black)
    anatomicalSite: 'optional',
    
    // 23. Complete Pathological Diagnosis (red)
    pathologicalDiagnosis: {
      primarySite: 'mandatory',    // 23.1 (red)
      morphology: 'mandatory',     // 23.2 (red)
      slideNo: 'recommended',      // 23.3 (blue)
      slideDate: 'recommended'     // 23.3 (blue)
    },
    
    // 24. ICD-O-3 Coding (red)
    icdCoding: {
      primarySite: 'mandatory',          // 24.1 (red)
      primaryHistology: 'mandatory',     // 24.2 (red)
      secondarySite: 'recommended',      // 24.3 (blue)
      morphologyMetastasis: 'recommended' // 24.4 (blue)
    },
    
    // 25. Site of Tumour (red)
    siteOfTumour: 'mandatory',
    
    // 26. Laterality (black)
    laterality: 'optional',
    
    // 27. Sequence (blue)
    sequence: 'recommended',
  
    // IV. DETAILS OF CLINICAL STAGE AND TREATMENT
    // 28. Clinical Extent (red)
    clinicalExtent: 'mandatory',
    
    // 29.1 Staging System (red)
    stagingSystem: 'mandatory',
    
    // 29.2 TNM (blue)
    tnm: {
      t: 'recommended',
      n: 'recommended',
      m: 'recommended'
    },
    
    // 29.3 Composite Stage (blue)
    compositeStage: 'recommended',
    
    // 30. Intention to Treat (black)
    intentionToTreat: 'optional',
    
    // 31. Cancer Directed Treatment (blue)
    cancerDirectedTreatment: {
      received: 'recommended',
      dateOfCommencement: 'recommended', // 31.1 (blue)
      typeOfTreatment: 'recommended',    // 31.2 (blue)
      dateOfCompletion: 'recommended'    // 31.3 (blue)
    },
    
    // 32. Date of Last Contact (blue)
    dateOfLastContact: 'recommended',
    
    // 33. Date of Death (blue)
    dateOfDeath: 'recommended',
    
    // 34. Mortality Registration Number (black)
    mortalityRegNo: 'optional',
    
    // 35. Person Completing Form (red)
    personCompletingForm: 'mandatory',
    dateOfCompletion: 'mandatory',
    sourceOfInformation: 'optional'
  };