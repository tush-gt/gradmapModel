import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { StepIndicator } from '../common/StepIndicator';
import { S1_Welcome } from './S1_Welcome';
import { S2_Profile } from './S2_Profile';
import { S3_Documents } from './S3_Documents';
import { S4_OptionForm } from './S4_OptionForm';
import { S5_Allotment } from './S5_Allotment';
import { S6_Decision } from './S6_Decision';
import { S8_Confirmed } from './S8_Confirmed';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export const SimulatorLayout = () => {
  const currentStep = useAppStore(state => state.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <S1_Welcome />;
      case 2: return <S2_Profile />;
      case 3: return <S3_Documents />;
      case 4: return <S4_OptionForm />;
      case 5: return <S5_Allotment />;
      case 6: return <S6_Decision />;
      case 7: return <S5_Allotment />;
      case 8: return <S8_Confirmed />;
      default: return <S1_Welcome />;
    }
  };

  const stepTitles = {
    1: { title: 'CAP Round Simulator', sub: 'Practice the full MHT-CET admission process safely.' },
    2: { title: 'Candidate Profile', sub: 'Tell us about yourself to personalise your simulation.' },
    3: { title: 'Document Checklist', sub: 'Verify all required documents before you proceed.' },
    4: { title: 'Option Form', sub: 'Build and lock your preference list.' },
    5: { title: 'Allotment Result', sub: 'See where the algorithm seats you.' },
    6: { title: 'Your Decision', sub: 'Choose how you want to play this round.' },
    7: { title: 'Next Round', sub: 'Your choices carry forward — let\'s run the next round.' },
    8: { title: 'Simulation Complete', sub: 'Here\'s your final admission outcome.' },
  };

  const { title, sub } = stepTitles[currentStep] || stepTitles[1];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-[20%] w-[500px] h-[500px] rounded-full bg-brand-base/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-teal-500/5 blur-[80px] pointer-events-none" />

      {/* Top Nav Bar */}
      <nav className="border-b border-border/40 bg-card/40 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-base to-cyan-500 rounded-lg flex items-center justify-center shadow-md shadow-brand-base/30">
              <GraduationCap className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-brand-base to-cyan-400">GradMap</span>
          </Link>
          <Link to="/predictor" className="text-sm text-muted-foreground hover:text-brand-base transition-colors">
            ← College Predictor
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-20 relative z-10">
        {/* Page header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-base via-teal-400 to-cyan-400 mb-2">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg">{sub}</p>
        </div>

        {/* Step indicator card */}
        <div className="glass rounded-2xl p-6 mb-8 border-brand-base/10">
          <StepIndicator />
        </div>

        {/* Step content */}
        <div className="transition-all duration-300">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};
