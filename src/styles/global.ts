import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    padding: 0;
    margin: 0;
    height: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.black};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button, input, textarea, select {
    font: inherit;
  }
`;
