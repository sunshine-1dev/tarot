import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { initialize } = useAuthStore();

  useEffect(() => {
    // After OAuth redirect, re-initialize auth to pick up the session
    initialize().then(() => {
      navigate('/', { replace: true });
    });
  }, [initialize, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-spin">🔮</div>
        <p className="text-text-secondary">正在完成登录...</p>
      </div>
    </div>
  );
}
