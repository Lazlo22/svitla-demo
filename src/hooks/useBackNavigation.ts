import { useCallback } from 'react';
import { useNavigate } from 'react-router';

export function useBackNavigation() {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    navigate(-1);
  }, []);

  return { goBack };
}
