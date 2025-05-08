
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure we have a root element to render to
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create root and render the App inside it
createRoot(rootElement).render(<App />);
