import React from 'react';
import { createRoot } from 'react-dom/client';
import WindowFrame from '@misc/window/components/WindowFrame';
import App from '@renderer/App';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { injectStore } from '@renderer/axios/axiosClient';
import { ToolkitStore } from '@reduxjs/toolkit/src/configureStore';
import { persistor, store } from './redux/store';

injectStore(store as ToolkitStore);

// Say something
console.log('[Ticketmaster Bot] : Renderer execution started');

// Application to Render
const app = (
  <WindowFrame title='Ticketmaster Bot' platform='windows'>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </WindowFrame>
);

// Render application in DOM
createRoot(document.getElementById('app')).render(app);
