export const KERALA_DISTRICTS = [
  'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod',
  'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad',
  'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
];
export const MOCK_USERS = [
  // State Admin
  {
    id: 1,
    username: 'stateadmin',
    password: 'state123',
    name: 'Kerala State Admin',
    role: 'state_admin',
    region: 'Kerala',
    email: 'state.admin@kerala.gov.in',
    institution: 'Kerala Health Department'
  },
  // Cancer Center Admins
  {
    id: 2,
    username: 'rcc.admin',
    password: 'rcc123',
    name: 'RCC Trivandrum Admin',
    role: 'center_admin',
    region: 'Trivandrum',
    centerType: 'Apex',
    email: 'admin@rcc.org',
    institution: 'Regional Cancer Centre'
  },
  {
    id: 3,
    username: 'mcc.admin',
    password: 'mcc123',
    name: 'MCC Kozhikode Admin',
    role: 'center_admin',
    region: 'Kozhikode',
    centerType: 'Apex',
    email: 'admin@mcc.org',
    institution: 'Malabar Cancer Centre'
  },
  // Hospital Admins
  {
    id: 4,
    username: 'hospital1.admin',
    password: 'hosp123',
    name: 'General Hospital Admin',
    role: 'hospital_admin',
    region: 'Trivandrum',
    email: 'admin@gh.org',
    institution: 'General Hospital Trivandrum',
    reportsTo: 2 // Reports to RCC Trivandrum
  },
  {
    id: 5,
    username: 'hospital2.admin',
    password: 'hosp123',
    name: 'District Hospital Admin',
    role: 'hospital_admin',
    region: 'Kozhikode',
    email: 'admin@dh.org',
    institution: 'District Hospital Kozhikode',
    reportsTo: 3 // Reports to MCC
  },
  // Data Collectors
  {
    id: 6,
    username: 'collector1',
    password: 'data123',
    name: 'Arjun',
    role: 'data_collector',
    region: 'Trivandrum',
    institution: 'General Hospital Trivandrum',
    reportsTo: 4,
    status: 'active', //update here to change status
    registrations: 25, // Added for MIS reporting
    phone: '+91-9876543210' // Added for contact info in DataCollectorsList
  },
  {
    id: 7,
    username: 'collector2',
    password: 'data123',
    name: 'Priya K',
    role: 'data_collector',
    region: 'Trivandrum',
    institution: 'General Hospital Trivandrum',
    reportsTo: 4,
    status: 'active',
    registrations: 18,
    phone: '+91-9876543211',
    email: 'priya.k@gh.org'
  },
  {
    id: 8,
    username: 'collector3',
    password: 'data123',
    name: 'Rahul M',
    role: 'data_collector',
    region: 'Trivandrum',
    institution: 'General Hospital Trivandrum',
    reportsTo: 4,
    status: 'inactive',
    registrations: 12,
    phone: '+91-9876543212',
    email: 'rahul.m@gh.org'
  },
  {
    id: 9,
    username: 'collector4',
    password: 'data123',
    name: 'Sara Thomas',
    role: 'data_collector',
    region: 'Kozhikode',
    institution: 'District Hospital Kozhikode',
    reportsTo: 5,
    status: 'active',
    registrations: 22,
    phone: '+91-9876543213',
    email: 'sara.t@dh.org'
  },
  {
    id: 10,
    username: 'collector5',
    password: 'data123',
    name: 'Mohammed K',
    role: 'data_collector',
    region: 'Kozhikode',
    institution: 'District Hospital Kozhikode',
    reportsTo: 5,
    status: 'active',
    registrations: 15,
    phone: '+91-9876543214',
    email: 'mohammed.k@dh.org'
  }
];

export const MOCK_CANCER_CENTERS = [
  {
    id: 1,
    name: 'Regional Cancer Centre',
    type: 'Apex',
    region: 'Trivandrum',
    adminId: 2,
    status: 'active',
    established: '1981',
    contactEmail: 'contact@rcc.org',
    phone: '0471-2522244',
    address: 'Medical College Campus, Trivandrum',
    assignedDistricts: ['Thiruvananthapuram', 'Kollam', 'Pathanamthitta','Idukki']
  },
  {
    id: 2,
    name: 'Malabar Cancer Centre',
    type: 'Apex',
    region: 'Kozhikode',
    adminId: 3,
    status: 'active',
    established: '2001',
    contactEmail: 'contact@mcc.org',
    phone: '0496-2524254',
    address: 'Thalassery, Kannur',
    assignedDistricts: ['Kozhikode', 'Kannur', 'Wayanad', 'Kasargod', 'Malappuram', 'Palakkad']

  },
  {
    id: 3,
    name: 'Cochin Cancer Center',
    type: 'Apex',
    region: 'Ernakulam',
    adminId: 3,
    status: 'pending',
    established: '2023',
    contactEmail: 'contact@ccc.org',
    phone: '0484-2222244',
    address: 'Medical College Campus, Ernakulam',
    assignedDistricts: ['Thissur', 'Ernakulum', 'Aalappuzha','Kottayam']

  }
];

