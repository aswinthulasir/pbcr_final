import React from 'react';
import {
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Divider
} from '@mui/material';
import { shouldShowField } from './shared/utils';

const DiagnosticDetails = ({
  formData,
  handleChange,
  handleNestedChange,
  fieldVisibility,
}) => {
  const isFieldVisible = (fieldName) => {
    console.log(`Checking visibility for ${fieldName}:`, fieldVisibility);
    if (fieldVisibility === 'all') {
      return true;
    }
    return shouldShowField(fieldName, fieldVisibility);
  };

  const renderSectionDivider = (title) => (
    <Grid item xs={12}>
      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          {title}
        </Typography>
        <Divider />
      </Box>
    </Grid>
  );

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 3 }}>
        III. DIAGNOSTIC DETAILS
      </Typography>
      <Grid container spacing={3}>
        {/* 20. Diagnostic Status */}
        {isFieldVisible('diagnosticStatus') && (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>20. Diagnostic Status at Registration at RI</InputLabel>
              <Select
                name="diagnosticStatus"
                value={formData.diagnosticStatus}
                onChange={handleChange}
                label="20. Diagnostic Status at Registration at RI"
              >
                <MenuItem value="0">Not Registered at RI</MenuItem>
                <MenuItem value="1">Microscopically Confirmed</MenuItem>
                <MenuItem value="2">Suspected (Microscopically/Radiologically)</MenuItem>
                <MenuItem value="3">Unequivocal Clinical Diagnosis</MenuItem>
                <MenuItem value="4">Suspected Clinically/To rule out Malignancy</MenuItem>
                <MenuItem value="9">Unknown</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* 21. Method of Diagnosis */}
        {renderSectionDivider("21. Method of Diagnosis")}
        {isFieldVisible('methodOfDiagnosis.primaryMethod') && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Primary Method</InputLabel>
              <Select
                name="methodOfDiagnosis.primaryMethod"
                value={formData.methodOfDiagnosis?.primaryMethod}
                onChange={(e) => handleNestedChange('methodOfDiagnosis', 'primaryMethod', e.target.value)}
                label="Primary Method"
              >
                <MenuItem value="1">Clinical Only</MenuItem>
                <MenuItem value="2">Microscopic</MenuItem>
                <MenuItem value="3">X-Ray / Imaging Techniques</MenuItem>
                <MenuItem value="4">DCO</MenuItem>
                <MenuItem value="8">Others</MenuItem>
                <MenuItem value="9">Unknown</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Secondary Methods based on Primary Method selection */}
        {formData.methodOfDiagnosis?.primaryMethod === '2' && isFieldVisible('methodOfDiagnosis.secondaryMethod') && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Microscopic Methods</InputLabel>
              <Select
                name="methodOfDiagnosis.secondaryMethod"
                value={formData.methodOfDiagnosis?.secondaryMethod}
                onChange={(e) => handleNestedChange('methodOfDiagnosis', 'secondaryMethod', e.target.value)}
                label="Microscopic Methods"
              >
                <MenuItem value="1">Histology of Primary</MenuItem>
                <MenuItem value="2">Histology of Metastasis</MenuItem>
                <MenuItem value="3">Autopsy with Histology</MenuItem>
                <MenuItem value="4">Bone Marrow</MenuItem>
                <MenuItem value="5">Blood Film</MenuItem>
                <MenuItem value="6">Cytology of Primary</MenuItem>
                <MenuItem value="7">Cytology of Metastasis</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {formData.methodOfDiagnosis?.primaryMethod === '3' && isFieldVisible('methodOfDiagnosis.secondaryMethod') && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>X-Ray / Imaging Techniques</InputLabel>
              <Select
                name="methodOfDiagnosis.secondaryMethod"
                value={formData.methodOfDiagnosis?.secondaryMethod}
                onChange={(e) => handleNestedChange('methodOfDiagnosis', 'secondaryMethod', e.target.value)}
                label="X-Ray / Imaging Techniques"
              >
                <MenuItem value="1">X Ray</MenuItem>
                <MenuItem value="2">Isotopes</MenuItem>
                <MenuItem value="3">Angiography</MenuItem>
                <MenuItem value="4">Ultrasonogram</MenuItem>
                <MenuItem value="5">CT Scan</MenuItem>
                <MenuItem value="6">MRI</MenuItem>
                <MenuItem value="7">PET Scan</MenuItem>
                <MenuItem value="8">All Others</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {formData.methodOfDiagnosis?.primaryMethod === '8' && isFieldVisible('methodOfDiagnosis.secondaryMethod') && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Other Methods</InputLabel>
              <Select
                name="methodOfDiagnosis.secondaryMethod"
                value={formData.methodOfDiagnosis?.secondaryMethod}
                onChange={(e) => handleNestedChange('methodOfDiagnosis', 'secondaryMethod', e.target.value)}
                label="Other Methods"
              >
                <MenuItem value="1">Endoscopy</MenuItem>
                <MenuItem value="2">Surgery or Autopsy without Histology</MenuItem>
                <MenuItem value="3">Specific Biochemical Tests</MenuItem>
                <MenuItem value="4">Immunological Tests</MenuItem>
                <MenuItem value="5">Flow Cytometry</MenuItem>
                <MenuItem value="6">Tumour Markers</MenuItem>
                <MenuItem value="7">Genetic Studies</MenuItem>
                <MenuItem value="8">Others</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* 22. Anatomical Site */}
        {isFieldVisible('anatomicalSite') && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="22. Anatomical Site of Specimen/Biopsy/Smear"
              name="anatomicalSite"
              value={formData.anatomicalSite}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>
        )}

        {/* 23. Complete Pathological Diagnosis */}
        {renderSectionDivider("23. Complete Pathological Diagnosis")}
        {isFieldVisible('pathologicalDiagnosis.primarySite') && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="23.1 Primary Site of Tumour - Topography"
              name="pathologicalDiagnosis.primarySite"
              value={formData.pathologicalDiagnosis?.primarySite}
              onChange={(e) => handleNestedChange('pathologicalDiagnosis', 'primarySite', e.target.value)}
            />
          </Grid>
        )}

        {isFieldVisible('pathologicalDiagnosis.morphology') && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="23.2 Morphology"
              name="pathologicalDiagnosis.morphology"
              value={formData.pathologicalDiagnosis?.morphology}
              onChange={(e) => handleNestedChange('pathologicalDiagnosis', 'morphology', e.target.value)}
            />
          </Grid>
        )}

        {isFieldVisible('pathologicalDiagnosis.slideNo') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="23.3 Pathology Slide No."
              name="pathologicalDiagnosis.slideNo"
              value={formData.pathologicalDiagnosis?.slideNo}
              onChange={(e) => handleNestedChange('pathologicalDiagnosis', 'slideNo', e.target.value)}
            />
          </Grid>
        )}

        {isFieldVisible('pathologicalDiagnosis.slideDate') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              name="pathologicalDiagnosis.slideDate"
              value={formData.pathologicalDiagnosis?.slideDate}
              onChange={(e) => handleNestedChange('pathologicalDiagnosis', 'slideDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        )}

        {/* 24. ICD-O-3 Coding */}
        {renderSectionDivider("24. ICD-O-3 Coding")}
        {isFieldVisible('icdCoding.primarySite') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="24.1 Primary Site of Tumour - Topography"
              name="icdCoding.primarySite"
              value={formData.icdCoding?.primarySite}
              onChange={(e) => handleNestedChange('icdCoding', 'primarySite', e.target.value)}
              helperText="Include sub-site if any"
            />
          </Grid>
        )}

        {isFieldVisible('icdCoding.primaryHistology') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="24.2 Primary Histology - Morphology"
              name="icdCoding.primaryHistology"
              value={formData.icdCoding?.primaryHistology}
              onChange={(e) => handleNestedChange('icdCoding', 'primaryHistology', e.target.value)}
            />
          </Grid>
        )}

        {isFieldVisible('icdCoding.secondarySite') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="24.3 Secondary Site of Tumour"
              name="icdCoding.secondarySite"
              value={formData.icdCoding?.secondarySite}
              onChange={(e) => handleNestedChange('icdCoding', 'secondarySite', e.target.value)}
            />
          </Grid>
        )}

        {isFieldVisible('icdCoding.morphologyMetastasis') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="24.4 Morphology of Metastasis"
              name="icdCoding.morphologyMetastasis"
              value={formData.icdCoding?.morphologyMetastasis}
              onChange={(e) => handleNestedChange('icdCoding', 'morphologyMetastasis', e.target.value)}
            />
          </Grid>
        )}

        {/* 25. Site of Tumour */}
        {isFieldVisible('siteOfTumour') && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="25. Site of Tumour (ICD-10)"
              name="siteOfTumour"
              value={formData.siteOfTumour}
              onChange={handleChange}
            />
          </Grid>
        )}

        {/* 26. Laterality */}
        {isFieldVisible('laterality') && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>26. Laterality</InputLabel>
              <Select
                name="laterality"
                value={formData.laterality}
                onChange={handleChange}
                label="26. Laterality"
              >
                <MenuItem value="0">Not a paired site</MenuItem>
                <MenuItem value="1">Right</MenuItem>
                <MenuItem value="2">Left</MenuItem>
                <MenuItem value="3">One side only, right or left origin unknown</MenuItem>
                <MenuItem value="4">Bilateral involvement, lateral origin unknown</MenuItem>
                <MenuItem value="9">Paired site, but no information concerning laterality</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* 27. Sequence */}
        {isFieldVisible('sequence') && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>27. Sequence</InputLabel>
              <Select
                name="sequence"
                value={formData.sequence}
                onChange={handleChange}
                label="27. Sequence"
              >
                <MenuItem value="0">One primary only</MenuItem>
                <MenuItem value="1">First of two or more primaries</MenuItem>
                <MenuItem value="2">Second of two or more primaries</MenuItem>
                <MenuItem value="3">Third of three or more primaries</MenuItem>
                <MenuItem value="4">Fourth of four or more primaries</MenuItem>
                <MenuItem value="5">Fifth of five or more primaries</MenuItem>
                <MenuItem value="6">Sixth of six or more primaries</MenuItem>
                <MenuItem value="7">Seventh of seven or more primaries</MenuItem>
                <MenuItem value="8">Eighth or later primary</MenuItem>
                <MenuItem value="9">Unspecified sequence (Unknown)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default DiagnosticDetails;