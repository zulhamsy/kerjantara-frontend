import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Splash from './screens/Splash';
import Landing from './screens/Landing';
import Register from './screens/Register';
import VerifyOTP from './screens/VerifyOTP';
import SelectRole from './screens/SelectRole';
import DocType from './screens/DocType';
import DocCamera from './screens/DocCamera';
import SelfieCamera from './screens/SelfieCamera';
import Review from './screens/Review';
import Dashboard from './screens/Dashboard';

export default function App() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [userName, setUserName] = useState('Budi Santoso');
  const [userEmail, setUserEmail] = useState('kerjantara@example.com');
  const [userRole, setUserRole] = useState<'jobseeker' | 'client'>('jobseeker');

  const goToStep = (nextStep: number) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Splash onFinish={() => goToStep(2)} />;
      case 2: return <Landing onNext={() => goToStep(3)} onSkipToOTP={() => goToStep(4)} />;
      case 3: return <Register onBack={() => goToStep(2)} onNext={(name) => { setUserName(name); goToStep(4); }} />;
      case 4: return <VerifyOTP onBack={() => goToStep(3)} onNext={() => goToStep(5)} />;
      case 5: return <SelectRole onBack={() => goToStep(4)} onNext={(roleSelected) => { setUserRole(roleSelected); goToStep(6); }} />;
      case 6: return <DocType onBack={() => goToStep(5)} onNext={() => goToStep(7)} />;
      case 7: return <DocCamera onCancel={() => goToStep(6)} onNext={() => goToStep(8)} />;
      case 8: return <SelfieCamera onCancel={() => goToStep(7)} onNext={() => goToStep(9)} />;
      case 9: return <Review onBack={() => goToStep(8)} onNext={() => goToStep(10)} />;
      case 10: return <Dashboard initialRole={userRole} userName={userName} userEmail={userEmail} />;
      default: return <Landing onNext={() => goToStep(3)} />;
    }
  };

  const variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    }),
  };

  return (
    <div className="flex items-center justify-center min-h-screen font-sans text-neutral-900 bg-gray-100 sm:p-4">
      {/* Mobile Device Frame styling for desktop, full width on mobile */}
      <div className="relative w-full max-w-[430px] h-[100dvh] sm:h-[850px] sm:max-h-[90vh] bg-neutral-100 sm:rounded-[40px] sm:shadow-2xl overflow-hidden sm:border-[8px] sm:border-gray-900 flex flex-col">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 w-full h-full flex flex-col bg-neutral-100"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
