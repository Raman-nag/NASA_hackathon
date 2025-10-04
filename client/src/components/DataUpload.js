import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUpload, FaFileCsv, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const UploadContainer = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const UploadTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  background: ${props => props.theme.gradients.nebula};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const UploadDescription = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.2rem;
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const DropzoneContainer = styled.div`
  border: 2px dashed ${props => props.isDragActive ? props.theme.colors.accent : props.theme.colors.border};
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  background: ${props => props.isDragActive ? 'rgba(0, 212, 255, 0.1)' : 'rgba(26, 35, 50, 0.6)'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${props => props.theme.colors.accent};
    background: rgba(0, 212, 255, 0.05);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const UploadIcon = styled.div`
  width: 100px;
  height: 100px;
  background: ${props => props.theme.gradients.space};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  font-size: 2.5rem;
  color: white;
  transition: all 0.3s ease;

  ${DropzoneContainer}:hover & {
    transform: scale(1.1);
  }
`;

const UploadText = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 15px;
`;

const UploadSubtext = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.1rem;
  margin-bottom: 20px;
`;

const FileInfo = styled.div`
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const FileIcon = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => props.theme.gradients.space};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
`;

const FileDetails = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 5px;
`;

const FileSize = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const UploadButton = styled.button`
  background: ${props => props.theme.gradients.space};
  color: white;
  border: none;
  border-radius: 50px;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px auto 0;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover:not(:disabled)::before {
    left: 100%;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 40px;
  background: rgba(26, 35, 50, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 30px;
`;

const ResultsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ResultCard = styled.div`
  background: rgba(11, 20, 38, 0.8);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.accent};
    transform: translateY(-5px);
  }
`;

const ResultIcon = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => props.gradient};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 1.2rem;
  color: white;
`;

const ResultValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 5px;
`;

const ResultLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid ${props => props.theme.colors.border};
  border-top: 3px solid ${props => props.theme.colors.accent};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const DataUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setResults(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('/api/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResults(response.data);
      toast.success(`Successfully processed ${response.data.totalProcessed} data points!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getClassificationStats = () => {
    if (!results?.predictions) return {};
    
    return results.predictions.reduce((acc, pred) => {
      acc[pred.prediction] = (acc[pred.prediction] || 0) + 1;
      return acc;
    }, {});
  };

  const classificationStats = getClassificationStats();

  return (
    <UploadContainer>
      <Container>
        <UploadTitle>Upload Transit Data</UploadTitle>
        <UploadDescription>
          Upload a CSV file containing exoplanet transit data for AI analysis. 
          The file should include columns for orbital period, transit duration, planetary radius, and stellar parameters.
        </UploadDescription>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
            <input {...getInputProps()} />
            <UploadIcon>
              <FaUpload />
            </UploadIcon>
            <UploadText>
              {isDragActive ? 'Drop the file here...' : 'Drag & drop a CSV file here'}
            </UploadText>
            <UploadSubtext>
              or click to select a file
            </UploadSubtext>
          </DropzoneContainer>
        </motion.div>

        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FileInfo>
              <FileIcon>
                <FaFileCsv />
              </FileIcon>
              <FileDetails>
                <FileName>{selectedFile.name}</FileName>
                <FileSize>{formatFileSize(selectedFile.size)}</FileSize>
              </FileDetails>
            </FileInfo>

            <UploadButton onClick={handleUpload} disabled={uploading}>
              {uploading ? (
                <>
                  <FaSpinner className="fa-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FaUpload />
                  Analyze Data
                </>
              )}
            </UploadButton>
          </motion.div>
        )}

        {uploading && (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Analyzing transit data with AI...</LoadingText>
          </LoadingContainer>
        )}

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ResultsContainer>
              <ResultsTitle>Analysis Results</ResultsTitle>
              
              <ResultsGrid>
                <ResultCard>
                  <ResultIcon gradient="linear-gradient(135deg, #4CAF50 0%, #45a049 100%)">
                    <FaCheckCircle />
                  </ResultIcon>
                  <ResultValue>{results.totalProcessed}</ResultValue>
                  <ResultLabel>Total Processed</ResultLabel>
                </ResultCard>

                <ResultCard>
                  <ResultIcon gradient="linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)">
                    <FaCheckCircle />
                  </ResultIcon>
                  <ResultValue>{classificationStats['Confirmed Exoplanet'] || 0}</ResultValue>
                  <ResultLabel>Confirmed Exoplanets</ResultLabel>
                </ResultCard>

                <ResultCard>
                  <ResultIcon gradient="linear-gradient(135deg, #FF9800 0%, #F57C00 100%)">
                    <FaExclamationTriangle />
                  </ResultIcon>
                  <ResultValue>{classificationStats['Planetary Candidate'] || 0}</ResultValue>
                  <ResultLabel>Planetary Candidates</ResultLabel>
                </ResultCard>

                <ResultCard>
                  <ResultIcon gradient="linear-gradient(135deg, #F44336 0%, #D32F2F 100%)">
                    <FaExclamationTriangle />
                  </ResultIcon>
                  <ResultValue>{classificationStats['False Positive'] || 0}</ResultValue>
                  <ResultLabel>False Positives</ResultLabel>
                </ResultCard>
              </ResultsGrid>
            </ResultsContainer>
          </motion.div>
        )}
      </Container>
    </UploadContainer>
  );
};

export default DataUpload;

