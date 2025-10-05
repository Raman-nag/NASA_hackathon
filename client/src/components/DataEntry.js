import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaRocket, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaSearch, FaDatabase, FaChartLine } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const EntryContainer = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const EntryTitle = styled.h1`
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

const EntryDescription = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.2rem;
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const FormContainer = styled(motion.div)`
  background: rgba(26, 35, 50, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ColumnSelectionContainer = styled.div`
  margin-bottom: 40px;
`;

const ColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  background: rgba(11, 20, 38, 0.3);
`;

const ColumnItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background: ${props => props.selected ? 'rgba(0, 212, 255, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.selected ? props.theme.colors.accent : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 212, 255, 0.05);
    border-color: ${props => props.theme.colors.accent};
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${props => props.theme.colors.accent};
`;

const ColumnInfo = styled.div`
  flex: 1;
`;

const ColumnName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const ColumnDetails = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const InputSection = styled.div`
  margin-bottom: 30px;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 1.1rem;
`;

const Input = styled.input`
  background: rgba(11, 20, 38, 0.8);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 15px;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
    outline: none;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SubmitButton = styled.button`
  background: ${props => props.theme.gradients.space};
  color: white;
  border: none;
  border-radius: 50px;
  padding: 18px 50px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0 auto;
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
`;

const ResultsContainer = styled(motion.div)`
  background: rgba(26, 35, 50, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 40px;
  text-align: center;
`;

const ResultsTitle = styled.h3`
  font-size: 2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 30px;
`;

const ExactMatchCard = styled.div`
  background: rgba(76, 175, 80, 0.1);
  border: 2px solid #4CAF50;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
`;

const ExactMatchIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2rem;
  color: white;
`;

const ExactMatchTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 600;
  color: #4CAF50;
  margin-bottom: 10px;
`;

const MLResultsCard = styled.div`
  background: rgba(11, 20, 38, 0.8);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
`;

const ClassificationCard = styled.div`
  background: rgba(11, 20, 38, 0.8);
  border: 1px solid ${props => props.borderColor || props.theme.colors.border};
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.gradient || props.theme.gradients.space};
  }
`;

const ClassificationIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${props => props.gradient};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2rem;
  color: white;
`;

const ClassificationTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 10px;
`;

const ConfidenceScore = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.accent};
  margin-bottom: 20px;
`;

const ConfidenceBar = styled.div`
  width: 100%;
  height: 10px;
  background: rgba(11, 20, 38, 0.8);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const ConfidenceFill = styled.div`
  height: 100%;
  background: ${props => props.theme.gradients.space};
  border-radius: 5px;
  transition: width 0.5s ease;
  width: ${props => props.percentage}%;
`;

const NeighborsSection = styled.div`
  margin-top: 30px;
`;

const NeighborsTitle = styled.h4`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
`;

const NeighborsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const NeighborCard = styled.div`
  background: rgba(11, 20, 38, 0.6);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.accent};
    transform: translateY(-2px);
  }
`;

const NeighborHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const NeighborIndex = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.accent};
`;

const SimilarityScore = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const NeighborDetails = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
`;

const DataSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const DataItem = styled.div`
  background: rgba(11, 20, 38, 0.6);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 15px;
