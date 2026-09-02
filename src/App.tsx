import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicPortal from './pages/PublicPortal';
import ClientPortal from './pages/ClientPortal';
import CrmDashboard from './pages/CrmDashboard';
import BondRefundLanding from './pages/BondRefundLanding';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Portal (Trust & Authority) */}
        <Route path="/" element={<PublicPortal />} />
        
        {/* Client Portal (Mi Caso Seguro) */}
        <Route path="/client" element={<ClientPortal />} />
        
        {/* CRM / AI Copilot */}
        <Route path="/crm" element={<CrmDashboard />} />
        
        {/* Landing Page Independiente - Fianzas */}
        <Route path="/fianzas" element={<BondRefundLanding />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
