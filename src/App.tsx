import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BondRefundLanding from './pages/BondRefundLanding';
import CrmDashboard from './pages/CrmDashboard';
import ClientPortal from './pages/ClientPortal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Principal Única - Fianzas */}
        <Route path="/" element={<BondRefundLanding />} />
        
        {/* CRM para la Socia */}
        <Route path="/crm" element={<CrmDashboard />} />
        
        {/* Portal del Cliente para rastreo */}
        <Route path="/client" element={<ClientPortal />} />
        
        {/* Wildcard to catch all other paths and redirect to root */}
        <Route path="*" element={<BondRefundLanding />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
