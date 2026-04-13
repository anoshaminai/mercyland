import Logo from './Logo';
import EmailSignup from './EmailSignup';

const Home = () => {
  return (
    <div className="flex flex-col">
      <main className="flex flex-col items-center pt-8 pb-8">
        <div className="max-w-content mx-auto">
          <Logo />
          <EmailSignup />
        </div>
      </main>
    </div>
  );
};

export default Home; 