'use client';

import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Grid, Card, CardContent, List, ListItem, ListItemText, 
  Divider, CircularProgress, Tabs, Tab, Button, Chip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Stack
} from '@mui/material';
import { 
  HeartPulse, FileText, Stethoscope, BarChart3, ChevronRight, 
  History, Pill, Calendar, FileImage, Download, X, FilePlus2
} from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { PatientPageContainer } from '@/components/patient/PatientComponents';
import { getMedicalRecords } from '@/services/patientService';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PatientMedicalFilePage() {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);

  const recordTypes = ['All', 'Diagnosis', 'Lab Test', 'Imaging', 'Follow-up', 'Acute Care'];

  useEffect(() => {
    async function fetchMedicalRecords() {
      try {
        setLoading(true);
        const data = await getMedicalRecords();
        setMedicalRecords(data);
      } catch (err) {
        setError('Failed to load medical records. Please try again later.');
        console.error('Error loading medical records:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMedicalRecords();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePdfOpen = (record) => {
    setSelectedPdf(record);
    setPdfDialogOpen(true);
    setPageNumber(1);
  };

  const handlePdfClose = () => {
    setPdfDialogOpen(false);
    setSelectedPdf(null);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.max(1, Math.min(newPageNumber, numPages));
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const filteredRecords = tabValue === 0 
    ? medicalRecords 
    : medicalRecords.filter(record => record.type === recordTypes[tabValue]);

  return (
    <PatientPageContainer
      title="Medical File"
      description="View your complete medical history and records"
    >
      {loading ? (
        <Box className="flex items-center justify-center h-64">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box className="flex items-center justify-center h-64">
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      ) : (
        <>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            className="mb-6 border-b border-border"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {recordTypes.map((type, index) => (
              <Tab 
                key={type} 
                label={
                  <Box className="flex items-center">
                    {index === 0 && <History className="mr-2 h-4 w-4" />}
                    {index === 1 && <HeartPulse className="mr-2 h-4 w-4" />}
                    {index === 2 && <BarChart3 className="mr-2 h-4 w-4" />}
                    {index === 3 && <FileImage className="mr-2 h-4 w-4" />}
                    {index === 4 && <Calendar className="mr-2 h-4 w-4" />}
                    {index === 5 && <Stethoscope className="mr-2 h-4 w-4" />}
                    <span>{type}</span>
                    <Chip 
                      size="small" 
                      label={index === 0 
                        ? medicalRecords.length 
                        : medicalRecords.filter(r => r.type === type).length
                      } 
                      className="ml-2 bg-primary/10 text-primary"
                    />
                  </Box>
                } 
              />
            ))}
          </Tabs>

          {filteredRecords.length === 0 ? (
            <Box className="text-center p-8 bg-muted rounded-lg">
              <FilePlus2 size={48} className="mx-auto text-muted-foreground mb-4" />
              <Typography variant="h6" className="font-semibold">
                No medical records found
              </Typography>
              <Typography variant="body2" className="text-muted-foreground">
                Your medical history will appear here once records are added
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredRecords.map((record) => (
                <Grid item xs={12} md={6} key={record.id}>
                  <Card className="h-full border border-border bg-card hover:shadow-md transition-shadow">
                    <CardContent>
                      <Box className="flex items-start justify-between mb-3">
                        <Box className="flex items-center">
                          {record.type === 'Diagnosis' && (
                            <Avatar className="bg-red-100 text-red-600 mr-3">
                              <HeartPulse size={20} />
                            </Avatar>
                          )}
                          {record.type === 'Lab Test' && (
                            <Avatar className="bg-blue-100 text-blue-600 mr-3">
                              <BarChart3 size={20} />
                            </Avatar>
                          )}
                          {record.type === 'Imaging' && (
                            <Avatar className="bg-purple-100 text-purple-600 mr-3">
                              <FileImage size={20} />
                            </Avatar>
                          )}
                          {record.type === 'Follow-up' && (
                            <Avatar className="bg-green-100 text-green-600 mr-3">
                              <Calendar size={20} />
                            </Avatar>
                          )}
                          {record.type === 'Acute Care' && (
                            <Avatar className="bg-orange-100 text-orange-600 mr-3">
                              <Stethoscope size={20} />
                            </Avatar>
                          )}
                          <Box>
                            <Typography variant="h6" className="font-semibold">
                              {record.description}
                            </Typography>
                            <Typography variant="body2" className="text-muted-foreground">
                              {new Date(record.date).toLocaleDateString('en-US', { 
                                year: 'numeric', month: 'long', day: 'numeric' 
                              })}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip 
                          label={record.type} 
                          size="small"
                          className={`
                            ${record.type === 'Diagnosis' ? 'bg-red-50 text-red-600 border-red-200' : ''}
                            ${record.type === 'Lab Test' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                            ${record.type === 'Imaging' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}
                            ${record.type === 'Follow-up' ? 'bg-green-50 text-green-600 border-green-200' : ''}
                            ${record.type === 'Acute Care' ? 'bg-orange-50 text-orange-600 border-orange-200' : ''}
                          `}
                        />
                      </Box>
                      
                      <Box className="mb-3">
                        <Typography variant="body2" className="mb-2">
                          <strong>Provider:</strong> {record.provider}
                        </Typography>
                        <Typography variant="body2" className="mb-2">
                          <strong>Notes:</strong> {record.notes}
                        </Typography>
                      </Box>
                      
                      {record.type === 'Lab Test' && record.results && (
                        <Box className="mt-4">
                          <Typography variant="subtitle2" className="font-semibold mb-2">
                            Test Results
                          </Typography>
                          <Box className="bg-muted/50 p-3 rounded-md">
                            <List disablePadding dense>
                              {record.results.map((result, idx) => (
                                <ListItem key={idx} className="px-0 py-1">
                                  <ListItemText
                                    primaryTypographyProps={{ component: 'div' }}
                                    primary={
                                      <Box className="flex justify-between">
                                        <Typography variant="body2" component="div" className="font-semibold">
                                          {result.name}
                                        </Typography>
                                        <Typography 
                                          variant="body2" 
                                          component="div"
                                          className={`font-semibold`}
                                        >
                                          {result.value} {result.unit}
                                        </Typography>
                                      </Box>
                                    }
                                    secondaryTypographyProps={{ component: 'div' }}
                                    secondary={
                                      <Typography variant="caption" component="div" className="text-muted-foreground">
                                        Normal Range: {result.normalRange}
                                      </Typography>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        </Box>
                      )}
                      
                      {record.type === 'Imaging' && record.imageUrl && (
                        <Button
                          variant="outlined"
                          startIcon={<FileImage size={16} />}
                          onClick={() => handlePdfOpen(record)}
                          className="mt-3"
                          fullWidth
                        >
                          View {record.description} Image
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          
          {/* PDF Viewer Dialog */}
          <Dialog
            open={pdfDialogOpen}
            onClose={handlePdfClose}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle className="flex justify-between items-center bg-primary text-primary-foreground">
              <Typography variant="h6">{selectedPdf?.description}</Typography>
              <IconButton onClick={handlePdfClose} className="text-primary-foreground">
                <X size={20} />
              </IconButton>
            </DialogTitle>
            <DialogContent className="p-0 bg-black min-h-[60vh] flex flex-col items-center justify-center">
              {selectedPdf && (
                <Document
                  file={selectedPdf.imageUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <Box className="flex items-center justify-center h-full">
                      <CircularProgress />
                    </Box>
                  }
                  error={
                    <Box className="flex items-center justify-center h-full">
                      <Typography color="error">
                        Failed to load PDF. Please try again later.
                      </Typography>
                    </Box>
                  }
                >
                  <Page 
                    pageNumber={pageNumber} 
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </Document>
              )}
            </DialogContent>
            <DialogActions className="justify-between bg-muted p-3">
              <Box className="flex items-center">
                <Button 
                  onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
                  disabled={scale <= 0.5}
                  className="mr-2"
                >
                  Zoom Out
                </Button>
                <Button 
                  onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
                  disabled={scale >= 2}
                >
                  Zoom In
                </Button>
              </Box>
              <Box className="flex items-center">
                <Button onClick={previousPage} disabled={pageNumber <= 1} className="mr-2">
                  Previous
                </Button>
                <Typography variant="body2" className="mx-2">
                  Page {pageNumber} of {numPages}
                </Typography>
                <Button onClick={nextPage} disabled={pageNumber >= numPages} className="ml-2">
                  Next
                </Button>
              </Box>
              <Button 
                variant="contained"
                startIcon={<Download size={16} />}
                onClick={() => window.open(selectedPdf?.imageUrl, '_blank')}
                className="bg-primary text-primary-foreground"
              >
                Download
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </PatientPageContainer>
  );
} 