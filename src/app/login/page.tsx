'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '@/components/ui/Button';

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
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

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
      const frameId = requestAnimationFrame(() => {
        otpInputsRef.current[0]?.focus();
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [step]);

  // Handle countdown timer seconds via requestAnimationFrame
  useEffect(() => {
    let frameId: number;
    let lastUpdate = Date.now();
    const run = () => {
      const now = Date.now();
      if (now - lastUpdate >= 1000) {
        setTimerSeconds((prev) => Math.max(0, prev - 1));
        lastUpdate = now;
      }
      frameId = requestAnimationFrame(run);
    };
    if (step === 'otp' && timerSeconds > 0) {
      frameId = requestAnimationFrame(run);
    }
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [step, timerSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle email form submission
  const onEmailSubmit = async (values: EmailFormValues) => {
    setErrorMsg(null);
    setResendStatus(null);
    try {
      await requestOtp.mutateAsync(values.email);
      setEmailInput(values.email);
      setTimerSeconds(120); // Reset countdown timer
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
  const handleOtpPaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newOtpValues = pastedData.split('');
      setOtpValues(newOtpValues);
      otpInputsRef.current[5]?.focus();
      
      // Auto-trigger verification
      setErrorMsg(null);
      try {
        await verifyOtp.mutateAsync({ email: emailInput, otp: pastedData });
      } catch (err: unknown) {
        let errMsg = 'Invalid or expired verification token.';
        if (err && typeof err === 'object' && 'response' in err) {
          const res = (err as { response?: { data?: { message?: string } } }).response;
          if (res?.data?.message) errMsg = res.data.message;
        }
        setErrorMsg(errMsg);
      }
    }
  };

  // Handle OTP verification submit
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
    } catch (err: unknown) {
      let errMsg = 'Invalid or expired verification token.';
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as { response?: { data?: { message?: string } } }).response;
        if (res?.data?.message) errMsg = res.data.message;
      }
      setErrorMsg(errMsg);
    }
  };

  const handleResendOtp = async () => {
    if (timerSeconds > 0) return;
    setErrorMsg(null);
    setResendStatus(null);
    try {
      await requestOtp.mutateAsync(emailInput);
      setTimerSeconds(120); // Reset timer
      setResendStatus('A new access code has been dispatched.');
      const start = Date.now();
      let resendFrame: number;
      const checkClear = () => {
        if (Date.now() - start >= 3000) {
          setResendStatus(null);
        } else {
          resendFrame = requestAnimationFrame(checkClear);
        }
      };
      resendFrame = requestAnimationFrame(checkClear);
    } catch (e: unknown) {
      let errMsg = 'Failed to resend access token.';
      if (e && typeof e === 'object' && 'response' in e) {
        const res = (e as { response?: { data?: { message?: string } } }).response;
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
              <div className="mb-6 p-4 rounded-lg bg-error-container/20 border border-error/50 text-error text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {resendStatus && (
              <div className="mb-6 p-4 rounded-lg bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-xs font-semibold">
                {resendStatus}
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
                      className="w-full bg-background border border-outline-variant rounded-lg px-4 py-3 text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-outline/60"
                      placeholder="name@company.com"
                      required
                      type="email"
                    />
                  </div>
                  {errors.email && (
                    <span className="text-error text-xs block">{errors.email.message}</span>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={requestOtp.isPending}
                  variant="primary"
                  className="w-full h-14"
                >
                  {requestOtp.isPending ? 'Sending...' : 'Request Access Token'}
                </Button>

                <div className="pt-4 flex items-center justify-center gap-2 border-t border-outline-variant/30">
                  <span className="font-sans text-xs text-outline">
                    End-to-End Encrypted Authentication
                  </span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-sans text-xs text-outline block uppercase tracking-wider font-semibold">
                      Verification Token
                    </label>
                    <span className="font-mono text-xs text-brand-accent font-semibold">
                      {formatTime(timerSeconds)}
                    </span>
                  </div>
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
                  <div className="pt-2 text-[10px] text-outline flex justify-between">
                    <span>* Default OTP: 735011</span>
                    <span>Expires in 2m</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={verifyOtp.isPending}
                  variant="primary"
                  className="w-full h-14"
                >
                  {verifyOtp.isPending ? 'Validating...' : 'Validate Identity'}
                </Button>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={timerSeconds > 0 || requestOtp.isPending}
                    className={`w-full font-sans text-xs font-semibold uppercase tracking-wider text-center transition-all ${
                      timerSeconds > 0
                        ? 'text-outline/40 cursor-not-allowed'
                        : 'text-brand-accent hover:underline cursor-pointer'
                    }`}
                  >
                    {timerSeconds > 0 ? `Resend code in ${formatTime(timerSeconds)}` : 'Resend Access Code'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setOtpValues(Array(6).fill(''));
                      setErrorMsg(null);
                      setResendStatus(null);
                    }}
                    className="w-full text-outline font-sans text-xs hover:text-primary transition-colors cursor-pointer"
                  >
                    Change email address
                  </button>
                </div>
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
