import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';

import App from './App';
import { persistor, store } from './store';
import { GlobalStyle } from './styles/global';
import { theme } from './styles/theme';
import Loader from './components/Common/Loader';
import { setupApiInterceptors } from './services/apiInterceptors';

setupApiInterceptors(store);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <PersistGate loading={<Loader fullScreen />} persistor={persistor}>
          <App />
        </PersistGate>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
