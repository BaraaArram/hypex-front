import { FC } from 'react';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';


const HomePage: FC = () => {
  return (
    <div>
      <h1>Welcome to the App</h1>
      <nav>
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Register</Link>
      </nav>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
};

export default HomePage;
