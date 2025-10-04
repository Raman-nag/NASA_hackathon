import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaChartLine, FaChartBar, FaChartPie, FaDownload } from 'react-icons/fa';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, ComposedChart
} from 'recharts';
import axios from 'axios';

const VisualizationContainer = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const VisualizationTitle = styled.h1`
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

const ChartTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  background: ${props => props.active ? props.theme.colors.accent : 'rgba(26, 35, 50, 0.6)'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 25px;
  padding: 12px 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.theme.colors.accent};
    color: white;
    transform: translateY(-2px);
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

// const FullWidthChart = styled.div`
//   grid-column: 1 / -1;
// `;

const ChartCard = styled(motion.div)`
  background: rgba(26, 35, 50, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 30px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.theme.gradients.space};
  }
`;

const ChartTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const ChartDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 20px;
  font-size: 0.9rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: 10px;
  padding: 20px;
  color: ${props => props.theme.colors.error};
  text-align: center;
  margin: 20px 0;
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
  margin: 20px auto;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 212, 255, 0.3);
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

  &:hover::before {
    left: 100%;
  }
`;

const COLORS = ['#00D4FF', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#2196F3'];

const Visualization = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/predictions?limit=100');
      setPredictions(response.data.predictions);
    } catch (err) {
      setError('Failed to load visualization data');
      console.error('Visualization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getClassificationData = () => {
    const classificationCounts = predictions.reduce((acc, pred) => {
      acc[pred.prediction] = (acc[pred.prediction] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(classificationCounts).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / predictions.length) * 100).toFixed(1)
    }));
  };

  const getConfidenceData = () => {
    return predictions.map((pred, index) => ({
      index: index + 1,
      confidence: (pred.confidence * 100).toFixed(1),
      classification: pred.prediction
    }));
  };

  const getOrbitalPeriodData = () => {
    return predictions.map((pred, index) => ({
      index: index + 1,
      orbitalPeriod: pred.orbital_period,
      classification: pred.prediction,
      confidence: pred.confidence
    }));
  };

  const getPlanetaryRadiusData = () => {
    return predictions.map((pred, index) => ({
      index: index + 1,
      planetaryRadius: pred.planetary_radius,
      classification: pred.prediction,
      confidence: pred.confidence
    }));
  };

  const getScatterData = () => {
    return predictions.map(pred => ({
      orbitalPeriod: pred.orbital_period,
      planetaryRadius: pred.planetary_radius,
      classification: pred.prediction,
      confidence: pred.confidence
    }));
  };

  const getTimeSeriesData = () => {
    const dailyData = {};
    predictions.forEach(pred => {
      const date = new Date(pred.timestamp).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          confirmed: 0,
          candidate: 0,
          falsePositive: 0,
          total: 0
        };
      }
      dailyData[date].total++;
      if (pred.prediction === 'Confirmed Exoplanet') dailyData[date].confirmed++;
      else if (pred.prediction === 'Planetary Candidate') dailyData[date].candidate++;
      else dailyData[date].falsePositive++;
    });
    return Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const renderOverviewCharts = () => (
    <>
      <ChartsGrid>
        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ChartTitle>Classification Distribution</ChartTitle>
          <ChartDescription>Distribution of exoplanet classifications</ChartDescription>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getClassificationData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getClassificationData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A2332', 
                  border: '1px solid #2C3E50',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <ChartTitle>Confidence Distribution</ChartTitle>
          <ChartDescription>Distribution of prediction confidence scores</ChartDescription>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getConfidenceData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C3E50" />
              <XAxis dataKey="index" stroke="#B0BEC5" />
              <YAxis stroke="#B0BEC5" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A2332', 
                  border: '1px solid #2C3E50',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              />
              <Bar dataKey="confidence" fill="#00D4FF" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <ChartCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ChartTitle>Daily Prediction Trends</ChartTitle>
        <ChartDescription>Number of predictions made each day by classification</ChartDescription>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={getTimeSeriesData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2C3E50" />
            <XAxis dataKey="date" stroke="#B0BEC5" />
            <YAxis stroke="#B0BEC5" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A2332', 
                border: '1px solid #2C3E50',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
            />
            <Area type="monotone" dataKey="confirmed" stackId="1" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.6} />
            <Area type="monotone" dataKey="candidate" stackId="1" stroke="#FF9800" fill="#FF9800" fillOpacity={0.6} />
            <Area type="monotone" dataKey="falsePositive" stackId="1" stroke="#F44336" fill="#F44336" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );

  const renderAnalysisCharts = () => (
    <>
      <ChartsGrid>
        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ChartTitle>Orbital Period vs Classification</ChartTitle>
          <ChartDescription>Relationship between orbital period and exoplanet classification</ChartDescription>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getOrbitalPeriodData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C3E50" />
              <XAxis dataKey="index" stroke="#B0BEC5" />
              <YAxis stroke="#B0BEC5" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A2332', 
                  border: '1px solid #2C3E50',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              />
              <Bar dataKey="orbitalPeriod" fill="#00D4FF" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <ChartTitle>Planetary Radius vs Classification</ChartTitle>
          <ChartDescription>Relationship between planetary radius and exoplanet classification</ChartDescription>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getPlanetaryRadiusData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C3E50" />
              <XAxis dataKey="index" stroke="#B0BEC5" />
              <YAxis stroke="#B0BEC5" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A2332', 
                  border: '1px solid #2C3E50',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              />
              <Bar dataKey="planetaryRadius" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <ChartCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ChartTitle>Orbital Period vs Planetary Radius</ChartTitle>
        <ChartDescription>Scatter plot showing the relationship between orbital period and planetary radius</ChartDescription>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={getScatterData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2C3E50" />
            <XAxis type="number" dataKey="orbitalPeriod" name="Orbital Period (days)" stroke="#B0BEC5" />
            <YAxis type="number" dataKey="planetaryRadius" name="Planetary Radius (R⊕)" stroke="#B0BEC5" />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: '#1A2332', 
                border: '1px solid #2C3E50',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
            />
            <Scatter dataKey="confidence" fill="#00D4FF" />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );

  const renderPerformanceCharts = () => (
    <>
      <ChartCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ChartTitle>Model Performance Metrics</ChartTitle>
        <ChartDescription>AI model performance over time</ChartDescription>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={getConfidenceData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2C3E50" />
            <XAxis dataKey="index" stroke="#B0BEC5" />
            <YAxis stroke="#B0BEC5" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A2332', 
                border: '1px solid #2C3E50',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
            />
            <Bar dataKey="confidence" fill="#00D4FF" fillOpacity={0.6} />
            <Line type="monotone" dataKey="confidence" stroke="#4CAF50" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );

  const handleExport = () => {
    const csvContent = [
      ['Index', 'Classification', 'Confidence', 'Orbital Period', 'Planetary Radius', 'Timestamp'],
      ...predictions.map((pred, index) => [
        index + 1,
        pred.prediction,
        (pred.confidence * 100).toFixed(2) + '%',
        pred.orbital_period,
        pred.planetary_radius,
        new Date(pred.timestamp).toISOString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exoplanet-visualization-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <VisualizationContainer>
        <Container>
          <LoadingContainer>Loading visualization data...</LoadingContainer>
        </Container>
      </VisualizationContainer>
    );
  }

  if (error) {
    return (
      <VisualizationContainer>
        <Container>
          <ErrorMessage>{error}</ErrorMessage>
        </Container>
      </VisualizationContainer>
    );
  }

  return (
    <VisualizationContainer>
      <Container>
        <VisualizationTitle>Interactive Visualizations</VisualizationTitle>
        
        <ChartTabs>
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          >
            <FaChartPie />
            Overview
          </TabButton>
          <TabButton
            active={activeTab === 'analysis'}
            onClick={() => setActiveTab('analysis')}
          >
            <FaChartBar />
            Analysis
          </TabButton>
          <TabButton
            active={activeTab === 'performance'}
            onClick={() => setActiveTab('performance')}
          >
            <FaChartLine />
            Performance
          </TabButton>
        </ChartTabs>

        {activeTab === 'overview' && renderOverviewCharts()}
        {activeTab === 'analysis' && renderAnalysisCharts()}
        {activeTab === 'performance' && renderPerformanceCharts()}

        <ExportButton onClick={handleExport}>
          <FaDownload />
          Export Data
        </ExportButton>
      </Container>
    </VisualizationContainer>
  );
};

export default Visualization;

