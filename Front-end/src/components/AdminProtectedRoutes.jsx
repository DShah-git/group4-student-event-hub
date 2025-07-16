import { Navigate } from 'react-router-dom';
import { isAdminAuthenticated } from '../Util/adminAuth';

export default function UserProtectedRoute({ children }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}