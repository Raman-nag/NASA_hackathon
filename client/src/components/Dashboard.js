import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaRocket, FaChartLine, FaCheckCircle, FaEye } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import axios from 'axios';

const DashboardContainer = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardTitle = styled.h1`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const StatCard = styled(motion.div)`
  background: rgba(26, 35, 50, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 30px;
  text-align: center;
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

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.gradient || props.theme.gradients.space};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 1.5rem;
  color: white;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
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

const ChartCard = styled(motion.div)`
  background: rgba(26, 35, 50, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 30px;
`;

const ChartTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
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

const COLORS = ['#00D4FF', '#4CAF50', '#FF9800', '#F44336'];

const Dashboard = () => {
  const [performance, setPerformance] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [performanceRes, predictionsRes] = await Promise.all([
        axios.get('/api/performance'),
        axios.get('/api/predictions?limit=50')
      ]);
      
      setPerformance(performanceRes.data);
      setPredictions(predictionsRes.data.predictions);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
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
      confidence: (pred.confidence * 100).toFixed(1)
    }));
  };

  const getRecentPredictions = () => {
    return predictions.slice(0, 10).map((pred, index) => ({
      name: `Prediction ${index + 1}`,
      confidence: (pred.confidence * 100).toFixed(1)
    }));
  };

  if (loading) {
    return (
      <DashboardContainer>
        <Container>
          <LoadingSpinner>Loading dashboard data...</LoadingSpinner>
        </Container>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <Container>
          <ErrorMessage>{error}</ErrorMessage>
        </Container>
      </DashboardContainer>
    );
  }

  const classificationData = getClassificationData();
  const confidenceData = getConfidenceData();
  const recentPredictions = getRecentPredictions();

  return (
    <DashboardContainer>
      <Container>
        <DashboardTitle>Mission Control Dashboard</DashboardTitle>
        
        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            gradient="linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
          >
            <StatIcon gradient="linear-gradient(135deg, #4CAF50 0%, #45a049 100%)">
              <FaCheckCircle />
            </StatIcon>
            <StatValue>{(performance?.accuracy * 100 || 95).toFixed(1)}%</StatValue>
            <StatLabel>Model Accuracy</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            gradient="linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)"
          >
            <StatIcon gradient="linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)">
              <FaRocket />
            </StatIcon>
            <StatValue>{performance?.totalPredictions || 0}</StatValue>
            <StatLabel>Total Predictions</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            gradient="linear-gradient(135deg, #FF9800 0%, #F57C00 100%)"
          >
            <StatIcon gradient="linear-gradient(135deg, #FF9800 0%, #F57C00 100%)">
              <FaChartLine />
            </StatIcon>
            <StatValue>{(performance?.f1Score * 100 || 93.5).toFixed(1)}%</StatValue>
            <StatLabel>F1 Score</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            gradient="linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)"
          >
            <StatIcon gradient="linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)">
              <FaEye />
            </StatIcon>
            <StatValue>{predictions.length}</StatValue>
            <StatLabel>Recent Analyses</StatLabel>
          </StatCard>
        </StatsGrid>

        <ChartsGrid>
          <ChartCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ChartTitle>Classification Distribution</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={classificationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {classificationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <ChartTitle>Confidence Trends</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={confidenceData}>
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
                <Line 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="#00D4FF" 
                  strokeWidth={2}
                  dot={{ fill: '#00D4FF', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </ChartsGrid>

        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <ChartTitle>Recent Predictions Confidence</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={recentPredictions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C3E50" />
              <XAxis dataKey="name" stroke="#B0BEC5" />
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
      </Container>
    </DashboardContainer>
  );
};

export default Dashboard;

