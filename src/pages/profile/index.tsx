import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/hooks/useAppSelector';

const ProfilePage: FC = () => {
  const router = useRouter();
  const { user, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken) {
      router.push('/auth/login');
    }
  }, [accessToken, router]);

  if (!user) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
    </div>
  );
};

export default ProfilePage;
