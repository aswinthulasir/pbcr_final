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

const ClinicalStageAndTreatment = ({
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
        IV. DETAILS OF CLINICAL STAGE AND TREATMENT
      </Typography>
      <Grid container spacing={3}>
        {/* 28. Clinical Extent */}
        {isFieldVisible('clinicalExtent') && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>28. Clinical Extent of Disease Before Treatment</InputLabel>
              <Select
                value={formData.clinicalExtent}
                onChange={handleChange}
                name="clinicalExtent"
                label="28. Clinical Extent of Disease Before Treatment"
              >
                <MenuItem value="01">In-situ</MenuItem>
                <MenuItem value="02">Localised</MenuItem>
                <MenuItem value="03">Direct Extension</MenuItem>
                <MenuItem value="04">Regional Nodes</MenuItem>
                <MenuItem value="05">Direct Extension with Regional Nodes</MenuItem>
                <MenuItem value="06">Distant Metastasis</MenuItem>
                <MenuItem value="07">Not Palpable</MenuItem>
                <MenuItem value="08">Too Advanced</MenuItem>
                <MenuItem value="09">Not Applicable / Unknown Primary</MenuItem>
                <MenuItem value="10">Treated Elsewhere</MenuItem>
                <MenuItem value="11">Recurrent</MenuItem>
                <MenuItem value="88">Others</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* 29.1 Staging System */}
        {isFieldVisible('stagingSystem') && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>29.1 Staging System Followed</InputLabel>
              <Select
                value={formData.stagingSystem}
                onChange={handleChange}
                name="stagingSystem"
                label="29.1 Staging System Followed"
              >
                <MenuItem value="1">TNM</MenuItem>
                <MenuItem value="2">FIGO</MenuItem>
                <MenuItem value="3">Ann Arbor</MenuItem>
                <MenuItem value="4">Not Applicable</MenuItem>
                <MenuItem value="8">Others (specify)</MenuItem>
                <MenuItem value="9">Unknown</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* 29.2 TNM */}
        {formData.stagingSystem === '1' && (
          <>
            {isFieldVisible('tnm.t') && (
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="T"
                  name="tnm.t"
                  value={formData.tnm?.t}
                  onChange={(e) => handleNestedChange('tnm', 't', e.target.value)}
                  helperText="888 if not applicable"
                />
              </Grid>
            )}
            {isFieldVisible('tnm.n') && (
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="N"
                  name="tnm.n"
                  value={formData.tnm?.n}
                  onChange={(e) => handleNestedChange('tnm', 'n', e.target.value)}
                  helperText="888 if not applicable"
                />
              </Grid>
            )}
            {isFieldVisible('tnm.m') && (
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="M"
                  name="tnm.m"
                  value={formData.tnm?.m}
                  onChange={(e) => handleNestedChange('tnm', 'm', e.target.value)}
                  helperText="888 if not applicable"
                />
              </Grid>
            )}
          </>
        )}

        {/* 29.3 Composite Stage */}
        {isFieldVisible('compositeStage') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="29.3 Composite Stage"
              name="compositeStage"
              value={formData.compositeStage}
              onChange={handleChange}
              helperText="888 if not applicable"
            />
          </Grid>
        )}

        {/* 30. Intention to Treat */}
        {isFieldVisible('intentionToTreat') && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>30. Intention to Treat at RI</InputLabel>
              <Select
                value={formData.intentionToTreat}
                onChange={handleChange}
                name="intentionToTreat"
                label="30. Intention to Treat at RI"
              >
                <MenuItem value="1">Curative / Radical</MenuItem>
                <MenuItem value="2">Palliative</MenuItem>
                <MenuItem value="3">Pain Relief Only</MenuItem>
                <MenuItem value="4">Symptomatic</MenuItem>
                <MenuItem value="5">No Treatment</MenuItem>
                <MenuItem value="9">Unknown</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* 31. Cancer Directed Treatment */}
        {isFieldVisible('cancerDirectedTreatment.received') && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>31. Cancer Directed Treatment Received</InputLabel>
              <Select
                value={formData.cancerDirectedTreatment?.received}
                onChange={(e) => handleNestedChange('cancerDirectedTreatment', 'received', e.target.value)}
                name="cancerDirectedTreatment.received"
                label="31. Cancer Directed Treatment Received"
              >
                <MenuItem value="1">Yes</MenuItem>
                <MenuItem value="2">No</MenuItem>
                <MenuItem value="3">Treatment Advised but Not Accepted</MenuItem>
                <MenuItem value="4">Incomplete Treatment</MenuItem>
                <MenuItem value="9">Unknown</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {formData.cancerDirectedTreatment?.received === '1' && (
          <>
            {/* 31.1 Date of Commencement */}
            {isFieldVisible('cancerDirectedTreatment.dateOfCommencement') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="31.1 Date of Commencement"
                  name="cancerDirectedTreatment.dateOfCommencement"
                  value={formData.cancerDirectedTreatment?.dateOfCommencement}
                  onChange={(e) => handleNestedChange('cancerDirectedTreatment', 'dateOfCommencement', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}

            {/* 31.2 Type Given */}
            {isFieldVisible('cancerDirectedTreatment.typeGiven') && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>31.2 Type of Treatment Given</InputLabel>
                  <Select
                    value={formData.cancerDirectedTreatment?.typeGiven}
                    onChange={(e) => handleNestedChange('cancerDirectedTreatment', 'typeGiven', e.target.value)}
                    name="cancerDirectedTreatment.typeGiven"
                    label="31.2 Type of Treatment Given"
                  >
                    <MenuItem value="01">Surgery (S)</MenuItem>
                    <MenuItem value="02">Radiotherapy (R)</MenuItem>
                    <MenuItem value="03">Chemotherapy (C)</MenuItem>
                    <MenuItem value="04">S+R</MenuItem>
                    <MenuItem value="05">S+C</MenuItem>
                    <MenuItem value="06">R+C</MenuItem>
                    <MenuItem value="07">S+R+C</MenuItem>
                    <MenuItem value="08">Hormone Therapy (H)</MenuItem>
                    <MenuItem value="09">S+H</MenuItem>
                    <MenuItem value="10">R+H</MenuItem>
                    <MenuItem value="11">C+H</MenuItem>
                    <MenuItem value="12">S+R+H</MenuItem>
                    <MenuItem value="13">S+C+H</MenuItem>
                    <MenuItem value="14">R+C+H</MenuItem>
                    <MenuItem value="15">S+R+C+H</MenuItem>
                    <MenuItem value="88">Others (specify)</MenuItem>
                    <MenuItem value="99">Unknown</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* 31.3 Date of Completion */}
            {isFieldVisible('cancerDirectedTreatment.dateOfCompletion') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="31.3 Date of Completion"
                  name="cancerDirectedTreatment.dateOfCompletion"
                  value={formData.cancerDirectedTreatment?.dateOfCompletion}
                  onChange={(e) => handleNestedChange('cancerDirectedTreatment', 'dateOfCompletion', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
          </>
        )}

        {/* 32. Date of Last Contact */}
        {isFieldVisible('dateOfLastContact') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="32. Date of Last Contact"
              name="dateOfLastContact"
              value={formData.dateOfLastContact}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        )}

        {/* 33. Date of Death */}
        {isFieldVisible('dateOfDeath') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="33. Date of Death"
              name="dateOfDeath"
              value={formData.dateOfDeath}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              helperText="For all deaths, Core Form - Mortality Data has to be completed"
            />
          </Grid>
        )}

        {/* 34. For Matched Deaths */}
        {isFieldVisible('mortalityRegNo') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="34. Mortality Registration Number"
              name="mortalityRegNo"
              value={formData.mortalityRegNo}
              onChange={handleChange}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default ClinicalStageAndTreatment;