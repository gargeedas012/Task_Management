import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './src/app/store.ts'
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import AuthInitializer from './src/components/AuthInitializer.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import {ThemeProvider } from "./context/ThemeContext.tsx";


const clientID=import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={clientID}>
    <Provider store={store}>
      <FluentProvider theme={webLightTheme}>
        <AuthInitializer>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AuthInitializer>
      </FluentProvider>
    </Provider>
    </GoogleOAuthProvider>
)
