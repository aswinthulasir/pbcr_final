import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  RadioGroup,
  Radio,
  FormControlLabel,
  Box
} from '@mui/material';
import { shouldShowField } from './shared/utils';

const IdentifyingInformation = ({
  formData,
  handleChange,
  handleNestedChange,
  fieldVisibility,
}) => {
  // Helper function to determine field visibility
  const isFieldVisible = (fieldName) => {
    console.log(`Checking visibility for ${fieldName}:`, fieldVisibility);
    if (fieldVisibility === 'all') {
      return true;  // Show all fields when 'all' is selected
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
        I. IDENTIFYING INFORMATION
      </Typography>

      <Grid container spacing={3}>
        {/* 1-2: Centre Information and Registration */}
        {renderSectionDivider("Centre Information & Registration")}
        {isFieldVisible('centreName') && (
          <>
            <Grid item xs={12} md={8}>
              <TextField
                required
                fullWidth
                label="1. Name of Participating Centre"
                name="centreName"
                value={formData.centreName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                label="Centre Code"
                name="centreCode"
                value={formData.centreCode}
                onChange={handleChange}
              />
            </Grid>
          </>
        )}

        {(isFieldVisible('registrationNumber.year') || isFieldVisible('registrationNumber.regNo')) && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="2. Registration Year"
                name="registrationNumber.year"
                value={formData.registrationNumber.year}
                onChange={(e) => handleNestedChange('registrationNumber', 'year', e.target.value)}
                helperText="First 2 digits for year"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Registration Number"
                name="registrationNumber.regNo"
                value={formData.registrationNumber.regNo}
                onChange={(e) => handleNestedChange('registrationNumber', 'regNo', e.target.value)}
                helperText="Next 5 digits for registration number"
              />
            </Grid>
          </>
        )}

        {/* 3: Source Information */}
        {renderSectionDivider("3. Source Information")}
        {isFieldVisible('sourceRegistration.name') && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="3.1(a) Name of Source of Registration"
                name="sourceInfo.name"
                value={formData.sourceInfo.name}
                onChange={(e) => handleNestedChange('sourceInfo', 'name', e.target.value)}
                helperText="Reporting Institution (RI) / Hospital"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Source Code"
                name="sourceInfo.code"
                value={formData.sourceInfo.code}
                onChange={(e) => handleNestedChange('sourceInfo', 'code', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="3.1(b) Department/Unit"
                name="sourceInfo.department"
                value={formData.sourceInfo.department}
                onChange={(e) => handleNestedChange('sourceInfo', 'department', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="3.1(c) Physician Name"
                name="sourceInfo.physician"
                value={formData.sourceInfo.physician}
                onChange={(e) => handleNestedChange('sourceInfo', 'physician', e.target.value)}
              />
            </Grid>
          </>
        )}

        {isFieldVisible('hospitalRegNo') && (
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="3.2 Hospital Registration Number"
              name="hospitalRegNo"
              value={formData.hospitalRegNo}
              onChange={handleChange}
            />
          </Grid>
        )}

        {isFieldVisible('dateOfRegistration') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="3.3 Date of Registration"
              name="dateOfRegistration"
              value={formData.dateOfRegistration}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        )}

        {isFieldVisible('caseRegisteredAs') && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>3.4 Case Registered As</InputLabel>
              <Select
                name="caseRegisteredAs"
                value={formData.caseRegisteredAs}
                onChange={handleChange}
                label="3.4 Case Registered As"
              >
                <MenuItem value="1">Out-patient (OP)</MenuItem>
                <MenuItem value="2">In-patient (IP)</MenuItem>
                <MenuItem value="3">OP and IP</MenuItem>
                <MenuItem value="4">Not Registered - Clinical Consultation/Opinion</MenuItem>
                <MenuItem value="5">Not Registered - Pathology Consultation/Opinion</MenuItem>
                <MenuItem value="8">Others (specify)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* 4: Other Sources */}
        {isFieldVisible('otherSources') && (
          <>
            {renderSectionDivider("4. Other Sources of Registration/Referral")}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Hospital/LAB/NH No."
                name="otherSources[0].hospitalNo"
                value={formData.otherSources[0].hospitalNo}
                onChange={(e) => handleNestedChange('otherSources[0]', 'hospitalNo', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                name="otherSources[0].date"
                value={formData.otherSources[0].date}
                onChange={(e) => handleNestedChange('otherSources[0]', 'date', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </>
        )}

        {/* 5: First Diagnosis */}
        {isFieldVisible('dateOfFirstDiagnosis') && (
          <>
            {renderSectionDivider("5. First Diagnosis")}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="date"
                label="Date of First Diagnosis"
                name="dateOfFirstDiagnosis"
                value={formData.dateOfFirstDiagnosis}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                helperText="Generally the earliest of the dates in 3.3 or 4 above"
              />
            </Grid>
          </>
        )}

        {/* 6: Patient Information */}
        {renderSectionDivider("6. Patient Information")}
        {isFieldVisible('fullName.first') && (
          <>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                6.1 Full Name of Patient (At least one name is compulsory)
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="patientName.first"
                value={formData.patientName.first}
                onChange={(e) => handleNestedChange('patientName', 'first', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Second Name"
                name="patientName.second"
                value={formData.patientName.second}
                onChange={(e) => handleNestedChange('patientName', 'second', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Last Name"
                name="patientName.last"
                value={formData.patientName.last}
                onChange={(e) => handleNestedChange('patientName', 'last', e.target.value)}
              />
            </Grid>
          </>
        )}

        {isFieldVisible('aadhaar') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="6.2 Aadhaar (Unique Identification) Number"
              name="aadhaarNo"
              value={formData.aadhaarNo}
              onChange={handleChange}
            />
          </Grid>
        )}

        {/* 7: Relative Information */}
        {renderSectionDivider("7. Relative Information")}
        {isFieldVisible('relativeInfo') && (
          <>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                7.1 Name of Relative/Next of Kin/Accompanying Person
              </Typography>
            </Grid>
            {['father', 'mother', 'spouse', 'son', 'daughter', 'others'].map((relative) => (
              <Grid item xs={12} md={6} key={relative}>
                <TextField
                  fullWidth
                  label={`${relative.charAt(0).toUpperCase() + relative.slice(1)}'s Name`}
                  name={`relatives.${relative}.name`}
                  value={formData.relatives[relative].name}
                  onChange={(e) => handleNestedChange(`relatives.${relative}`, 'name', e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name={`relatives.${relative}.mobileNo`}
                  value={formData.relatives[relative].mobileNo}
                  onChange={(e) => handleNestedChange(`relatives.${relative}`, 'mobileNo', e.target.value)}
                  sx={{ mt: 1 }}
                />
              </Grid>
            ))}
          </>
        )}

        {isFieldVisible('relativeCode') && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>7.2 Code of Relative/Next of Kin</InputLabel>
              <Select
                name="relativeCode"
                value={formData.relativeCode}
                onChange={handleChange}
                label="7.2 Code of Relative/Next of Kin"
              >
                <MenuItem value="1">Father</MenuItem>
                <MenuItem value="2">Mother</MenuItem>
                <MenuItem value="3">Husband</MenuItem>
                <MenuItem value="4">Wife</MenuItem>
                <MenuItem value="5">Son</MenuItem>
                <MenuItem value="6">Daughter</MenuItem>
                <MenuItem value="7">Other Relative/Friend/Neighbour</MenuItem>
                <MenuItem value="8">Others (including accompanying person)</MenuItem>
                <MenuItem value="9">Unknown</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* 8-14: Additional Identifying Information */}
        {/* 8. Place of Residence */}
        {/* 8. Place of Residence */}
        {renderSectionDivider("8. Place of Residence")}
        {/* Type is mandatory */}
        {isFieldVisible('placeOfResidence.type') && (
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Place of Usual Residence</Typography>
              <RadioGroup
                name="placeOfResidence.type"
                value={formData.placeOfResidence?.type}
                onChange={(e) => handleNestedChange('placeOfResidence', 'type', e.target.value)}
              >
                <FormControlLabel value="urban" control={<Radio />} label="Urban Areas (Town/Cities)" />
                <FormControlLabel value="rural" control={<Radio />} label="Non-urban/Rural Areas" />
              </RadioGroup>
            </FormControl>
          </Grid>
        )}

        {formData.placeOfResidence?.type === 'urban' ? (
          <>
            {/* Urban fields - check visibility for each */}
            {isFieldVisible('placeOfResidence.urban.houseNo') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="House No."
                  name="placeOfResidence.urban.houseNo"
                  value={formData.placeOfResidence?.urban?.houseNo}
                  onChange={(e) => handleNestedChange('placeOfResidence.urban', 'houseNo', e.target.value)}
                />
              </Grid>
            )}

            {isFieldVisible('placeOfResidence.urban.roadName') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Road/Street Name"
                  name="placeOfResidence.urban.roadName"
                  value={formData.placeOfResidence?.urban?.roadName}
                  onChange={(e) => handleNestedChange('placeOfResidence.urban', 'roadName', e.target.value)}
                />
              </Grid>
            )}

            {isFieldVisible('placeOfResidence.urban.areaLocality') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Area/Locality"
                  name="placeOfResidence.urban.areaLocality"
                  value={formData.placeOfResidence?.urban?.areaLocality}
                  onChange={(e) => handleNestedChange('placeOfResidence.urban', 'areaLocality', e.target.value)}
                />
              </Grid>
            )}

            {isFieldVisible('placeOfResidence.urban.wardNumber') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ward/Corporation/Division"
                  name="placeOfResidence.urban.wardNumber"
                  value={formData.placeOfResidence?.urban?.wardNumber}
                  onChange={(e) => handleNestedChange('placeOfResidence.urban', 'wardNumber', e.target.value)}
                />
              </Grid>
            )}

            {isFieldVisible('placeOfResidence.urban.cityTown') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City/Town"
                  name="placeOfResidence.urban.cityTown"
                  value={formData.placeOfResidence?.urban?.cityTown}
                  onChange={(e) => handleNestedChange('placeOfResidence.urban', 'cityTown', e.target.value)}
                />
              </Grid>
            )}
            {/* Common fields - district and pincode are mandatory */}
            {isFieldVisible('placeOfResidence.urban.district') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="District"
                  name="placeOfResidence.urban.district"
                  value={formData.placeOfResidence?.urban?.district}
                  onChange={(e) => handleNestedChange('placeOfResidence.urban', 'district', e.target.value)}
                />
              </Grid>
            )}

            {isFieldVisible('placeOfResidence.urban.pinCode') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PIN Code"
                  name="placeOfResidence.urban.pinCode"
                  value={formData.placeOfResidence?.urban?.pinCode}
                  onChange={(e) => handleNestedChange('placeOfResidence.urban', 'pinCode', e.target.value)}
                />
              </Grid>
            )}
          </>
        ) : (
          <>
            {/* Rural fields - check visibility for each */}
            {isFieldVisible('placeOfResidence.rural.houseNoAndWard') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="House No. and Ward"
                  name="placeOfResidence.rural.houseNoAndWard"
                  value={formData.placeOfResidence?.rural?.houseNoAndWard}
                  onChange={(e) => handleNestedChange('placeOfResidence.rural', 'houseNoAndWard', e.target.value)}
                />
              </Grid>
            )}

            {isFieldVisible('placeOfResidence.rural.gramPanchayat') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name of Gram Panchayat/Village"
                  name="placeOfResidence.rural.gramPanchayat"
                  value={formData.placeOfResidence?.rural?.gramPanchayat}
                  onChange={(e) => handleNestedChange('placeOfResidence.rural', 'gramPanchayat', e.target.value)}
                />
              </Grid>
            )}

            {isFieldVisible('placeOfResidence.rural.subUnitDistrict') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name of Sub-Unit of District"
                  name="placeOfResidence.rural.subUnitDistrict"
                  value={formData.placeOfResidence?.rural?.subUnitDistrict}
                  onChange={(e) => handleNestedChange('placeOfResidence.rural', 'subUnitDistrict', e.target.value)}
                />
              </Grid>
            )}

            {isFieldVisible('placeOfResidence.rural.phcName') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name of PHC/Sub Centre"
                  name="placeOfResidence.rural.phcName"
                  value={formData.placeOfResidence?.rural?.phcName}
                  onChange={(e) => handleNestedChange('placeOfResidence.rural', 'phcName', e.target.value)}
                />
              </Grid>
            )}
            {/* Common fields - district and pincode are mandatory */}
            {isFieldVisible('placeOfResidence.rural.district') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="District"
                  name="placeOfResidence.rural.district"
                  value={formData.placeOfResidence?.rural?.district}
                  onChange={(e) => handleNestedChange('placeOfResidence.rural', 'district', e.target.value)}
                />
              </Grid>
            )}

            {isFieldVisible('placeOfResidence.rural.pinCode') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PIN Code"
                  name="placeOfResidence.rural.pinCode"
                  value={formData.placeOfResidence?.rural?.pinCode}
                  onChange={(e) => handleNestedChange('placeOfResidence.rural', 'pinCode', e.target.value)}
                />
              </Grid>
            )}
              </>
            )}



        {/* Contact Information - all recommended */}
        {isFieldVisible('placeOfResidence.contactInfo.telephone.office') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Telephone (Office)"
              name="placeOfResidence.contactInfo.telephone.office"
              value={formData.placeOfResidence?.contactInfo?.telephone?.office}
              onChange={(e) => handleNestedChange('placeOfResidence.contactInfo.telephone', 'office', e.target.value)}
            />
          </Grid>
        )}
        {isFieldVisible('placeOfResidence.contactInfo.telephone.residence') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Telephone (Residence)"
              name="placeOfResidence.contactInfo.telephone.residence"
              value={formData.placeOfResidence?.contactInfo?.telephone?.residence}
              onChange={(e) => handleNestedChange('placeOfResidence.contactInfo.telephone', 'residence', e.target.value)}
            />
          </Grid>
        )}

        {isFieldVisible('placeOfResidence.contactInfo.mobile') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mobile"
              name="placeOfResidence.contactInfo.mobile"
              value={formData.placeOfResidence?.contactInfo?.mobile}
              onChange={(e) => handleNestedChange('placeOfResidence.contactInfo', 'mobile', e.target.value)}
            />
          </Grid>
        )}

        {isFieldVisible('placeOfResidence.contactInfo.email') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="placeOfResidence.contactInfo.email"
              value={formData.placeOfResidence?.contactInfo?.email}
              onChange={(e) => handleNestedChange('placeOfResidence.contactInfo', 'email', e.target.value)}
            />
          </Grid>
        )}

        {/* 9. Duration of Stay - mandatory */}
        {isFieldVisible('durationOfStay') && (
          <>
            {renderSectionDivider("9. Duration of Stay")}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Duration of Stay (in years)"
                name="durationOfStay"
                type="number"
                value={formData.durationOfStay}
                onChange={handleChange}
                helperText="At the place of usual residence"
              />
            </Grid>
          </>
        )}

        {/* 10. Other Addresses - all optional */}
        {isFieldVisible('otherAddresses') && (
          <>
            {renderSectionDivider("10. Other Addresses")}
            {['local', 'office', 'native'].map((addressType) => (
              <React.Fragment key={addressType}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    {addressType === 'local' ? '10.1 Local Address' :
                    addressType === 'office' ? '10.2 Office/Caretaker/Family Doctor Address' :
                    '10.3 Native Place Address'}
                  </Typography>
                </Grid>
                {isFieldVisible(`otherAddresses.${addressType}.address`) && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Address"
                      name={`otherAddresses.${addressType}.address`}
                      value={formData.otherAddresses?.[addressType]?.address}
                      onChange={(e) => handleNestedChange(`otherAddresses.${addressType}`, 'address', e.target.value)}
                    />
                  </Grid>
                )}
                {isFieldVisible(`otherAddresses.${addressType}.cityTownDistrict`) && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="City/Town/District"
                      name={`otherAddresses.${addressType}.cityTownDistrict`}
                      value={formData.otherAddresses?.[addressType]?.cityTownDistrict}
                      onChange={(e) => handleNestedChange(`otherAddresses.${addressType}`, 'cityTownDistrict', e.target.value)}
                    />
                  </Grid>
                )}
                {isFieldVisible(`otherAddresses.${addressType}.pinCode`) && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="PIN Code"
                      name={`otherAddresses.${addressType}.pinCode`}
                      value={formData.otherAddresses?.[addressType]?.pinCode}
                      onChange={(e) => handleNestedChange(`otherAddresses.${addressType}`, 'pinCode', e.target.value)}
                    />
                  </Grid>
                )}
              </React.Fragment>
            ))}
          </>
        )}

        {/* 11. Place of Birth - all optional */}
        {isFieldVisible('placeOfBirth') && (
          <>
            {renderSectionDivider("11. Place of Birth")}
            {isFieldVisible('placeOfBirth.address') && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Address"
                  name="placeOfBirth.address"
                  value={formData.placeOfBirth?.address}
                  onChange={(e) => handleNestedChange('placeOfBirth', 'address', e.target.value)}
                />
              </Grid>
            )}
            {isFieldVisible('placeOfBirth.cityTownDistrict') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City/Town/District"
                  name="placeOfBirth.cityTownDistrict"
                  value={formData.placeOfBirth?.cityTownDistrict}
                  onChange={(e) => handleNestedChange('placeOfBirth', 'cityTownDistrict', e.target.value)}
                />
              </Grid>
            )}
        {isFieldVisible('placeOfBirth.pinCode') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="PIN Code"
              name="placeOfBirth.pinCode"
              value={formData.placeOfBirth?.pinCode}
              onChange={(e) => handleNestedChange('placeOfBirth', 'pinCode', e.target.value)}
            />
          </Grid>
        )}
        </>
        )}
        {/* Age and Sex Information */}
        {renderSectionDivider("Age and Sex Information")}
        {isFieldVisible('age') && (
          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              label="12. Age (in years)"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
            />
          </Grid>
        )}
        {isFieldVisible('dateofbirth') && (
          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              label="12.1 Date of Birth"
              name="Date of Birth"
              type="date"
              value={formData.dateofBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        )}


        {isFieldVisible('ageEstimatedBy') && (
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>13. Age Estimated By</InputLabel>
              <Select
                name="ageEstimatedBy"
                value={formData.ageEstimatedBy}
                onChange={handleChange}
                label="Age Estimated By"
              >
                <MenuItem value="1">Patient</MenuItem>
                <MenuItem value="2">Person Accompanying Patient</MenuItem>
                <MenuItem value="3">Social Investigator</MenuItem>
                <MenuItem value="8">Others (specify)</MenuItem>
                <MenuItem value="9">Unknown</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {isFieldVisible('sex') && (
          <Grid item xs={12} md={4}>
            <FormControl fullWidth required>
              <InputLabel>14. Sex</InputLabel>
              <Select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                label="Sex"
              >
                <MenuItem value="1">Male</MenuItem>
                <MenuItem value="2">Female</MenuItem>
                <MenuItem value="8">Others</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default IdentifyingInformation;