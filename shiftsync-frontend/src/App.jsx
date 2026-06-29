import { AnimatePresence } from 'framer-motion';
import AppRouter from './router/AppRouter.jsx';

function App() {
  return (
    <AnimatePresence mode="wait">
      <AppRouter />
    </AnimatePresence>
  );
}

export default App;
