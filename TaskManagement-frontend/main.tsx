import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './src/app/store.ts'
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import AuthInitializer from './src/components/AuthInitializer.tsx'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <FluentProvider theme={webLightTheme}>
        <AuthInitializer>
          <App />
        </AuthInitializer>
      </FluentProvider>
    </Provider>
)
