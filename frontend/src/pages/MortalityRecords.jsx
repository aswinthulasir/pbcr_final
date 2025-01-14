import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  addMortalityRecord,
  fetchPatients,
  selectPatients,
  selectLoading,
  selectError,
  selectSuccess
} from '../redux/slices/patientSlice';

const initialFormState = {
  // 1. Centre Information
  centreName: '',
  centreCode: '',

  // 2. Mortality Registration Number
  mortalityRegNo: {
    year: '',
    regNo: ''
  },

  // 3. Date of Death
  dateOfDeath: '',

  // 4. Patient Information
  // 4.1 Full Name (At Least One Name Is Compulsory)
  fullName: {
    first: '',
    second: '',
    last: ''
  },
  
  // 4.2 Unique Identification Number
  uniqueIdNumber: '',

  // 5. Place of Residence
  placeOfResidence: {
    type: 'urban', // or 'rural'
    urban: {
      houseNo: '',
      roadName: '',
      areaLocality: '',
      wardNumber: '',
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
      telephone: '',
      mobile: '',
      email: ''
    }
  },

  // 6. Duration of Stay
  durationOfStay: '',

  // 7. Relative/Next of Kin Information
  // 7.1 Name of Relative/Next of Kin
  relativeName: '',
  
  // 7.2 Code of Relative
  relativeCode: '', // (1)Father (2)Mother (3)Husband (4)Wife (5)Son (6)Daughter (7)Other (8)Others (9)Unknown
  
  // 7.3 Address of Relative
  relativeAddress: {
    address: '',
    cityTownDistrict: '',
    pinCode: ''
  },

  // 8. Age (In Years)
  age: '',

  // 9. Sex
  sex: '', // (1)Male (2)Female (3)Others

  // 10. Religion
  religion: '', // (1)Hindu (2)Muslim (3)Christian (4)Sikh (5)Jain (6)Buddhist (7)Parsi (8)Others (9)Unknown

  // 11. Place of Death
  placeOfDeath: '', // (1)Hospital (2)Nursing Home (3)Residence (4)Others

  // Hospital/Nursing Home Details
  hospitalDetails: {
    name: '',
    code: '',
    registrationNumber: ''
  },

  // 12. Certification of Death
  deathCertification: {
    certifiedBy: '', // (0)Not Certified (1)Allopathic (2)Non-Allopathic (3)Coroner/Autopsy (4)Others (9)Unknown
    autopsyReport: false, // (1)Yes (2)No
    certifierDetails: '' // Name, Title and Address
  },

  // 13. Cause of Death
  // 13.1 Cause of Death
  causeOfDeath: '', // (1)Due to cancer (2)Other than cancer - with cancer (3)Other than cancer - NO cancer

  // 13.2 Site of Cancer (If 1 or 2 above)
  cancerDetails: {
    icd10: '',
    morphology: '',
    dateOfDiagnosis: ''
  },

  // 14. Source of Information
  sourceInfo: {
    source: '', // (1)Corporation (2)Hospital (3)1+2 (4)Active Follow-up (5)Home Visits (6)Others
    corporationDetails: {
      unitName: '',
      code: '',
      registrationNo: '',
      dateOfRegistration: ''
    },
    hospitalDetails: {
      code: '',
      registrationNo: '',
      dateOfRegistration: ''
    }
  },

  // 15. For Matched Deaths
  matchedDeaths: {
    incidenceRegNo: '',
    dateOfFirstDiagnosis: ''
  },

  // 16. Form Completion Details
  completedBy: '',
  completionDate: ''
};

// Helper constants for dropdown options
const RELATIVE_CODES = [
  { value: '1', label: 'Father' },
  { value: '2', label: 'Mother' },
  { value: '3', label: 'Husband' },
  { value: '4', label: 'Wife' },
  { value: '5', label: 'Son' },
  { value: '6', label: 'Daughter' },
  { value: '7', label: 'Other Relative' },
  { value: '8', label: 'Others (including informant)' },
  { value: '9', label: 'Unknown' }
];

const RELIGIONS = [
  { value: '1', label: 'Hindu' },
  { value: '2', label: 'Muslim' },
  { value: '3', label: 'Christian' },
  { value: '4', label: 'Sikh' },
  { value: '5', label: 'Jain' },
  { value: '6', label: 'Buddhist' },
  { value: '7', label: 'Parsi' },
  { value: '8', label: 'Others' },
  { value: '9', label: 'Unknown' }
];

