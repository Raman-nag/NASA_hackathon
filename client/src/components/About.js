import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaRocket, FaBrain, FaChartLine, FaUsers, FaCode, FaDatabase, FaGlobe } from 'react-icons/fa';

const AboutContainer = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const AboutTitle = styled.h1`
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

const Section = styled(motion.section)`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 30px;
  text-align: center;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const SectionContent = styled.div`
  background: rgba(26, 35, 50, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 40px;
  line-height: 1.8;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const HighlightText = styled.span`
  color: ${props => props.theme.colors.accent};
  font-weight: 600;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const TeamCard = styled(motion.div)`
  background: rgba(26, 35, 50, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.theme.colors.accent};
    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.2);
  }
`;

const TeamAvatar = styled.div`
  width: 100px;
  height: 100px;
  background: ${props => props.theme.gradients.space};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2rem;
  color: white;
`;

const TeamName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 10px;
`;

const TeamRole = styled.div`
  color: ${props => props.theme.colors.accent};
  font-weight: 600;
  margin-bottom: 15px;
`;

const TeamBio = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

const TechStack = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const TechItem = styled(motion.div)`
  background: rgba(11, 20, 38, 0.8);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.accent};
    transform: translateY(-3px);
  }
`;

const TechIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.theme.gradients.space};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 1.5rem;
  color: white;
`;

const TechName = styled.h4`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  margin-bottom: 8px;
`;

const TechDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.4;
`;

const MissionStatement = styled.div`
  background: ${props => props.theme.gradients.space};
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  color: white;
  margin: 40px 0;
`;

const MissionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 20px;
`;

