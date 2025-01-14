import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  RemoveRedEye as ViewIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  reviewData,
  selectDistrictData,
  selectLoading
} from '../../../redux/slices/centerAdminSlice';

const REVIEW_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  RETURNED: 'returned'
};

export default function DataQualityPanel() {
  const dispatch = useDispatch();
  const data = useSelector(selectDistrictData);
  const loading = useSelector(state => selectLoading(state).review);
  
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewAction, setReviewAction] = useState('');

  const handleReview = async () => {
    if (selectedEntry && reviewAction) {
      await dispatch(reviewData({
        dataId: selectedEntry.id,
        reviewData: {
          status: reviewAction,
          note: reviewNote
        }
      }));
      setReviewDialog(false);
      setSelectedEntry(null);
      setReviewNote('');
      setReviewAction('');
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Hospital</TableCell>
              <TableCell>Submitted By</TableCell>
              <TableCell>Submission Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.id}</TableCell>
                <TableCell>
                  <Chip
                    label={entry.type}
                    color={entry.type === 'incidence' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{entry.hospital}</TableCell>
                <TableCell>{entry.submittedBy}</TableCell>
                <TableCell>{new Date(entry.submissionDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={entry.status}
                    color={entry.status === 'pending' ? 'warning' : 
                          entry.status === 'approved' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View Details">
                    <IconButton 
                      size="small"
                      onClick={() => {
                        setSelectedEntry(entry);
                        setReviewDialog(true);
                      }}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Approve">
                    <IconButton 
                      color="success" 
                      size="small"
                      onClick={() => {
                        setSelectedEntry(entry);
                        setReviewAction(REVIEW_STATUSES.APPROVED);
                        setReviewDialog(true);
                      }}
                    >
                      <CheckIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Return">
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => {
                        setSelectedEntry(entry);
                        setReviewAction(REVIEW_STATUSES.RETURNED);
                        setReviewDialog(true);
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Review Dialog */}
      <Dialog 
        open={reviewDialog} 
        onClose={() => setReviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Review Entry
          <IconButton
            onClick={() => setReviewDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <BackIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedEntry && (
            <Box sx={{ mt: 2 }}>
              {/* Display entry details here */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Review Action</InputLabel>
                <Select
                  value={reviewAction}
                  onChange={(e) => setReviewAction(e.target.value)}
                  label="Review Action"
                >
                  <MenuItem value={REVIEW_STATUSES.APPROVED}>Approve</MenuItem>
                  <MenuItem value={REVIEW_STATUSES.RETURNED}>Return</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Review Notes"
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                required={reviewAction === REVIEW_STATUSES.RETURNED}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleReview}
            disabled={loading || !reviewAction || (reviewAction === REVIEW_STATUSES.RETURNED && !reviewNote)}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}