import React from 'react';
import styled from 'styled-components';
// import { motion } from 'framer-motion';
import { FaRocket, FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: rgba(11, 20, 38, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: 40px 20px 20px;
  margin-top: 60px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 30px;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FooterText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 15px;
`;

const FooterLink = styled.a`
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  background: rgba(26, 35, 50, 0.6);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.accent};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 212, 255, 0.3);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NASA = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  font-weight: 600;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${props => props.theme.colors.accent};
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 15px;
`;

const LogoIcon = styled.div`
  width: 30px;
  height: 30px;
  background: ${props => props.theme.gradients.space};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <Container>
        <FooterContent>
          <FooterSection>
            <Logo>
              <LogoIcon>
                <FaRocket />
              </LogoIcon>
              NASA Exoplanet AI
            </Logo>
            <FooterText>
              A World Away: Hunting for Exoplanets with AI - A NASA Space Apps Challenge project 
              that leverages artificial intelligence to accelerate exoplanet discovery and make 
              space science accessible to everyone.
            </FooterText>
            <SocialLinks>
              <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </SocialLink>
              <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </SocialLink>
              <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </SocialLink>
              <SocialLink href="mailto:contact@nasa-exoplanet-ai.com">
                <FaEnvelope />
              </SocialLink>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLink href="/dashboard">
              <FaRocket />
              Dashboard
            </FooterLink>
            <FooterLink href="/upload">
              <FaRocket />
              Upload Data
            </FooterLink>
            <FooterLink href="/entry">
              <FaRocket />
              Manual Entry
            </FooterLink>
            <FooterLink href="/results">
              <FaRocket />
              Results
            </FooterLink>
            <FooterLink href="/visualization">
              <FaRocket />
              Visualizations
            </FooterLink>
            <FooterLink href="/about">
              <FaRocket />
              About
            </FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Resources</FooterTitle>
            <FooterLink href="https://exoplanets.nasa.gov" target="_blank" rel="noopener noreferrer">
              NASA Exoplanet Archive
            </FooterLink>
            <FooterLink href="https://kepler.nasa.gov" target="_blank" rel="noopener noreferrer">
              Kepler Mission
            </FooterLink>
            <FooterLink href="https://tess.mit.edu" target="_blank" rel="noopener noreferrer">
              TESS Mission
            </FooterLink>
            <FooterLink href="https://spaceappschallenge.org" target="_blank" rel="noopener noreferrer">
              NASA Space Apps
            </FooterLink>
            <FooterLink href="https://github.com/nasa-exoplanet-ai" target="_blank" rel="noopener noreferrer">
              Source Code
            </FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Contact</FooterTitle>
            <FooterText>
              Questions about our AI model or need help with data analysis? 
              We're here to help researchers and space enthusiasts explore the cosmos.
            </FooterText>
            <FooterLink href="mailto:support@nasa-exoplanet-ai.com">
              <FaEnvelope />
              support@nasa-exoplanet-ai.com
            </FooterLink>
            <FooterText style={{ marginTop: '15px', fontSize: '0.9rem' }}>
              Built with <FaHeart style={{ color: '#F44336' }} /> for the NASA Space Apps Challenge 2024
            </FooterText>
          </FooterSection>
        </FooterContent>

        <FooterBottom>
          <Copyright>
            © 2024 NASA Exoplanet AI. All rights reserved.
          </Copyright>
          <NASA>
            NASA Space Apps Challenge 2024
          </NASA>
        </FooterBottom>
      </Container>
    </FooterContainer>
  );
};

export default Footer;