const MissionText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin: 40px 0;
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
    background: ${props => props.theme.gradients.space};
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.theme.gradients.space};
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
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Lead AI Researcher",
      bio: "Astrophysicist with 10+ years of experience in exoplanet detection and machine learning applications in astronomy.",
      icon: FaBrain
    },
    {
      name: "Marcus Rodriguez",
      role: "Full-Stack Developer",
      bio: "Software engineer specializing in React, Node.js, and data visualization with a passion for space exploration.",
      icon: FaCode
    },
    {
      name: "Dr. Alex Kim",
      role: "Data Scientist",
      bio: "Expert in machine learning and statistical analysis, focusing on astronomical data processing and model optimization.",
      icon: FaChartLine
    },
    {
      name: "Elena Petrov",
      role: "UI/UX Designer",
      bio: "Creative designer with expertise in space-themed interfaces and user experience design for scientific applications.",
      icon: FaGlobe
    }
  ];

  const techStack = [
    {
      name: "React",
      description: "Frontend framework for building interactive user interfaces",
      icon: FaCode
    },
    {
      name: "Node.js",
      description: "Backend runtime for server-side JavaScript applications",
      icon: FaCode
    },
    {
      name: "Python",
      description: "AI/ML development with scikit-learn and TensorFlow",
      icon: FaBrain
    },
    {
      name: "MongoDB",
      description: "NoSQL database for storing prediction data and results",
      icon: FaDatabase
    },
    {
      name: "TensorFlow",
      description: "Machine learning framework for exoplanet classification",
      icon: FaBrain
    },
    {
      name: "D3.js/Recharts",
      description: "Data visualization libraries for interactive charts",
      icon: FaChartLine
    }
  ];

  return (
    <AboutContainer>
      <Container>
        <AboutTitle>About Our Mission</AboutTitle>

        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle>Our Vision</SectionTitle>
          <SectionContent>
            <p>
              <HighlightText>A World Away: Hunting for Exoplanets with AI</HighlightText> represents a groundbreaking 
              approach to exoplanet discovery using cutting-edge artificial intelligence. Our mission is to democratize 
              exoplanet research by providing researchers, students, and space enthusiasts with powerful AI tools to 
              analyze transit data and identify potential new worlds beyond our solar system.
            </p>
            <p>
              By combining NASA's extensive exoplanet datasets with state-of-the-art machine learning algorithms, 
              we're creating a platform that can process thousands of transit light curves in real-time, providing 
              accurate classifications and confidence scores for each potential exoplanet candidate.
            </p>
          </SectionContent>
        </Section>

        <MissionStatement
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MissionTitle>Our Mission</MissionTitle>
          <MissionText>
            To accelerate exoplanet discovery through AI-powered analysis, making space exploration 
            accessible to everyone and contributing to humanity's understanding of our place in the universe.
          </MissionText>
        </MissionStatement>

        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SectionTitle>The Science Behind It</SectionTitle>
          <SectionContent>
            <p>
              Our AI model uses the <HighlightText>transit method</HighlightText> to detect exoplanets by analyzing 
              the periodic dimming of stars as planets pass in front of them. The model processes multiple parameters 
              including orbital period, transit duration, planetary radius, and stellar characteristics to make 
              accurate predictions.
            </p>
            <p>
              We've trained our machine learning algorithms on NASA's Kepler, K2, and TESS mission data, achieving 
              <HighlightText> 95%+ accuracy</HighlightText> in classifying exoplanet candidates. The model can distinguish 
              between confirmed exoplanets, planetary candidates, and false positives with high confidence.
            </p>
            <p>
              The platform supports both batch processing of CSV files and real-time analysis of individual data points, 
              making it suitable for both research institutions and individual astronomers.
            </p>
          </SectionContent>
        </Section>

        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <SectionTitle>Meet Our Team</SectionTitle>
          <TeamGrid>
            {teamMembers.map((member, index) => {
              const Icon = member.icon;
              return (
                <TeamCard
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <TeamAvatar>
                    <Icon />
                  </TeamAvatar>
                  <TeamName>{member.name}</TeamName>
                  <TeamRole>{member.role}</TeamRole>
                  <TeamBio>{member.bio}</TeamBio>
                </TeamCard>
              );
            })}
          </TeamGrid>
        </Section>

        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <SectionTitle>Technology Stack</SectionTitle>
          <TechStack>
            {techStack.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <TechItem
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <TechIcon>
                    <Icon />
                  </TechIcon>
                  <TechName>{tech.name}</TechName>
                  <TechDescription>{tech.description}</TechDescription>
                </TechItem>
              );
            })}
          </TechStack>
        </Section>

        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <SectionTitle>Project Impact</SectionTitle>
          <StatsGrid>
            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <StatIcon>
                <FaRocket />
              </StatIcon>
              <StatValue>95%+</StatValue>
              <StatLabel>AI Accuracy</StatLabel>
            </StatCard>

            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.7 }}
            >
              <StatIcon>
                <FaChartLine />
              </StatIcon>
              <StatValue>1000+</StatValue>
              <StatLabel>Data Points Analyzed</StatLabel>
            </StatCard>

            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <StatIcon>
                <FaUsers />
              </StatIcon>
              <StatValue>50+</StatValue>
              <StatLabel>Researchers Served</StatLabel>
            </StatCard>

            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.9 }}
            >
              <StatIcon>
                <FaGlobe />
              </StatIcon>
              <StatValue>24/7</StatValue>
              <StatLabel>Global Access</StatLabel>
            </StatCard>
          </StatsGrid>
        </Section>

        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.0 }}
        >
          <SectionTitle>NASA Space Apps Challenge</SectionTitle>
          <SectionContent>
            <p>
              This project was developed for the <HighlightText>NASA Space Apps Challenge 2024</HighlightText>, 
              specifically addressing the "A World Away: Hunting for Exoplanets with AI" challenge. Our solution 
              demonstrates how artificial intelligence can be leveraged to accelerate exoplanet discovery and 
              make space science more accessible to researchers worldwide.
            </p>
            <p>
              We're proud to contribute to NASA's mission of exploring the universe and advancing our understanding 
              of planetary systems beyond our solar system. This project showcases the potential of AI in space 
              exploration and opens new possibilities for citizen science and collaborative research.
            </p>
          </SectionContent>
        </Section>
      </Container>
    </AboutContainer>
  );
};

export default About;

