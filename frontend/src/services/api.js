import { axiosInstance } from './authMiddleware';
import { MOCK_USERS, MOCK_CANCER_CENTERS, MOCK_HOSPITALS, MOCK_PATIENTS, MOCK_MORTALITY_DATA } from './mockData';

const isDevelopment = process.env.NODE_ENV === 'development';

export const api = {
  // Auth Methods
  login: async (username, password) => {
    if (isDevelopment) {
      const user = MOCK_USERS.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        const { password, ...userWithoutPassword } = user;
        const token = `mock_token_${user.id}`;
        const refreshToken = `mock_refresh_${user.id}`;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        
        return {
          success: true,
          user: userWithoutPassword,
          token,
          refreshToken
        };
      }
      return { success: false, message: 'Invalid credentials' };
    }

    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      return response.data;
    } catch (error) {
      return api.handleError(error);
    }
  },

  // State Admin Methods
  getApprovedCenters : async () => {
    if (isDevelopment) {
      const approvedCenters = MOCK_CANCER_CENTERS
        .filter(center => center.status === 'active' || center.status === 'approved')
        .map(center => {
          const admin = MOCK_USERS.find(u => u.id === center.adminId);
          return {
            ...center,
            adminName: admin?.name,
            contactEmail: center.contactEmail || admin?.email
          };
        });
      return { success: true, data: approvedCenters };
    }
  
    try {
      const response = await axiosInstance.get('/state-admin/approved-centers');
      return response.data;
    } catch (error) {
      return api.handleError(error);
    }
  },
  getPendingCenters: async () => {
    if (isDevelopment) {
      const pendingCenters = MOCK_CANCER_CENTERS.filter(
        center => center.status === 'pending'
      );
      return { success: true, data: pendingCenters };
    }

    try {
      const response = await axiosInstance.get('/state-admin/pending-centers');
      return response.data;
    } catch (error) {
      return api.handleError(error);
    }
  },

  approveCenter: async (centerId) => {
    if (isDevelopment) {
      const center = MOCK_CANCER_CENTERS.find(c => c.id === centerId);
      if (center) {
        center.status = 'approved';
        return { success: true, data: center };
      }
      throw new Error('Center not found');
    }

    try {
      const response = await axiosInstance.post(`/state-admin/centers/${centerId}/approve`);
      return response.data;
    } catch (error) {
      return api.handleError(error);
    }
  },

  createApexCenter: async (centerData) => {
    if (isDevelopment) {
      const newCenter = {
        id: MOCK_CANCER_CENTERS.length + 1,
        ...centerData,
        type: 'Apex',
        status: 'pending',
        registrationDate: new Date().toISOString().split('T')[0],
        assignedDistricts: centerData.assignedDistricts // Include assigned districts
      };
      MOCK_CANCER_CENTERS.push(newCenter);
      return { success: true, data: newCenter };
    }
  
    try {
      const response = await axiosInstance.post('/state-admin/centers', centerData);
      return response.data;
    } catch (error) {
      return api.handleError(error);
    }
  },
 // Replace the getVerifiedData, exportData, and getMISReports methods with these properly formatted versions

 getVerifiedData: async (dataType) => {
  if (isDevelopment) {
    let data;
    if (dataType === 'incidence') {
      data = MOCK_PATIENTS.filter(p => p.status === 'verified');
    } else {
      data = MOCK_MORTALITY_DATA.filter(m => m.status === 'verified');
    }
    return {
      success: true,
      data: {
        type: dataType,
        data
      }
    };
  }

  try {
    const response = await axiosInstance.get(`/state-admin/verified-data/${dataType}`);
    return response.data;
  } catch (error) {
    return api.handleError(error);
  }
},

exportData: async (dataType, filters = {}) => {
  if (isDevelopment) {
    let data;
    if (dataType === 'incidence') {
      data = MOCK_PATIENTS.filter(p => p.status === 'verified');
    } else {
      data = MOCK_MORTALITY_DATA.filter(m => m.status === 'verified');
    }
    
    return {
      success: true,
      data: {
        exportedData: data,
        timestamp: new Date().toISOString(),
        filters
      }
    };
  }

  try {
    const response = await axiosInstance.post('/state-admin/export', { dataType, filters });
    return response.data;
  } catch (error) {
    return api.handleError(error);
  }
},

