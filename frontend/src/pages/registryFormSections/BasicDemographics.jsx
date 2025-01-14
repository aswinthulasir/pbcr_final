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

const BasicDemographics = ({
  formData,
  handleChange,
  handleNestedChange,
  fieldVisibility,
}) => {
  // Helper function to determine field visibility
  const isFieldVisible = (fieldName) => {
    console.log(`Checking visibility for ${fieldName}:`, fieldVisibility);
    if (fieldVisibility === 'all') {
      return true;
    }
    return shouldShowField(fieldName, fieldVisibility);
  };
  // Check if any field in this section should be visible
  const shouldShowSection = () => {
    const fieldsToCheck = ['maritalStatus', 'motherTongue', 'religion', 'culturalBackground', 'education'];
    return fieldsToCheck.some(field => isFieldVisible(field));
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

  return shouldShowSection() ? (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 3 }}>
        II. BASIC DEMOGRAPHIC PARAMETERS
      </Typography>

      <Grid container spacing={3}>
        {/* 15. Marital Status */}
        {isFieldVisible('maritalStatus') && (
            
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>15. Marital Status</InputLabel>
              <Select
                value={formData.maritalStatus}
                onChange={handleChange}
                name="maritalStatus"
                label="15. Marital Status"
              >
                <MenuItem value="1">Unmarried</MenuItem>
                <MenuItem value="2">Married</MenuItem>
                <MenuItem value="3">Widowed</MenuItem>
                <MenuItem value="4">Divorced</MenuItem>
                <MenuItem value="5">Separated</MenuItem>
                <MenuItem value="9">Unknown</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* 16. Mother Tongue */}
        {isFieldVisible('motherTongue') && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>16. Mother Tongue</InputLabel>
              <Select
                value={formData.motherTongue}
                onChange={handleChange}
                name="motherTongue"
                label="16. Mother Tongue"
              >
                <MenuItem value="01">Assamese</MenuItem>
                <MenuItem value="02">Bengali</MenuItem>
                <MenuItem value="03">Gujarathi</MenuItem>
                <MenuItem value="04">Hindi</MenuItem>
                <MenuItem value="05">Kannada</MenuItem>
                <MenuItem value="06">Kashmiri</MenuItem>
                <MenuItem value="07">Malayalam</MenuItem>
                <MenuItem value="08">Marathi</MenuItem>
                <MenuItem value="09">Oriya</MenuItem>
                <MenuItem value="10">Punjabi</MenuItem>
                <MenuItem value="11">Sanskrit</MenuItem>
                <MenuItem value="12">Sindhi</MenuItem>
                <MenuItem value="13">Tamil</MenuItem>
                <MenuItem value="14">Telugu</MenuItem>
                <MenuItem value="15">Urdu</MenuItem>
                <MenuItem value="16">English</MenuItem>
                <MenuItem value="99">Unknown</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* 17. Religion */}
        {isFieldVisible('religion') && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>17. Religion</InputLabel>
              <Select
                value={formData.religion}
                onChange={handleChange}
                name="religion"
                label="17. Religion"
              >
                <MenuItem value="1">Hindu</MenuItem>
                <MenuItem value="2">Muslim</MenuItem>
                <MenuItem value="3">Christian</MenuItem>
                <MenuItem value="4">Sikh</MenuItem>
                <MenuItem value="5">Jain</MenuItem>
                <MenuItem value="6">Neo-Buddhist</MenuItem>
                <MenuItem value="7">Parsi</MenuItem>
                <MenuItem value="8">Others</MenuItem>
                <MenuItem value="9">Unknown</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* 18. Cultural Background */}
        {isFieldVisible('culturalBackground') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="18. Cultural Group / Background"
              name="culturalBackground"
              value={formData.culturalBackground}
              onChange={handleChange}
              helperText="Only for North East PBCRs - Refer Procedure Manual for Codes"
            />
          </Grid>
        )}

        {/* 19. Education */}
        {isFieldVisible('education') && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>19. Education</InputLabel>
              <Select
                value={formData.education}
                onChange={handleChange}
                name="education"
                label="19. Education"
              >
                <MenuItem value="0">Not applicable (for children below 5 years)</MenuItem>
                <MenuItem value="1">Illiterate</MenuItem>
                <MenuItem value="2">Literate</MenuItem>
                <MenuItem value="3">Primary</MenuItem>
                <MenuItem value="4">Middle</MenuItem>
                <MenuItem value="5">Secondary</MenuItem>
                <MenuItem value="6">Technical-after matric</MenuItem>
                <MenuItem value="7">College and above</MenuItem>
                <MenuItem value="9">Unknown</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </>
  ):null;
};

export default BasicDemographics;