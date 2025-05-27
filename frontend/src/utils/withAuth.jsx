import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
      } else {
        setLoading(false);
      }
    }, [navigate]);

    if (loading) return null; // ✅ block rendering until auth check completes

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
