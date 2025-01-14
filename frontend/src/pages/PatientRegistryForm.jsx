import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Alert
} from '@mui/material';

import { 
  registerNewPatient, 
  validateForm, 
  clearErrors,
  selectLoading,
  selectError,
  selectValidationErrors,
  selectSuccess 
} from '../redux/slices/patientSlice';

// Import sections
import IdentifyingInformation from './registryFormSections/IdentifyingInformation';
import BasicDemographics from './registryFormSections/BasicDemographics';
import DiagnosticDetails from './registryFormSections/DiagnosticDetails';
import ClinicalStageAndTreatment from './registryFormSections/ClinicalStageAndTreatment';

// Import shared utilities
import { FIELD_VISIBILITY } from './registryFormSections/shared/types';

const INITIAL_FORM_STATE = {
  // I. IDENTIFYING INFORMATION
  centreName: '',
  centreCode: '',
  registrationNumber: {
    year: '', // First 2 digits for year
    regNo: '' // Next 5 digits for actual registration number
  },
  sourceInfo: {
    name: '', // 3.1(a) Name of Source of Registration
    code: '',
    department: '', // 3.1(b) Name of Department/Unit
    departmentCode: '',
    physician: '', // 3.1(c)
    mobileNo: ''
  },
  hospitalRegNo: '', // 3.2
  dateOfRegistration: '', // 3.3
  caseRegisteredAs: '', // 3.4 (choices 1-8)
  otherSources: [
    {
      name: '',
      code: '',
      hospitalNo: '',
      date: ''
    }
  ],
  dateOfFirstDiagnosis: '', // 5
  patientName: {
    first: '',
    second: '',
    last: ''
  }, // 6.1
  aadhaarNo: '', // 6.2
  relatives: {
    father: { name: '', mobileNo: '' },
    mother: { name: '', mobileNo: '' },
    spouse: { name: '', mobileNo: '' },
    son: { name: '', mobileNo: '' },
    daughter: { name: '', mobileNo: '' },
    others: { name: '', mobileNo: '', relation: '' }
  }, // 7.1
  relativeCode: '', // 7.2
  
  // Place of Residence (8)
  placeOfResidence: {
    type: 'urban', // Urban Areas or Non-urban/Rural Areas
    urban: {
      houseNo: '',
      roadStreetName: '',
      areaLocality: '',
      wardCorporationDivision: '', 
      cityTown: '',
      district: '',
      pinCode: ''
    },
    rural: {
      houseNoAndWard: '',
      gramPanchayat: '',
      subUnitDistrict: '',
      phcName: '',
      pinCode: ''
    },
    contactInfo: {
      telephone: {
        office: '',
        residence: ''
      },
      mobile: '',
      emailId: ''
    }
  },
  durationOfStay: '', // 9
  
  // Other Addresses (10)
  otherAddresses: {
    local: { // 10.1
      address: '',
      cityTownDistrict: '',
      pinCode: ''
    },
    office: { // 10.2
      address: '',
      cityTownDistrict: '',
      pinCode: ''
    },
    native: { // 10.3
      address: '',
      cityTownDistrict: '',
      pinCode: ''
    }
  },

  // Place of Birth (11)
  placeOfBirth: {
    address: '',
    cityTownDistrict: '',
    pinCode: '',
    dateOfBirth: ''
  },

  age: '', // 12
  dateofBirth: '' ,//12.1
  ageEstimatedBy: '', // 13
  sex: '', // 14

  // II. BASIC DEMOGRAPHIC PARAMETERS
  maritalStatus: '', // 15
  motherTongue: '', // 16
  religion: '', // 17
  culturalGroup: '', // 18
  education: '', // 19

  // III. DIAGNOSTIC DETAILS
  diagnosticStatus: '', // 20
  methodOfDiagnosis: { // 21
    primaryMethod: '', // One of: 'clinicalOnly', 'microscopic', 'xray', 'dco', 'others'
    secondaryMethod: '', // Will contain the selected sub-method based on primary selection
    // Available secondary methods based on primary:
    // If microscopic:
    //   - histologyOfPrimary
    //   - histologyOfMetastasis 
    //   - autopsyWithHistology
    //   - boneMarrow
    //   - bloodFilm
    //   - cytologyOfPrimary
    //   - cytologyOfMetastasis
    // If xray/imaging:
    //   - xRay
    //   - isotopes
    //   - angiography
    //   - ultrasonogram
    //   - allOthers
    // If others:
    //   - endoscopy
    //   - surgeryOrAutopsyWithoutHistology
    //   - specificBiochemicalOrImmunological
    //   - others
  },
  anatomicalSite: '', // 22
  pathologicalDiagnosis: { // 23
    primarySite: '', // 23.1
    morphology: '', // 23.2
    slideNo: '', // 23.3
    date: ''
  },
  icdCoding: { // 24
    primarySite: '', // 24.1
    primaryHistology: '', // 24.2
    secondarySite: '', // 24.3
    morphologyMetastasis: '' // 24.4
  },
  siteOfTumour: '', // 25
  laterality: '', // 26
  sequence: '', // 27

  // IV. DETAILS OF CLINICAL STAGE AND TREATMENT
  clinicalExtent: '', // 28
  stagingSystem: '', // 29.1
  tnm: { // 29.2
    t: '',
    n: '',
    m: ''
  },
  compositeStage: '', // 29.3
  intentionToTreat: '', // 30
  cancerDirectedTreatment: { // 31
    received: '',
    dateOfCommencement: '', // 31.1
    typeGiven: '', // 31.2
    dateOfCompletion: '' // 31.3
  },
  dateOfLastContact: '', // 32
  dateOfDeath: '', // 33
  mortalityRegNo: '', // 34
  personCompletingForm: '', // 35
  dateOfCompletion: '',
  sourceOfInformation: ''
};


