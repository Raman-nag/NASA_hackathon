import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaRocket, FaChartLine, FaUpload, FaEye } from 'react-icons/fa';

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const HeroContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  z-index: 2;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: ${props => props.theme.gradients.nebula};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.2rem;
  }
`;

const HeroDescription = styled(motion.p)`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background: ${props => props.primary ? props.theme.gradients.space : 'transparent'};
  color: ${props => props.primary ? 'white' : props.theme.colors.accent};
  border: 2px solid ${props => props.theme.colors.accent};
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
    background: ${props => props.primary ? props.theme.gradients.space : props.theme.colors.accent};
    color: white;
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

const FeaturesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 4rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(26, 35, 50, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    border-color: ${props => props.theme.colors.accent};
    box-shadow: 0 20px 40px rgba(0, 212, 255, 0.2);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${props => props.theme.gradients.space};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

const BackgroundStars = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`;

const Star = styled.div`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle ${props => props.delay}s infinite ease-in-out;

  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
`;

const features = [
  {
    icon: FaRocket,
    title: 'AI-Powered Detection',
    description: 'Advanced machine learning algorithms analyze transit data to identify potential exoplanets with high accuracy.'
  },
  {
    icon: FaChartLine,
    title: 'Real-time Analytics',
    description: 'Monitor model performance with live statistics and interactive visualizations of classification results.'
  },
  {
    icon: FaUpload,
    title: 'Data Upload',
    description: 'Upload CSV files or manually enter transit data for instant analysis and classification.'
  },
  {
    icon: FaEye,
    title: 'Interactive Visualization',
    description: 'Explore transit light curves and planetary parameters through beautiful, interactive charts.'
  }
];

const Hero = () => {
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 100; i++) {
      stars.push(
        <Star
          key={i}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`
          }}
          delay={Math.random() * 3}
        />
      );
    }
    return stars;
  };

  return (
    <HeroSection>
      <BackgroundStars>
        {generateStars()}
      </BackgroundStars>
      
      <HeroContainer>
        <HeroTitle
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          A World Away
        </HeroTitle>
        
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Hunting for Exoplanets with AI
        </HeroSubtitle>
        
        <HeroDescription
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Discover new worlds beyond our solar system using cutting-edge artificial intelligence. 
          Upload transit data, analyze planetary candidates, and explore the cosmos like never before.
        </HeroDescription>
        
        <CTAButtons
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <CTAButton to="/upload" primary>
            <FaUpload />
            Start Exploring
          </CTAButton>
          <CTAButton to="/dashboard">
            <FaChartLine />
            View Dashboard
          </CTAButton>
        </CTAButtons>
        
        <FeaturesGrid
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <FeatureIcon>
                  <Icon />
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            );
          })}
        </FeaturesGrid>
      </HeroContainer>
    </HeroSection>
  );
};

export default Hero;