const DEATH_PLACES = [
  { value: '1', label: 'Hospital' },
  { value: '2', label: 'Nursing Home' },
  { value: '3', label: 'Residence' },
  { value: '4', label: 'Others' }
];

// ... continuing MortalityRecords.jsx

export default function MortalityRecords() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormState);
  const loading = useSelector(state => selectLoading(state).mortality);
  const error = useSelector(state => selectError(state).mortality);
  const success = useSelector(state => selectSuccess(state).mortality);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle nested object changes
  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addMortalityRecord(formData));
    if (!error) {
      setFormData(initialFormState);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          NATIONAL CANCER REGISTRY PROGRAMME
        </Typography>
        <Typography variant="h5" gutterBottom align="center" color="primary">
          Core Form - Mortality Data
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Mortality record added successfully
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* 1. Centre Information */}
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  required
                  label="Name of Participating Centre"
                  name="centreName"
                  value={formData.centreName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Centre Code"
                  name="centreCode"
                  value={formData.centreCode}
                  onChange={handleChange}
                />
              </Grid>

              {/* 2. Mortality Registration Number */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Registration Year"
                  name="mortalityRegNo.year"
                  value={formData.mortalityRegNo.year}
                  onChange={(e) => handleNestedChange('mortalityRegNo', 'year', e.target.value)}
                  helperText="First 2 digits are for year of registration"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Registration Number"
                  name="mortalityRegNo.regNo"
                  value={formData.mortalityRegNo.regNo}
                  onChange={(e) => handleNestedChange('mortalityRegNo', 'regNo', e.target.value)}
                  helperText="Next 5 digits for actual Registration Number"
                />
              </Grid>

              {/* 3. Date of Death */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Date of Death"
                  type="date"
                  name="dateOfDeath"
                  value={formData.dateOfDeath}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* 4. Full Name of Deceased */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Full Name of Deceased (At Least One Name Is Compulsory)
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="fullName.first"
                  value={formData.fullName.first}
                  onChange={(e) => handleNestedChange('fullName', 'first', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Second Name"
                  name="fullName.second"
                  value={formData.fullName.second}
                  onChange={(e) => handleNestedChange('fullName', 'second', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="fullName.last"
                  value={formData.fullName.last}
                  onChange={(e) => handleNestedChange('fullName', 'last', e.target.value)}
                />
              </Grid>

              {/* 4.2 Unique Identification Number */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Unique Identification Number"
                  name="uniqueIdNumber"
                  value={formData.uniqueIdNumber}
                  onChange={handleChange}
                />
              </Grid>

              // ... continuing the form inside the Grid container

              {/* 5. Place of Residence */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Place of Residence
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    name="placeOfResidence.type"
                    value={formData.placeOfResidence.type}
                    onChange={(e) => handleNestedChange('placeOfResidence', 'type', e.target.value)}
                  >
                    <FormControlLabel value="urban" control={<Radio />} label="Urban Areas (Town/Cities)" />
                    <FormControlLabel value="rural" control={<Radio />} label="Non-urban/Rural Areas" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {formData.placeOfResidence.type === 'urban' ? (
                // Urban Address Fields
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="House No."
                      name="placeOfResidence.urban.houseNo"
                      value={formData.placeOfResidence.urban.houseNo}
                      onChange={(e) => handleNestedChange('placeOfResidence.urban', 'houseNo', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Road/Street Name"
                      name="placeOfResidence.urban.roadName"
                      value={formData.placeOfResidence.urban.roadName}
                      onChange={(e) => handleNestedChange('placeOfResidence.urban', 'roadName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Area/Locality"
                      name="placeOfResidence.urban.areaLocality"
                      value={formData.placeOfResidence.urban.areaLocality}
                      onChange={(e) => handleNestedChange('placeOfResidence.urban', 'areaLocality', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Ward/Corporation/Division"
                      name="placeOfResidence.urban.wardNumber"
                      value={formData.placeOfResidence.urban.wardNumber}
                      onChange={(e) => handleNestedChange('placeOfResidence.urban', 'wardNumber', e.target.value)}
                    />
                  </Grid>
                </>
              ) : (
                // Rural Address Fields
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="House No. and Ward"
                      name="placeOfResidence.rural.houseNoAndWard"
                      value={formData.placeOfResidence.rural.houseNoAndWard}
                      onChange={(e) => handleNestedChange('placeOfResidence.rural', 'houseNoAndWard', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Name of Gram Panchayat/Village"
                      name="placeOfResidence.rural.gramPanchayat"
                      value={formData.placeOfResidence.rural.gramPanchayat}
                      onChange={(e) => handleNestedChange('placeOfResidence.rural', 'gramPanchayat', e.target.value)}
                    />
                  </Grid>
                </>
              )}

              {/* Common Fields for both Urban and Rural */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Name of City/Town"
                  name="placeOfResidence.cityTown"
                  value={formData.placeOfResidence.cityTown}
                  onChange={(e) => handleNestedChange('placeOfResidence', 'cityTown', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="District"
                  name="placeOfResidence.district"
                  value={formData.placeOfResidence.district}
                  onChange={(e) => handleNestedChange('placeOfResidence', 'district', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="PIN Code"
                  name="placeOfResidence.pinCode"
                  value={formData.placeOfResidence.pinCode}
                  onChange={(e) => handleNestedChange('placeOfResidence', 'pinCode', e.target.value)}
                />
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Telephone No."
                  name="placeOfResidence.contactInfo.telephone"
                  value={formData.placeOfResidence.contactInfo.telephone}
                  onChange={(e) => handleNestedChange('placeOfResidence.contactInfo', 'telephone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Mobile"
                  name="placeOfResidence.contactInfo.mobile"
                  value={formData.placeOfResidence.contactInfo.mobile}
                  onChange={(e) => handleNestedChange('placeOfResidence.contactInfo', 'mobile', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Email ID"
                  type="email"
                  name="placeOfResidence.contactInfo.email"
                  value={formData.placeOfResidence.contactInfo.email}
                  onChange={(e) => handleNestedChange('placeOfResidence.contactInfo', 'email', e.target.value)}
                />
              </Grid>
              {/* 6. Duration of Stay */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Duration of Stay (In Years)"
                  name="durationOfStay"
                  type="number"
                  value={formData.durationOfStay}
                  onChange={handleChange}
                  helperText="At the Place of Usual Residence"
                />
              </Grid>

              {/* 7. Next of Kin Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Next of Kin Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name of Relative/Next of Kin/Informant"
                  name="relativeName"
                  value={formData.relativeName}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Relationship with Deceased</InputLabel>
                  <Select
                    name="relativeCode"
                    value={formData.relativeCode}
                    onChange={handleChange}
                    label="Relationship with Deceased"
                  >
                    {RELATIVE_CODES.map((code) => (
                      <MenuItem key={code.value} value={code.value}>
                        {code.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address of Relative/Informant"
                  name="relativeAddress.address"
                  value={formData.relativeAddress.address}
                  onChange={(e) => handleNestedChange('relativeAddress', 'address', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City/Town/District"
                  name="relativeAddress.cityTownDistrict"
                  value={formData.relativeAddress.cityTownDistrict}
                  onChange={(e) => handleNestedChange('relativeAddress', 'cityTownDistrict', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PIN Code"
                  name="relativeAddress.pinCode"
                  value={formData.relativeAddress.pinCode}
                  onChange={(e) => handleNestedChange('relativeAddress', 'pinCode', e.target.value)}
                />
              </Grid>

              {/* 8-10. Personal Details */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Personal Details
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Age (In Years)"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Sex</InputLabel>
                  <Select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    label="Sex"
                  >
                    <MenuItem value="1">Male</MenuItem>
                    <MenuItem value="2">Female</MenuItem>
                    <MenuItem value="3">Others</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Religion</InputLabel>
                  <Select
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    label="Religion"
                  >
                    {RELIGIONS.map((religion) => (
                      <MenuItem key={religion.value} value={religion.value}>
                        {religion.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* 11. Place of Death */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Place of Death
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Place of Death</InputLabel>
                  <Select
                    name="placeOfDeath"
                    value={formData.placeOfDeath}
                    onChange={handleChange}
                    label="Place of Death"
                  >
                    {DEATH_PLACES.map((place) => (
                      <MenuItem key={place.value} value={place.value}>
                        {place.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Conditional Hospital Details */}
              {(formData.placeOfDeath === '1' || formData.placeOfDeath === '2') && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Hospital/Nursing Home Name"
                      name="hospitalDetails.name"
                      value={formData.hospitalDetails.name}
                      onChange={(e) => handleNestedChange('hospitalDetails', 'name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Hospital Code"
                      name="hospitalDetails.code"
                      value={formData.hospitalDetails.code}
                      onChange={(e) => handleNestedChange('hospitalDetails', 'code', e.target.value)}
                    />
                  </Grid>
                </>
              )}
            

              {/* 12. Certification of Death */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Certification of Death
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Death Certified by</InputLabel>
                  <Select
                    name="deathCertification.certifiedBy"
                    value={formData.deathCertification.certifiedBy}
                    onChange={(e) => handleNestedChange('deathCertification', 'certifiedBy', e.target.value)}
                    label="Death Certified by"
                  >
                    <MenuItem value="0">Not Certified</MenuItem>
                    <MenuItem value="1">Allopathic Practitioner</MenuItem>
                    <MenuItem value="2">Non-Allopathic Practitioner</MenuItem>
                    <MenuItem value="3">Coroner/Medical Autopsy</MenuItem>
                    <MenuItem value="4">Others</MenuItem>
                    <MenuItem value="9">Unknown</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Autopsy Report</InputLabel>
                  <Select
                    name="deathCertification.autopsyReport"
                    value={formData.deathCertification.autopsyReport}
                    onChange={(e) => handleNestedChange('deathCertification', 'autopsyReport', e.target.value)}
                    label="Autopsy Report"
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name, Title and Address of Person Certifying Death"
                  name="deathCertification.certifierDetails"
                  value={formData.deathCertification.certifierDetails}
                  onChange={(e) => handleNestedChange('deathCertification', 'certifierDetails', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>

              {/* 13. Cause of Death */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Cause of Death
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Note: Cardiac failure/arrest, Respiratory failure/arrest, Peripheral circulatory failure and Cerebrovascular failure are not causes of death.
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Cause of Death</InputLabel>
                  <Select
                    name="causeOfDeath"
                    value={formData.causeOfDeath}
                    onChange={handleChange}
                    label="Cause of Death"
                  >
                    <MenuItem value="1">Due to cancer</MenuItem>
                    <MenuItem value="2">Other than cancer - in patients with A diagnosis of cancer</MenuItem>
                    <MenuItem value="3">Other than cancer - in patients with NO diagnosis of cancer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Cancer Details (if applicable) */}
              {(formData.causeOfDeath === '1' || formData.causeOfDeath === '2') && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Site of Cancer
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="ICD-10"
                      name="cancerDetails.icd10"
                      value={formData.cancerDetails.icd10}
                      onChange={(e) => handleNestedChange('cancerDetails', 'icd10', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Morphology"
                      name="cancerDetails.morphology"
                      value={formData.cancerDetails.morphology}
                      onChange={(e) => handleNestedChange('cancerDetails', 'morphology', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Date of Diagnosis"
                      name="cancerDetails.dateOfDiagnosis"
                      value={formData.cancerDetails.dateOfDiagnosis}
                      onChange={(e) => handleNestedChange('cancerDetails', 'dateOfDiagnosis', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </>
              )}

              {/* 14. Source of Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Source of Information on Death
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Source</InputLabel>
                  <Select
                    name="sourceInfo.source"
                    value={formData.sourceInfo.source}
                    onChange={(e) => handleNestedChange('sourceInfo', 'source', e.target.value)}
                    label="Source"
                  >
                    <MenuItem value="1">Corporation Unit/Zilla Panchayat</MenuItem>
                    <MenuItem value="2">Hospital/Nursing Home</MenuItem>
                    <MenuItem value="3">1 + 2</MenuItem>
                    <MenuItem value="4">Active Follow-up - Letters</MenuItem>
                    <MenuItem value="5">Active Follow-up - Home Visits</MenuItem>
                    <MenuItem value="6">Others</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Form Completion Details */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Form Completion Details
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Name of Person Completing Form"
                  name="completedBy"
                  value={formData.completedBy}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Date of Completion"
                  name="completionDate"
                  value={formData.completionDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ minWidth: 150 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Submit Record'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}