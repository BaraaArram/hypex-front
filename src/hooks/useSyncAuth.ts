import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useTypedDispatch } from './useTypedDispatch'; 
import { loginSuccess, logout } from '@/features/auth/authSlice'; 

export const useSyncAuth = () => {
  const { data: session, status } = useSession();
  const dispatch = useTypedDispatch();

  useEffect(() => {
    
    if (status === 'authenticated' && session?.user && session?.accessToken) {
      dispatch(
        loginSuccess({
          user: session.user,  
          accessToken: session.accessToken,
        })
      );
    } else if (status === 'unauthenticated') {
      dispatch(logout());
    }
  }, [status, session, dispatch]);
};
