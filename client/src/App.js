import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import DataUpload from './components/DataUpload';
import DataEntry from './components/DataEntry';
import Results from './components/Results';
import Visualization from './components/Visualization';
import About from './components/About';
import Footer from './components/Footer';

// Theme
const theme = {
  colors: {
    primary: '#0B1426',
    secondary: '#1A2332',
    accent: '#00D4FF',
    accentHover: '#00B8E6',
    text: '#FFFFFF',
    textSecondary: '#B0BEC5',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    background: '#0A0E1A',
    card: '#1A2332',
    border: '#2C3E50'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    space: 'linear-gradient(135deg, #0c4a6e 0%, #1e3a8a 50%, #312e81 100%)',
    nebula: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
  },
  fonts: {
    primary: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    heading: "'Space Grotesk', 'Inter', sans-serif"
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px'
  }
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.theme.fonts.primary};
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
    overflow-x: hidden;
  }

  html {
    scroll-behavior: smooth;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.accent};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.accentHover};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.heading};
    font-weight: 600;
  }

  a {
    color: ${props => props.theme.colors.accent};
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: ${props => props.theme.colors.accentHover};
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.3s ease;
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    .container {
      padding: 0 15px;
    }
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
    z-index: -1;
    pointer-events: none;
  }
`;

const MainContent = styled.main`
  min-height: calc(100vh - 80px);
  padding-top: 80px;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <Navbar />
          <MainContent>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<DataUpload />} />
              <Route path="/entry" element={<DataEntry />} />
              <Route path="/results" element={<Results />} />
              <Route path="/visualization" element={<Visualization />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </MainContent>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;

