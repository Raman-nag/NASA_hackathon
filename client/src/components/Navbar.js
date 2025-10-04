import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaRocket, FaChartLine, FaUpload, FaEdit, FaEye, FaInfoCircle } from 'react-icons/fa';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(11, 20, 38, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.accent};
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.accentHover};
    transform: scale(1.05);
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.theme.gradients.space};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: ${props => props.theme.colors.accent};
    background: rgba(0, 212, 255, 0.1);
  }

  &.active {
    color: ${props => props.theme.colors.accent};
    background: rgba(0, 212, 255, 0.2);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.primary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 20px;
  display: none;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: block;
  }
`;

const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.accent};
    padding-left: 10px;
  }

  &.active {
    color: ${props => props.theme.colors.accent};
    background: rgba(0, 212, 255, 0.1);
    padding-left: 10px;
    border-radius: 8px;
  }
`;

const navItems = [
  { path: '/', label: 'Home', icon: FaRocket },
  { path: '/dashboard', label: 'Dashboard', icon: FaChartLine },
  { path: '/upload', label: 'Upload Data', icon: FaUpload },
  { path: '/entry', label: 'Manual Entry', icon: FaEdit },
  { path: '/results', label: 'Results', icon: FaEye },
  { path: '/visualization', label: 'Visualization', icon: FaChartLine },
  { path: '/about', label: 'About', icon: FaInfoCircle }
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <LogoIcon>
            <FaRocket />
          </LogoIcon>
          NASA Exoplanet AI
        </Logo>

        <NavLinks>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                <Icon />
                {item.label}
              </NavLink>
            );
          })}
        </NavLinks>

        <MobileMenuButton onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
      </NavContainer>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <MobileNavLink
                  key={item.path}
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  <Icon />
                  {item.label}
                </MobileNavLink>
              );
            })}
          </MobileMenu>
        )}
      </AnimatePresence>
    </Nav>
  );
};

export default Navbar;

