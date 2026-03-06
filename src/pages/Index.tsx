import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Legacy index redirects to landing or dashboard
const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      navigate(user ? "/dashboard" : "/", { replace: true });
    }
  }, [user, loading, navigate]);

  return null;
};

export default Index;