getMISReports: async () => {
  if (isDevelopment) {
    const centerStats = {
      total: MOCK_CANCER_CENTERS.length,
      approved: MOCK_CANCER_CENTERS.filter(c => c.status === 'approved').length,
      pending: MOCK_CANCER_CENTERS.filter(c => c.status === 'pending').length
    };

    const patientStats = {
      total: MOCK_PATIENTS.length,
      verified: MOCK_PATIENTS.filter(p => p.status === 'verified').length
    };

    const mortalityStats = {
      total: MOCK_MORTALITY_DATA.length,
      verified: MOCK_MORTALITY_DATA.filter(m => m.status === 'verified').length
    };

    const monthlyData = MOCK_PATIENTS.reduce((acc, patient) => {
      const month = new Date(patient.registrationDate).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { registrations: 0, mortality: 0 };
      }
      acc[month].registrations++;
      return acc;
    }, {});

    MOCK_MORTALITY_DATA.forEach(record => {
      const month = new Date(record.dateOfDeath).toLocaleString('default', { month: 'short' });
      if (monthlyData[month]) {
        monthlyData[month].mortality++;
      }
    });

    const monthlyTrends = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data
    }));

    return {
      success: true,
      data: {
        centerStats,
        patientStats,
        mortalityStats,
        monthlyTrends
      }
    };
  }

  try {
    const response = await axiosInstance.get('/state-admin/mis-reports');
    return response.data;
  } catch (error) {
    return api.handleError(error);
  }
},

  // Center Admin Methods
  getPendingUsers: async () => {
    if (isDevelopment) {
      const token = localStorage.getItem('token');
      const currentUser = MOCK_USERS.find(u => `mock_token_${u.id}` === token);

      // Filter users that report to this center admin's hospitals
      const hospitalAdmins = MOCK_USERS.filter(u => 
        u.role === 'hospital_admin' && 
        u.reportsTo === currentUser.id &&
        u.status === 'pending'
      );

      const dataCollectors = MOCK_USERS.filter(u => 
        u.role === 'data_collector' && 
        MOCK_USERS.find(h => h.id === u.reportsTo)?.reportsTo === currentUser.id &&
        u.status === 'pending'
      );

      return { 
        success: true, 
        data: [...hospitalAdmins, ...dataCollectors]
      };
    }

    try {
      const response = await axiosInstance.get('/center-admin/pending-users');
      return { success: true, data: response.data };
    } catch (error) {
      return api.handleError(error);
    }
  },
  getApprovedUsers: async () => {
    if (isDevelopment) {
      const token = localStorage.getItem('token');
      const currentUser = MOCK_USERS.find(u => `mock_token_${u.id}` === token);
  
      const approvedUsers = MOCK_USERS.filter(u => 
        u.role === 'data_collector' && 
        MOCK_USERS.find(h => h.id === u.reportsTo)?.reportsTo === currentUser.id &&
        u.status === 'active'
      );
  
      return { success: true, data: approvedUsers };
    }
  
    try {
      const response = await axiosInstance.get('/center-admin/approved-users');
      return response.data;
    } catch (error) {
      return api.handleError(error);
    }
  },
  
  getApprovedHospitals: async () => {
    if (isDevelopment) {
      const token = localStorage.getItem('token');
      const currentUser = MOCK_USERS.find(u => `mock_token_${u.id}` === token);
  
      const approvedHospitals = MOCK_HOSPITALS.filter(h => 
        MOCK_USERS.find(u => u.id === h.adminId)?.reportsTo === currentUser.id &&
        h.status === 'active'
      ).map(hospital => ({
        ...hospital,
        adminName: MOCK_USERS.find(u => u.id === hospital.adminId)?.name
      }));
  
      return { success: true, data: approvedHospitals };
    }
  
    try {
      const response = await axiosInstance.get('/center-admin/approved-hospitals');
      return response.data;
    } catch (error) {
      return api.handleError(error);
    }
  },

  approveUser: async (userId) => {
    if (isDevelopment) {
      const user = MOCK_USERS.find(u => u.id === userId);
      if (user) {
        user.status = 'active';
        return { success: true, data: user };
      }
      throw new Error('User not found');
    }

    try {
      const response = await axiosInstance.post(`/center-admin/users/${userId}/approve`);
      return { success: true, data: response.data };
    } catch (error) {
      return api.handleError(error);
    }
  },

  createUser: async (userData) => {
    if (isDevelopment) {
      const token = localStorage.getItem('token');
      const currentUser = MOCK_USERS.find(u => `mock_token_${u.id}` === token);
      
      const newUser = {
        id: MOCK_USERS.length + 1,
        ...userData,
        status: 'pending',
        registrations: 0,
        reportsTo: currentUser.id
      };
      MOCK_USERS.push(newUser);
  
      // If it's a hospital admin, create the hospital with its district
      if (userData.role === 'hospital_admin') {
        const newHospital = {
          id: MOCK_HOSPITALS.length + 1,
          name: userData.institution,
          type: 'Government',
          region: userData.hospitalDetails.district,
          adminId: newUser.id,
          reportsToCenterId: MOCK_CANCER_CENTERS.find(c => c.adminId === currentUser.id).id,
          status: 'pending'
        };
        MOCK_HOSPITALS.push(newHospital);
      }
  
      return { success: true, data: newUser };
    }
  
    try {
      const response = await axiosInstance.post('/center-admin/users', userData);
      return response.data;
    } catch (error) {
      return api.handleError(error);
    }
  },

  getDistrictData: async () => {
    if (isDevelopment) {
      const token = localStorage.getItem('token');
      const currentUser = MOCK_USERS.find(u => `mock_token_${u.id}` === token);
      
      const hospitalIds = MOCK_USERS
        .filter(u => u.role === 'hospital_admin' && u.reportsTo === currentUser.id)
        .map(u => MOCK_HOSPITALS.find(h => h.adminId === u.id)?.id)
        .filter(Boolean);

      const districtData = MOCK_PATIENTS
        .filter(p => hospitalIds.includes(p.hospitalId))
        .map(patient => ({
          id: patient.id,
          type: 'incidence',
          hospital: MOCK_HOSPITALS.find(h => h.id === patient.hospitalId)?.name,
          submittedBy: MOCK_USERS.find(u => u.id === patient.registeredBy)?.name,
          submissionDate: patient.registrationDate,
          status: patient.status
        }));

      return { success: true, data: districtData };
    }

    try {
      const response = await axiosInstance.get('/center-admin/district-data');
      return { success: true, data: response.data };
    } catch (error) {
      return api.handleError(error);
    }
  },
  getCenterDetails: async () => {
    if (isDevelopment) {
      const token = localStorage.getItem('token');
      const currentUser = MOCK_USERS.find(u => `mock_token_${u.id}` === token);
      const centerDetails = MOCK_CANCER_CENTERS.find(c => c.adminId === currentUser.id);
  
      if (!centerDetails) {
        throw new Error('Center not found');
      }
      
      return { 
        success: true, 
        data: {
          ...centerDetails,
          adminName: currentUser.name,
          adminEmail: currentUser.email
        } 
      };
    }
  
    try {
      const response = await axiosInstance.get('/center-admin/details');
      return response.data;
    } catch (error) {
      return api.handleError(error);
    }
  },

  getCenterMISReports: async () => {
    if (isDevelopment) {
      const token = localStorage.getItem('token');
      const currentUser = MOCK_USERS.find(u => `mock_token_${u.id}` === token);
      
      // Get all hospitals under this center
      const centerHospitals = MOCK_HOSPITALS.filter(h => 
        MOCK_USERS.find(u => u.id === h.adminId)?.reportsTo === currentUser.id
      );

      const hospitalIds = centerHospitals.map(h => h.id);
      const centerPatients = MOCK_PATIENTS.filter(p => hospitalIds.includes(p.hospitalId));

      return {
        success: true,
        data: {
          userStats: {
            total: MOCK_USERS.filter(u => 
              u.role === 'data_collector' && 
              MOCK_USERS.find(h => h.id === u.reportsTo)?.reportsTo === currentUser.id
            ).length,
            pending: MOCK_USERS.filter(u => 
              u.status === 'pending' && 
              MOCK_USERS.find(h => h.id === u.reportsTo)?.reportsTo === currentUser.id
            ).length
          },
          registryStats: {
            total: centerPatients.length,
            verified: centerPatients.filter(p => p.status === 'verified').length,
            pending: centerPatients.filter(p => p.status === 'pending').length
          },
          monthlyTrends: [
            { month: 'Jan', registrations: 45, mortality: 12 },
            { month: 'Feb', registrations: 52, mortality: 15 },
            { month: 'Mar', registrations: 48, mortality: 13 }
          ],
          cancerTypes: [
            { name: 'Breast', value: 35 },
            { name: 'Lung', value: 25 },
            { name: 'Colon', value: 20 },
            { name: 'Others', value: 20 }
          ],
          districtWiseData: [
            { district: 'Trivandrum', total: 120, verified: 100 },
            { district: 'Kollam', total: 80, verified: 65 },
            { district: 'Pathanamthitta', total: 60, verified: 45 }
          ]
        }
      };
    }

    try {
      const response = await axiosInstance.get('/center-admin/mis-reports');
      return { success: true, data: response.data };
    } catch (error) {
      return api.handleError(error);
    }
  },

  exportCenterData: async (type, filters) => {
    if (isDevelopment) {
      const token = localStorage.getItem('token');
      const currentUser = MOCK_USERS.find(u => `mock_token_${u.id}` === token);
      const currentCenter = MOCK_CANCER_CENTERS.find(c => c.adminId === currentUser.id);
      
      const hospitalIds = MOCK_HOSPITALS
        .filter(h => MOCK_USERS.find(u => u.id === h.adminId)?.reportsTo === currentUser.id)
        .map(h => h.id);
  
      let exportData = MOCK_PATIENTS.filter(p => 
        hospitalIds.includes(p.hospitalId) && 
        p.status === filters.status
      );
  
      // Filter by districts if specified
      if (filters.districts && filters.districts.length > 0) {
        exportData = exportData.filter(p => {
          const hospital = MOCK_HOSPITALS.find(h => h.id === p.hospitalId);
          return filters.districts.includes(hospital.region);
        });
      }
  
      // Filter by date range if specified
      if (filters.dateRange === 'custom' && filters.startDate && filters.endDate) {
        exportData = exportData.filter(p => {
          const date = new Date(p.registrationDate);
          return date >= new Date(filters.startDate) && date <= new Date(filters.endDate);
        });
      }
  
      return {
        success: true,
        data: {
          exportedData: exportData,
          timestamp: new Date().toISOString(),
          filters,
          assignedDistricts: currentCenter.assignedDistricts
        }
      };
    }
  
    try {
      const response = await axiosInstance.post('/center-admin/export', { type, filters });
      return response.data;
    } catch (error) {
      return api.handleError(error);
    }
  },
  getHospitalDataCollectors: async () => {
    if (isDevelopment) {
      const token = localStorage.getItem('token');
      const currentUser = MOCK_USERS.find(u => `mock_token_${u.id}` === token);
  
      // Filter data collectors that report to this hospital admin
      const dataCollectors = MOCK_USERS.filter(u => 
        u.role === 'data_collector' && 
        u.reportsTo === currentUser.id
      ).map(collector => ({
        ...collector,
        registrations: MOCK_PATIENTS.filter(p => 
          p.registeredBy === collector.id
        ).length
      }));
  
      return { success: true, data: dataCollectors };
    }
  
    try {
      const response = await axiosInstance.get('/hospital-admin/data-collectors');
      return response.data;
    } catch (error) {
      return api.handleError(error);
    }
  },
  
  // Add this as well for the toggle functionality
  toggleDataCollectorStatus: async (userId, status) => {
    if (isDevelopment) {
      const user = MOCK_USERS.find(u => u.id === userId);
      if (user) {
        user.status = status;
        return { success: true, data: user };
      }
      throw new Error('User not found');
    }
  
    try {
      const response = await axiosInstance.post(`/hospital-admin/data-collectors/${userId}/toggle-status`, { status });
      return response.data;
    } catch (error) {
      return api.handleError(error);
    }
  },

  // Patient Methods