export const MOCK_HOSPITALS = [
  {
    id: 1,
    name: 'General Hospital Trivandrum',
    type: 'Government',
    region: 'Trivandrum',
    adminId: 4,
    reportsToCenterId: 1,
    status: 'active'
  },
  {
    id: 2,
    name: 'District Hospital Kozhikode',
    type: 'Government',
    region: 'Kozhikode',
    adminId: 5,
    reportsToCenterId: 2,
    status: 'active'
  }
];

export const MOCK_PATIENTS = [
  {
    id: 1,
    patientId: 'KL001',
    name: 'Sample_Patient One',
    age: 45,
    gender: 'Female',
    registrationDate: '2024-01-15',
    centerId: 1, // RCC Trivandrum
    hospitalId: 1, // General Hospital Trivandrum
    registeredBy: 6, // Data Collector
    status: 'verified',
    verifiedBy: 4, // Hospital Admin
    approvedBy: 2, // Center Admin
    registryForms: [
      {
        id: 1,
        formType: 'initialDiagnosis',
        primarySite: 'Breast',
        stage: 'Stage II',
        dateOfDiagnosis: '2024-01-10',
        diagnosisMethod: 'Biopsy',
        status: 'verified',
        verifiedDate: '2024-01-20'
      }
    ],
    followUps: [
      {
        id: 1,
        date: '2024-02-15',
        status: 'completed',
        findings: 'Responding to treatment',
        nextFollowUp: '2024-05-15'
      }
    ]
  },
  {
    id: 2,
    patientId: 'KL002',
    name: 'Sample_Patient Two',
    age: 62,
    gender: 'Male',
    registrationDate: '2024-01-20',
    centerId: 2, // MCC
    hospitalId: 2, // District Hospital Kozhikode
    registeredBy: 6, // Data Collector
    status: 'pending',
    registryForms: [
      {
        id: 2,
        formType: 'initialDiagnosis',
        primarySite: 'Lung',
        stage: 'Stage III',
        dateOfDiagnosis: '2024-01-18',
        diagnosisMethod: 'CT Scan, Biopsy',
        status: 'pending'
      }
    ]
  },
  {
    id: 3,
    patientId: 'KL003',
    name: 'Sample_Patient Three',
    age: 55,
    gender: 'Male',
    registrationDate: '2024-02-01',
    centerId: 1, // RCC Trivandrum
    hospitalId: 1, // General Hospital Trivandrum
    registeredBy: 6, // Data Collector
    status: 'verified',
    verifiedBy: 4, // Hospital Admin
    approvedBy: 2, // Center Admin
    registryForms: [
      {
        id: 3,
        formType: 'initialDiagnosis',
        primarySite: 'Colon',
        stage: 'Stage II',
        dateOfDiagnosis: '2024-01-25',
        diagnosisMethod: 'Colonoscopy, Biopsy',
        status: 'verified',
        verifiedDate: '2024-02-05'
      }
    ],
    followUps: []
  }
];

export const MOCK_MORTALITY_DATA = [
  {
    id: 1,
    patientId: 'KL001',
    dateOfDeath: '2024-02-20',
    cause: 'Cancer related',
    place: 'Hospital',
    centerId: 1,
    hospitalId: 1,
    reportedBy: 6,
    status: 'verified',
    verifiedBy: 4,
    approvedBy: 2,
    details: {
      primaryCause: 'Metastatic breast cancer',
      contributingFactors: ['Respiratory failure'],
      placeOfDeath: 'General Hospital Trivandrum',
      deathCertificateNumber: 'DC123456'
    }
  }
];

// This helps to link all the mock data together consistently
export const MOCK_REGISTRY_SUMMARY = {
  totalPatients: MOCK_PATIENTS.length,
  verifiedCases: MOCK_PATIENTS.filter(p => p.status === 'verified').length,
  pendingCases: MOCK_PATIENTS.filter(p => p.status === 'pending').length,
  mortalityCases: MOCK_MORTALITY_DATA.length,
  centerWiseDistribution: {
    1: MOCK_PATIENTS.filter(p => p.centerId === 1).length, // RCC cases
    2: MOCK_PATIENTS.filter(p => p.centerId === 2).length  // MCC cases
  }
};
export const MOCK_HOSPITAL_STATS = {
  registrationStats: {
    total: 150,
    verified: 120,
    pending: 30
  },
  mortalityStats: {
    total: 45,
    verified: 40
  },
  dataCollectorStats: {
    total: 10,
    active: 8
  },
  monthlyTrends: [
    { month: 'Jan', registrations: 45, mortality: 12 },
    { month: 'Feb', registrations: 52, mortality: 15 },
    { month: 'Mar', registrations: 48, mortality: 13 }
  ]
};