`;

const DataLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const DataValue = styled.div`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-size: 1.1rem;
`;

const getClassificationStyle = (classification) => {
  switch (classification) {
    case 'Confirmed':
      return {
        gradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        borderColor: '#4CAF50',
        icon: FaCheckCircle
      };
    case 'Candidate':
      return {
        gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
        borderColor: '#FF9800',
        icon: FaExclamationTriangle
      };
    default:
      return {
        gradient: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
        borderColor: '#00D4FF',
        icon: FaRocket
      };
  }
};

const DataEntry = () => {
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedNeighbor, setSelectedNeighbor] = useState(null);

  // Load columns on component mount
  useEffect(() => {
    loadColumns();
  }, []);

  const loadColumns = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/columns');
      setColumns(response.data.columns || []);
    } catch (error) {
      console.error('Error loading columns:', error);
      toast.error('Failed to load column information');
    } finally {
      setLoading(false);
    }
  };

  const handleColumnToggle = (columnName) => {
    setSelectedColumns(prev => {
      if (prev.includes(columnName)) {
        return prev.filter(col => col !== columnName);
      } else {
        return [...prev, columnName];
      }
    });
  };

  const handleInputChange = (columnName, value) => {
    setUserInputs(prev => ({
      ...prev,
      [columnName]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedColumns.length === 0) {
      toast.error('Please select at least one column');
      return;
    }

    if (Object.keys(userInputs).length === 0) {
      toast.error('Please enter values for at least one selected column');
      return;
    }

    setSubmitting(true);
    setResult(null);
    setSelectedNeighbor(null);

    try {
      const response = await axios.post('/api/submit-data', {
        userInputs,
        selectedColumns
      });
      
      setResult(response.data.analysis);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to analyze data. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedColumns([]);
    setUserInputs({});
    setResult(null);
    setSelectedNeighbor(null);
  };

  const handleNeighborSelect = (neighbor) => {
    setSelectedNeighbor(neighbor);
  };

  return (
    <EntryContainer>
      <Container>
        <EntryTitle>Dynamic Exoplanet Analysis</EntryTitle>
        <EntryDescription>
          Select any columns from the dataset and enter values to find exact matches or get AI-powered analysis with nearest neighbors.
        </EntryDescription>

        <FormContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSubmit}>
            <ColumnSelectionContainer>
              <SectionTitle>
                <FaDatabase />
                Select Columns to Analyze
              </SectionTitle>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <FaSpinner className="fa-spin" style={{ fontSize: '2rem', color: '#00D4FF' }} />
                  <p style={{ marginTop: '10px', color: '#B0BEC5' }}>Loading columns...</p>
                </div>
              ) : (
                <ColumnGrid>
                  {columns.map((column, index) => (
                    <ColumnItem
                      key={index}
                      selected={selectedColumns.includes(column.name)}
                      onClick={() => handleColumnToggle(column.name)}
                    >
                      <Checkbox
                        type="checkbox"
                        checked={selectedColumns.includes(column.name)}
                        onChange={() => handleColumnToggle(column.name)}
                      />
                      <ColumnInfo>
                        <ColumnName>{column.name}</ColumnName>
                        <ColumnDetails>
                          {column.is_numeric ? 'Numeric' : 'Text'} • {column.non_null_count} values
                          {column.is_numeric && column.non_null_count > 0 && (
                            <span> • Range: {column.min?.toFixed(2)} - {column.max?.toFixed(2)}</span>
                          )}
                        </ColumnDetails>
                      </ColumnInfo>
                    </ColumnItem>
                  ))}
                </ColumnGrid>
              )}
            </ColumnSelectionContainer>

            {selectedColumns.length > 0 && (
              <InputSection>
                <SectionTitle>
                  <FaSearch />
                  Enter Values for Selected Columns
                </SectionTitle>
                
                <InputGrid>
                  {selectedColumns.map((columnName) => {
                    const column = columns.find(col => col.name === columnName);
                    return (
                      <FormGroup key={columnName}>
                        <Label htmlFor={columnName}>
                          {columnName}
                          {column?.is_numeric && column.non_null_count > 0 && (
                            <span style={{ fontSize: '0.9rem', color: '#B0BEC5', fontWeight: 'normal' }}>
                              {' '}(Range: {column.min?.toFixed(2)} - {column.max?.toFixed(2)})
                            </span>
                          )}
                        </Label>
                        <Input
                          type={column?.is_numeric ? 'number' : 'text'}
                          id={columnName}
                          value={userInputs[columnName] || ''}
                          onChange={(e) => handleInputChange(columnName, e.target.value)}
                          placeholder={`Enter ${columnName} value`}
                          step={column?.is_numeric ? '0.01' : undefined}
                          min={column?.is_numeric ? '0' : undefined}
                        />
                      </FormGroup>
                    );
                  })}
                </InputGrid>
              </InputSection>
            )}

            <SubmitButton type="submit" disabled={submitting || selectedColumns.length === 0}>
              {submitting ? (
                <>
                  <FaSpinner className="fa-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FaRocket />
                  Analyze with AI
                </>
              )}
            </SubmitButton>
          </form>
        </FormContainer>

        {result && (
          <ResultsContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ResultsTitle>Analysis Results</ResultsTitle>
            
            {result.type === 'exact_match' ? (
              <ExactMatchCard>
                <ExactMatchIcon>
                  <FaCheckCircle />
                </ExactMatchIcon>
                <ExactMatchTitle>Exact Match Found!</ExactMatchTitle>
                <p style={{ color: '#B0BEC5', marginBottom: '20px' }}>
                  Your input values exactly match a record in the dataset.
                </p>
                
                <DataSummary>
                  {Object.entries(result.result.record).map(([key, value]) => (
                    <DataItem key={key}>
                      <DataLabel>{key}</DataLabel>
                      <DataValue>{value}</DataValue>
                    </DataItem>
                  ))}
                </DataSummary>
              </ExactMatchCard>
            ) : result.type === 'ml_analysis' ? (
              <>
                <ClassificationCard
                  gradient={getClassificationStyle(result.classification.classification).gradient}
                  borderColor={getClassificationStyle(result.classification.classification).borderColor}
                >
                  <ClassificationIcon gradient={getClassificationStyle(result.classification.classification).gradient}>
                    {React.createElement(getClassificationStyle(result.classification.classification).icon)}
                  </ClassificationIcon>
                  
                  <ClassificationTitle>{result.classification.classification}</ClassificationTitle>
                  
                  <ConfidenceScore>{(result.classification.confidence * 100).toFixed(1)}%</ConfidenceScore>
                  
                  <ConfidenceBar>
                    <ConfidenceFill percentage={result.classification.confidence * 100} />
                  </ConfidenceBar>
                  
                  <p style={{ color: '#B0BEC5', marginBottom: '20px' }}>
                    AI Prediction Confidence: {result.classification.confidence > 0.8 ? 'High' : result.classification.confidence > 0.6 ? 'Medium' : 'Low'}
                  </p>
                </ClassificationCard>

                <NeighborsSection>
                  <NeighborsTitle>Similar Exoplanets (Top {result.neighbors.length})</NeighborsTitle>
                  <NeighborsGrid>
                    {result.neighbors.map((neighbor, index) => (
                      <NeighborCard
                        key={index}
                        onClick={() => handleNeighborSelect(neighbor)}
                        style={{
                          borderColor: selectedNeighbor?.index === neighbor.index ? '#00D4FF' : undefined
                        }}
                      >
                        <NeighborHeader>
                          <NeighborIndex>#{index + 1}</NeighborIndex>
                          <SimilarityScore>
                            {(neighbor.similarity_score * 100).toFixed(1)}% similar
                          </SimilarityScore>
                        </NeighborHeader>
                        <NeighborDetails>
                          <div><strong>Distance:</strong> {neighbor.distance.toFixed(4)}</div>
                          <div><strong>Index:</strong> {neighbor.index}</div>
                          {Object.entries(neighbor.record).slice(0, 3).map(([key, value]) => (
                            <div key={key}><strong>{key}:</strong> {value}</div>
                          ))}
                          {Object.entries(neighbor.record).length > 3 && (
                            <div style={{ color: '#00D4FF', marginTop: '5px' }}>
                              +{Object.entries(neighbor.record).length - 3} more fields
                            </div>
                          )}
                        </NeighborDetails>
                      </NeighborCard>
                    ))}
                  </NeighborsGrid>
                </NeighborsSection>

                {selectedNeighbor && (
                  <MLResultsCard style={{ marginTop: '30px' }}>
                    <h4 style={{ color: '#00D4FF', marginBottom: '20px' }}>
                      Full Details for Selected Neighbor
                    </h4>
                    <DataSummary>
                      {Object.entries(selectedNeighbor.record).map(([key, value]) => (
                        <DataItem key={key}>
                          <DataLabel>{key}</DataLabel>
                          <DataValue>{value}</DataValue>
                        </DataItem>
                      ))}
                    </DataSummary>
                  </MLResultsCard>
                )}
              </>
            ) : (
              <div style={{ color: '#F44336', textAlign: 'center' }}>
                <FaTimesCircle style={{ fontSize: '3rem', marginBottom: '20px' }} />
                <h3>Analysis Failed</h3>
                <p>{result.message || 'Unknown error occurred'}</p>
              </div>
            )}

            <SubmitButton onClick={resetForm} style={{ marginTop: '30px' }}>
              <FaRocket />
              Analyze Another
            </SubmitButton>
          </ResultsContainer>
        )}
      </Container>
    </EntryContainer>
  );
};

export default DataEntry;