getPatients: async () => {
  if (isDevelopment) {
    return { success: true, data: MOCK_PATIENTS };
  }

  try {
    const response = await axiosInstance.get('/patients');
    return { success: true, data: response.data };
  } catch (error) {
    return api.handleError(error);
  }
},

addPatient: async (patientData) => {
  if (isDevelopment) {
    // Validate required fields
    if (!patientData.centreName || !patientData.centreCode) {
      return { 
        success: false, 
        message: 'Required fields missing' 
      };
    }

    // Generate new patient ID
    const newPatient = {
      id: MOCK_PATIENTS.length + 1,
      patientId: `KL${String(MOCK_PATIENTS.length + 1).padStart(3, '0')}`,
      ...patientData,
      status: 'pending',
      registrationDate: new Date().toISOString().split('T')[0],
      registeredBy: parseInt(localStorage.getItem('userId')) || 1
    };

    MOCK_PATIENTS.push(newPatient);
    return { 
      success: true, 
      data: newPatient,
      message: 'Patient registered successfully'
    };
  }

  try {
    const response = await axiosInstance.post('/patients', patientData);
    return { success: true, data: response.data };
  } catch (error) {
    return api.handleError(error);
  }
},

updatePatient: async (patientId, patientData) => {
  if (isDevelopment) {
    const patientIndex = MOCK_PATIENTS.findIndex(p => p.id === patientId);
    if (patientIndex === -1) {
      return { 
        success: false, 
        message: 'Patient not found' 
      };
    }

    MOCK_PATIENTS[patientIndex] = {
      ...MOCK_PATIENTS[patientIndex],
      ...patientData,
      lastUpdated: new Date().toISOString()
    };

    return { 
      success: true, 
      data: MOCK_PATIENTS[patientIndex],
      message: 'Patient updated successfully'
    };
  }

  try {
    const response = await axiosInstance.put(`/patients/${patientId}`, patientData);
    return { success: true, data: response.data };
  } catch (error) {
    return api.handleError(error);
  }
},

  getPatientsByStatus: async (status) => {
    if (isDevelopment) {
      let filteredPatients;
      switch (status) {
        case 'verified':
          filteredPatients = MOCK_PATIENTS.filter(p => p.status === 'verified');
          break;
        case 'returned':
          filteredPatients = MOCK_PATIENTS.filter(p => p.status === 'returned');
          break;
        case 'pending':
          filteredPatients = MOCK_PATIENTS.filter(p => p.status === 'pending');
          break;
        default:
          filteredPatients = [];
      }
      return { success: true, data: filteredPatients };
    }

    try {
      const response = await axiosInstance.get(`/patients/status/${status}`);
      return { success: true, data: response.data };
    } catch (error) {
      return api.handleError(error);
    }
  },

  getFollowUps: async () => {
    if (isDevelopment) {
      const followUps = MOCK_PATIENTS.reduce((acc, patient) => {
        if (patient.followUps) {
          const patientFollowUps = patient.followUps.map(followUp => ({
            ...followUp,
            patientId: patient.patientId,
            patientName: patient.name
          }));
          return [...acc, ...patientFollowUps];
        }
        return acc;
      }, []);
      return { success: true, data: followUps };
    }

    try {
      const response = await axiosInstance.get('/patients/follow-ups');
      return { success: true, data: response.data };
    } catch (error) {
      return api.handleError(error);
    }
  },
  //Data Collector create in Hospital Api
  createDataCollector: async (userData) => {
    if (isDevelopment) {
      const token = localStorage.getItem('token');
      const currentUser = MOCK_USERS.find(u => `mock_token_${u.id}` === token);
      
      const newUser = {
        id: MOCK_USERS.length + 1,
        ...userData,
        role: 'data_collector',
        status: 'pending',
        registrations: 0,
        reportsTo: currentUser.id,
        institution: currentUser.institution // Inherit hospital from admin
      };
      
      MOCK_USERS.push(newUser);
      return { success: true, data: newUser };
    }
  
    try {
      const response = await axiosInstance.post('/hospital-admin/data-collectors', userData);
      return response.data;
    } catch (error) {
      return api.handleError(error);
    }
  },

  // Error Handler
  handleError: (error) => {
    if (error.response?.status === 401) {
      // The authMiddleware will handle token refresh/logout
      return Promise.reject(error);
    }

    return {
      success: false,
      message: error.response?.data?.message || error.message || 'An error occurred'
    };
  }
};