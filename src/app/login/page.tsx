'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const emailSchema = z.object({
  email: z.string().email('Invalid corporate email address'),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function LoginPage() {
  const { requestOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [emailInput, setEmailInput] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const otpInputsRef = useRef<HTMLInputElement[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  // Focus first OTP input when moving to OTP step
  useEffect(() => {
    if (step === 'otp') {
      const timer = setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Handle email form submission
  const onEmailSubmit = async (values: EmailFormValues) => {
    setErrorMsg(null);
    try {
      await requestOtp.mutateAsync(values.email);
      setEmailInput(values.email);
      setStep('otp');
    } catch (e: unknown) {
      let errMsg = 'Failed to request access token.';
      if (e && typeof e === 'object' && 'response' in e) {
        const res = (e as { response?: { data?: { message?: string } } }).response;
        if (res?.data?.message) errMsg = res.data.message;
      }
      setErrorMsg(errMsg);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, val: string) => {
    const newVal = val.replace(/[^0-9]/g, '');
    const newOtpValues = [...otpValues];
    newOtpValues[index] = newVal;
    setOtpValues(newOtpValues);
    setErrorMsg(null);

    // Auto-advance
    if (newVal && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle OTP keydowns (like Backspace)
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = '';
        setOtpValues(newOtpValues);
        otpInputsRef.current[index - 1]?.focus();
      } else {
        const newOtpValues = [...otpValues];
        newOtpValues[index] = '';
        setOtpValues(newOtpValues);
      }
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newOtpValues = pastedData.split('');
      setOtpValues(newOtpValues);
      otpInputsRef.current[5]?.focus();
    }
  };

  // Handle OTP validation
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpValues.join('');
    if (fullOtp.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the verification token.');
      return;
    }

    setErrorMsg(null);
    try {
      await verifyOtp.mutateAsync({ email: emailInput, otp: fullOtp });
      // Redirect happens in the layout guards automatically
    } catch (err: unknown) {
      let errMsg = 'Invalid or expired verification token.';
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as { response?: { data?: { message?: string } } }).response;
        if (res?.data?.message) errMsg = res.data.message;
      }
      setErrorMsg(errMsg);
    }
  };

  // Mouse move parallax effect from Stitch
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      if (cardRef.current) {
        cardRef.current.style.transform = `translate(${(x - 0.5) * 10}px, ${(y - 0.5) * 10}px)`;
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-hidden bg-background text-on-background">
      {/* Branding Header */}
      <header className="relative z-10 w-full px-margin-desktop h-24 flex items-center justify-center md:justify-start">
        <span className="font-headline text-3xl font-extrabold text-primary tracking-tight">Econ-IQ</span>
      </header>

      {/* Main Login Form Container */}
      <main className="flex-grow flex items-center justify-center relative z-10 px-margin-mobile">
        <div className="w-full max-w-[440px] transition-all duration-700">
          <div
            ref={cardRef}
            className="bg-surface p-10 md:p-12 rounded-xl border border-outline-variant transition-all duration-500 shadow-[0_0_40px_-10px_rgba(15,118,110,0.15)]"
          >
            <div className="mb-8 space-y-2">
              <h1 className="font-headline text-2xl font-bold text-on-surface">Command Center Access</h1>
              <p className="font-sans text-sm text-outline">
                {step === 'email'
                  ? 'Enter your enterprise email to receive an access token.'
                  : 'Enter the verification token sent to your email.'}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-lg bg-error-container/20 border border-error/50 text-error text-xs">
                {errorMsg}
              </div>
            )}

            {step === 'email' ? (
              <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-sans text-xs text-outline block uppercase tracking-wider font-semibold" htmlFor="email">
                    Corporate Email
                  </label>
                  <div className="relative group">
                    <input
                      {...register('email')}
                      id="email"
                      className="w-full bg-background border border-outline-variant rounded-lg px-4 py-3 text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-outline"
                      placeholder="name@company.com"
                      required
                      type="email"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-40 group-focus-within:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-primary">mail</span>
                    </div>
                  </div>
                  {errors.email && (
                    <span className="text-error text-xs block">{errors.email.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={requestOtp.isPending}
                  className="w-full bg-[#161A1D] text-white hover:bg-[#161A1D]/90 font-headline font-semibold text-base h-14 flex items-center justify-center rounded-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {requestOtp.isPending ? 'Sending...' : 'Request Access Token'}
                </button>

                <div className="pt-4 flex items-center justify-center gap-2 border-t border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                  <span className="font-sans text-xs text-outline">
                    End-to-End Encrypted Authentication
                  </span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-sans text-xs text-outline block uppercase tracking-wider font-semibold">
                    Verification Token
                  </label>
                  <div className="flex justify-between gap-2">
                    {otpValues.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          if (el) otpInputsRef.current[index] = el;
                        }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={index === 0 ? handleOtpPaste : undefined}
                        className="w-12 h-14 bg-background border border-outline-variant rounded-lg text-center text-xl font-headline font-bold text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={verifyOtp.isPending}
                  className="w-full bg-[#161A1D] text-white hover:bg-[#161A1D]/90 font-headline font-semibold text-base h-14 flex items-center justify-center rounded-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {verifyOtp.isPending ? 'Validating...' : 'Validate Identity'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setOtpValues(Array(6).fill(''));
                    setErrorMsg(null);
                  }}
                  className="w-full text-outline font-sans text-xs hover:text-primary transition-colors cursor-pointer"
                >
                  Did not receive a token? Try again
                </button>
              </form>
            )}
          </div>

          <p className="mt-8 text-center font-sans text-xs text-outline px-8">
            Secured by Econ-IQ Shield. Unauthorized access attempts are monitored and recorded according to enterprise security protocol.
          </p>
        </div>
      </main>

      {/* Transactional Footer */}
      <footer className="relative z-10 w-full py-6 px-margin-desktop border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 bg-surface">
        <div className="font-sans text-xs text-outline">
          © 2026 Econ-IQ. Architectural Intelligence for Global B2B Networks.
        </div>
        <div className="flex gap-6">
          <a className="font-sans text-xs text-outline hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="font-sans text-xs text-outline hover:text-primary transition-colors" href="#">Security Standards</a>
          <a className="font-sans text-xs text-outline hover:text-primary transition-colors" href="#">Support Portal</a>
        </div>
      </footer>
    </div>
  );
}