const PatientRegistryForm = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => selectLoading(state).registration);
  const error = useSelector(state => selectError(state).registration);
  const validationErrors = useSelector(selectValidationErrors);
  const success = useSelector(state => selectSuccess(state).registration);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [fieldVisibility, setFieldVisibility] = useState(FIELD_VISIBILITY.MANDATORY);

  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [success]);

  const handleVisibilityChange = (event, newVisibility) => {
    console.log('Previous visibility:', fieldVisibility);
    console.log('New visibility:', newVisibility);
    
    if (newVisibility !== null) {
        setFieldVisibility(newVisibility);
        console.log('Visibility set to:', newVisibility);
    }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(validateForm(formData));
    
    if (!validationErrors) {
      await dispatch(registerNewPatient(formData));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            NATIONAL CANCER REGISTRY PROGRAMME
          </Typography>
          <Typography variant="h5" align="center" gutterBottom color="primary">
            Core Form - Incidence Data
          </Typography>
        </Box>

        {/* Visibility Toggle */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
    value={fieldVisibility}
    exclusive
    onChange={(event, value) => {
        console.log('ToggleButtonGroup value:', value);
        handleVisibilityChange(event, value);
    }}
    color="primary"
>
    <ToggleButton value={FIELD_VISIBILITY.MANDATORY}>
        {`Mandatory`}
    </ToggleButton>
    <ToggleButton value={FIELD_VISIBILITY.RECOMMENDED}>
        {`Recommended`}
    </ToggleButton>
    <ToggleButton value={FIELD_VISIBILITY.ALL}>
        {`All`}
    </ToggleButton>
</ToggleButtonGroup>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {validationErrors && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Please fix the following errors:
            <ul>
              {Object.entries(validationErrors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Patient registration successful!
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Section Components */}
          <IdentifyingInformation
            formData={formData}
            handleChange={handleChange}
            handleNestedChange={handleNestedChange}
            fieldVisibility={fieldVisibility}
          />

          <BasicDemographics
            formData={formData}
            handleChange={handleChange}
            handleNestedChange={handleNestedChange}
            fieldVisibility={fieldVisibility}
          />

          <DiagnosticDetails
            formData={formData}
            handleChange={handleChange}
            handleNestedChange={handleNestedChange}
            fieldVisibility={fieldVisibility}
          />

          <ClinicalStageAndTreatment
            formData={formData}
            handleChange={handleChange}
            handleNestedChange={handleNestedChange}
            fieldVisibility={fieldVisibility}
          />

          {/* Submit Button */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Patient Registry'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default PatientRegistryForm;