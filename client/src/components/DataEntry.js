import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaRocket, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const EntryContainer = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 800px;
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
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
    case 'Confirmed Exoplanet':
      return {
        gradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        borderColor: '#4CAF50',
        icon: FaCheckCircle
      };
    case 'Planetary Candidate':
      return {
        gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
        borderColor: '#FF9800',
        icon: FaExclamationTriangle
      };
    case 'False Positive':
      return {
        gradient: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
        borderColor: '#F44336',
        icon: FaTimesCircle
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
  const [formData, setFormData] = useState({
    orbitalPeriod: '',
    transitDuration: '',
    planetaryRadius: '',
    stellarRadius: '1.0',
    stellarMass: '1.0',
    stellarTemperature: '5778'
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.orbitalPeriod || !formData.transitDuration || !formData.planetaryRadius) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const response = await axios.post('/api/submit-data', formData);
      setResult(response.data.prediction);
      toast.success('Data analyzed successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to analyze data. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      orbitalPeriod: '',
      transitDuration: '',
      planetaryRadius: '',
      stellarRadius: '1.0',
      stellarMass: '1.0',
      stellarTemperature: '5778'
    });
    setResult(null);
  };

  return (
    <EntryContainer>
      <Container>
        <EntryTitle>Manual Data Entry</EntryTitle>
        <EntryDescription>
          Enter exoplanet transit data manually for AI analysis. 
          Provide the orbital period, transit duration, and planetary radius for the most accurate results.
        </EntryDescription>

        <FormContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="orbitalPeriod">Orbital Period (days) *</Label>
                <Input
                  type="number"
                  id="orbitalPeriod"
                  name="orbitalPeriod"
                  value={formData.orbitalPeriod}
                  onChange={handleInputChange}
                  placeholder="e.g., 365.25"
                  step="0.01"
                  min="0"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="transitDuration">Transit Duration (hours) *</Label>
                <Input
                  type="number"
                  id="transitDuration"
                  name="transitDuration"
                  value={formData.transitDuration}
                  onChange={handleInputChange}
                  placeholder="e.g., 13.0"
                  step="0.1"
                  min="0"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="planetaryRadius">Planetary Radius (Earth radii) *</Label>
                <Input
                  type="number"
                  id="planetaryRadius"
                  name="planetaryRadius"
                  value={formData.planetaryRadius}
                  onChange={handleInputChange}
                  placeholder="e.g., 1.0"
                  step="0.1"
                  min="0"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="stellarRadius">Stellar Radius (Solar radii)</Label>
                <Input
                  type="number"
                  id="stellarRadius"
                  name="stellarRadius"
                  value={formData.stellarRadius}
                  onChange={handleInputChange}
                  placeholder="e.g., 1.0"
                  step="0.1"
                  min="0"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="stellarMass">Stellar Mass (Solar masses)</Label>
                <Input
                  type="number"
                  id="stellarMass"
                  name="stellarMass"
                  value={formData.stellarMass}
                  onChange={handleInputChange}
                  placeholder="e.g., 1.0"
                  step="0.1"
                  min="0"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="stellarTemperature">Stellar Temperature (K)</Label>
                <Input
                  type="number"
                  id="stellarTemperature"
                  name="stellarTemperature"
                  value={formData.stellarTemperature}
                  onChange={handleInputChange}
                  placeholder="e.g., 5778"
                  step="1"
                  min="0"
                />
              </FormGroup>
            </FormGrid>

            <SubmitButton type="submit" disabled={submitting}>
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
            
            <ClassificationCard
              gradient={getClassificationStyle(result.prediction).gradient}
              borderColor={getClassificationStyle(result.prediction).borderColor}
            >
              <ClassificationIcon gradient={getClassificationStyle(result.prediction).gradient}>
                {React.createElement(getClassificationStyle(result.prediction).icon)}
              </ClassificationIcon>
              
              <ClassificationTitle>{result.prediction}</ClassificationTitle>
              
              <ConfidenceScore>{(result.confidence * 100).toFixed(1)}%</ConfidenceScore>
              
              <ConfidenceBar>
                <ConfidenceFill percentage={result.confidence * 100} />
              </ConfidenceBar>
              
              <p style={{ color: '#B0BEC5', marginBottom: '20px' }}>
                Confidence Level: {result.confidence > 0.8 ? 'High' : result.confidence > 0.6 ? 'Medium' : 'Low'}
              </p>
            </ClassificationCard>

            <DataSummary>
              <DataItem>
                <DataLabel>Orbital Period</DataLabel>
                <DataValue>{result.orbital_period} days</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Transit Duration</DataLabel>
                <DataValue>{result.transit_duration} hours</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Planetary Radius</DataLabel>
                <DataValue>{result.planetary_radius} R⊕</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Stellar Radius</DataLabel>
                <DataValue>{result.stellar_radius} R☉</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Stellar Mass</DataLabel>
                <DataValue>{result.stellar_mass} M☉</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Stellar Temperature</DataLabel>
                <DataValue>{result.stellar_temperature} K</DataValue>
              </DataItem>
            </DataSummary>

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

