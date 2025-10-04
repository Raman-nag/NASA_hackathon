import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaSearch, FaFilter, FaDownload } from 'react-icons/fa';
import axios from 'axios';

const ResultsContainer = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ResultsTitle = styled.h1`
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

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  background: rgba(26, 35, 50, 0.6);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 25px;
  padding: 12px 20px 12px 50px;
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

const SearchIcon = styled.div`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const FilterSelect = styled.select`
  background: rgba(26, 35, 50, 0.6);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 12px 15px;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.colors.accent};
    outline: none;
  }
`;

const ExportButton = styled.button`
  background: ${props => props.theme.gradients.space};
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 212, 255, 0.3);
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const ResultCard = styled(motion.div)`
  background: rgba(26, 35, 50, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 25px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.theme.colors.accent};
    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.2);
  }

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

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ClassificationBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: ${props => props.gradient};
  border-radius: 20px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`;

const ConfidenceScore = styled.div`
  background: rgba(11, 20, 38, 0.8);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 15px;
  padding: 8px 15px;
  color: ${props => props.theme.colors.accent};
  font-weight: 600;
  font-size: 1.1rem;
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
`;

const DataItem = styled.div`
  background: rgba(11, 20, 38, 0.6);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 12px;
  text-align: center;
`;

const DataLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.8rem;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DataValue = styled.div`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-size: 1rem;
`;

const Timestamp = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  text-align: center;
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: 15px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 40px;
`;

const PaginationButton = styled.button`
  background: ${props => props.active ? props.theme.colors.accent : 'rgba(26, 35, 50, 0.6)'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.accent};
    color: white;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  width: 100px;
  height: 100px;
  background: rgba(26, 35, 50, 0.6);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const getClassificationStyle = (classification) => {
  switch (classification) {
    case 'Confirmed Exoplanet':
      return {
        gradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        icon: FaCheckCircle
      };
    case 'Planetary Candidate':
      return {
        gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
        icon: FaExclamationTriangle
      };
    case 'False Positive':
      return {
        gradient: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
        icon: FaTimesCircle
      };
    default:
      return {
        gradient: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
        icon: FaCheckCircle
      };
  }
};

const Results = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPredictions();
  }, [currentPage, filter]);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/predictions?page=${currentPage}&limit=12`);
      setPredictions(response.data.predictions);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPredictions = predictions.filter(prediction => {
    const matchesSearch = prediction.prediction.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prediction.orbital_period.toString().includes(searchTerm) ||
                         prediction.planetary_radius.toString().includes(searchTerm);
    
    const matchesFilter = filter === 'all' || prediction.prediction === filter;
    
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'Classification', 'Confidence', 'Orbital Period', 'Transit Duration', 'Planetary Radius', 'Stellar Radius', 'Stellar Mass', 'Stellar Temperature'],
      ...filteredPredictions.map(pred => [
        new Date(pred.timestamp).toISOString(),
        pred.prediction,
        (pred.confidence * 100).toFixed(2) + '%',
        pred.orbital_period,
        pred.transit_duration,
        pred.planetary_radius,
        pred.stellar_radius,
        pred.stellar_mass,
        pred.stellar_temperature
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exoplanet-predictions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <ResultsContainer>
        <Container>
          <LoadingContainer>Loading prediction results...</LoadingContainer>
        </Container>
      </ResultsContainer>
    );
  }

  return (
    <ResultsContainer>
      <Container>
        <ResultsTitle>Prediction Results</ResultsTitle>
        
        <ControlsContainer>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search predictions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          
          <FilterContainer>
            <FaFilter />
            <FilterSelect
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Classifications</option>
              <option value="Confirmed Exoplanet">Confirmed Exoplanets</option>
              <option value="Planetary Candidate">Planetary Candidates</option>
              <option value="False Positive">False Positives</option>
            </FilterSelect>
            
            <ExportButton onClick={handleExport}>
              <FaDownload />
              Export CSV
            </ExportButton>
          </FilterContainer>
        </ControlsContainer>

        {filteredPredictions.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FaSearch />
            </EmptyIcon>
            <h3>No predictions found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </EmptyState>
        ) : (
          <>
            <ResultsGrid>
              {filteredPredictions.map((prediction, index) => {
                const style = getClassificationStyle(prediction.prediction);
                const Icon = style.icon;
                
                return (
                  <ResultCard
                    key={prediction._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    gradient={style.gradient}
                  >
                    <CardHeader>
                      <ClassificationBadge gradient={style.gradient}>
                        <Icon />
                        {prediction.prediction}
                      </ClassificationBadge>
                      <ConfidenceScore>
                        {(prediction.confidence * 100).toFixed(1)}%
                      </ConfidenceScore>
                    </CardHeader>

                    <DataGrid>
                      <DataItem>
                        <DataLabel>Orbital Period</DataLabel>
                        <DataValue>{prediction.orbital_period} days</DataValue>
                      </DataItem>
                      <DataItem>
                        <DataLabel>Transit Duration</DataLabel>
                        <DataValue>{prediction.transit_duration} hours</DataValue>
                      </DataItem>
                      <DataItem>
                        <DataLabel>Planetary Radius</DataLabel>
                        <DataValue>{prediction.planetary_radius} R⊕</DataValue>
                      </DataItem>
                      <DataItem>
                        <DataLabel>Stellar Radius</DataLabel>
                        <DataValue>{prediction.stellar_radius} R☉</DataValue>
                      </DataItem>
                    </DataGrid>

                    <Timestamp>
                      {formatDate(prediction.timestamp)}
                    </Timestamp>
                  </ResultCard>
                );
              })}
            </ResultsGrid>

            {totalPages > 1 && (
              <PaginationContainer>
                <PaginationButton
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </PaginationButton>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationButton
                      key={page}
                      active={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationButton>
                  );
                })}
                
                <PaginationButton
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </PaginationButton>
              </PaginationContainer>
            )}
          </>
        )}
      </Container>
    </ResultsContainer>
  );
};

export default Results;

