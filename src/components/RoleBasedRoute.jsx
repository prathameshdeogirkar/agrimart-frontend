import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * ✅ RoleBasedRoute: Protects routes based on user role
 * 
 * Usage:
 *   <RoleBasedRoute requiredRole="ADMIN">
 *     <AdminPanel />
 *   </RoleBasedRoute>
 * 
 * @param {React.ReactNode} children - Component to render if authorized
 * @param {string} requiredRole - 'ADMIN' | 'USER' | 'PUBLIC'
 * @param {React.ReactNode} fallback - Component to show if unauthorized
 */
export default function RoleBasedRoute({ children, requiredRole = 'USER', fallback = null }) {
  const { role, user } = useAuth();
  const navigate = useNavigate();

  // ✅ Check authorization logic
  const isAuthorized = () => {
    if (requiredRole === 'PUBLIC') return true;
    if (requiredRole === 'ADMIN') return role === 'ADMIN';
    if (requiredRole === 'USER') return role === 'USER';
    return false;
  };

  if (!isAuthorized()) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            {requiredRole === 'ADMIN'
              ? 'Only administrators can access this feature.'
              : `You need ${requiredRole} access to view this page.`}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return children;
}
