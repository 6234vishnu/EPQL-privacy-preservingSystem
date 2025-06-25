import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../../services/axiosInstance";

function AuthenticateAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    const getAdmin = async () => {
      try {
        const response = await api.post(`/api/admin/authenticateAdmin`);
        if (response.data.success) {
          setAdminExists(true);
        } else {
          setAdminExists(false);
        }
      } catch (error) {
        setAdminExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    getAdmin();
  }, []);

  if (isLoading) return null;

  return adminExists ? <Outlet /> : <Navigate to="/login" replace />;
}

export default AuthenticateAdmin;
