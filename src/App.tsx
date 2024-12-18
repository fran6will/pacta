import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { useUser } from './context/UserContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import QuestionPage from './pages/QuestionPage';
import OrganizationDashboard from './pages/OrganizationDashboard';
import OrganizationPublicPage from './pages/OrganizationPublicPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import PendingApprovalPage from './pages/PendingApprovalPage';
import AdminPage from './pages/AdminPage';
import PurchasePage from './pages/PurchasePage'; // Nouvelle page de paiement
import PackSuccessPage from './pages/PackSuccessPage';
import OrganizationsPage from './pages/OrganizationsPage';
import HowItWorksPage from './pages/HowItWorks';
function AppRoutes() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/question/:id" element={<QuestionPage />} />
      <Route path="/organizations/:id" element={<OrganizationPublicPage />} />
      <Route path="/success" element={<PaymentSuccessPage />} />
      <Route path="/cancel" element={<PaymentCancelPage />} />
      <Route path="/purchase" element={<PurchasePage />} /> {/* Nouvelle route pour la page d'achat */}
      <Route path="/pack-success" element={<PackSuccessPage />} />
      <Route path="/organizations" element={<OrganizationsPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
 
      {/* Routes protégées */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.userType === 'organization' ? (
              <Navigate to="/organization/dashboard" replace />
            ) : (
              <DashboardPage />
            )}
          </ProtectedRoute>
        }
      />

      {/* Routes Organisation */}
      <Route
        path="/organization/dashboard"
        element={
          <ProtectedRoute>
            {user?.userType === 'organization' && user.organization?.status === 'approved' ? (
              <OrganizationDashboard />
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/organization/pending-approval"
        element={
          <ProtectedRoute>
            {user?.userType === 'organization' && user.organization?.status === 'pending' ? (
              <PendingApprovalPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Routes Admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            {user?.isAdmin ? (
              <AdminPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-50">
        <Router>
          <Layout>
            <div className="container mx-auto px-4">
              <AppRoutes />
            </div>
          </Layout>
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;