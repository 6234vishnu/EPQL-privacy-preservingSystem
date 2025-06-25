import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../../services/axiosInstance";

function AuthenticateUser() {
  const [isLoading, setIsLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.post(`/api/user/authenticateUser`);
        if (response.data.success) {
          setUserExists(true);
        } else {
          setUserExists(false);
        }
      } catch (error) {
        setUserExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  if (isLoading) return null;

  return userExists ? <Outlet /> : <Navigate to="/login" replace />;
}

export default AuthenticateUser;
