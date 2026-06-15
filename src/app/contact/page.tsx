'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SectionHeader } from '@/components/marketing/MarketingComponents';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid corporate email address'),
  companyName: z.string().min(2, 'Company name is required'),
  role: z.string().min(1, 'Please select your role'),
  inquiryType: z.string().min(1, 'Please select an inquiry type'),
  erpPlatform: z.string().min(1, 'Please select your ERP platform'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

function generateMockTicket() {
  const randomTicket = 'ECQ-' + Math.floor(100000 + Math.random() * 900000);
  const mockHash = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return { ticketId: randomTicket, checksum: mockHash };
}

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [checksum, setChecksum] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      companyName: '',
      role: '',
      inquiryType: 'demo',
      erpPlatform: 'none',
      message: '',
    }
  });

  // Extract type query parameter if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryType = params.get('type');
      if (queryType) {
        if (['demo', 'starter', 'growth', 'enterprise', 'custom', 'assessment'].includes(queryType)) {
          setValue('inquiryType', 'demo');
          setValue('message', `Inquiry regarding the ${queryType.toUpperCase()} package / ledger diagnosis options.`);
        }
      }
    }
  }, [setValue]);

  const onSubmit = async () => {
    setIsPending(true);
    // Simulate API request and ledger submission
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    // Generate mock enterprise ticket signature details
    const { ticketId: randomTicket, checksum: mockHash } = generateMockTicket();
    
    setTicketId(randomTicket);
    setChecksum(mockHash);
    setIsPending(false);
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-24 py-16 px-6 lg:px-8 bg-background text-secondary">
      {/* Header */}
      <SectionHeader
        tag="Contact Sales"
        title="Connect With Our Risk Engineers"
        description="Request a platform demonstration, query technical specifications, or schedule a historical ledger evaluation."
      />

      <section className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white border border-outline-variant rounded-xl p-8 md:p-10 shadow-sm">
          {isSubmitted ? (
            <div className="space-y-6 text-center py-8 animate-fade-in font-sans">
              <div className="w-16 h-16 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-headline text-xl font-bold text-secondary">Inquiry Registered Successfully</h3>
                <p className="text-xs text-outline max-w-md mx-auto leading-relaxed">
                  Your inquiry has been cataloged in our secure tenant communication log. A risk architect will contact you within 12 business hours.
                </p>
              </div>

              <div className="bg-background border border-outline-variant rounded p-4 text-left space-y-2 max-w-md mx-auto text-[10px] text-secondary font-mono">
                <div className="flex justify-between">
                  <span className="text-outline uppercase">Inquiry ID:</span>
                  <span className="font-bold">{ticketId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline uppercase">Status:</span>
                  <span className="text-brand-accent font-bold">QUEUED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-outline uppercase">Signature Hash:</span>
                  <span className="text-right truncate max-w-[200px]" title={checksum}>{checksum}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2 border border-outline-variant text-xs font-bold uppercase tracking-wider rounded hover:bg-background"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Full Name</label>
                  <input
                    {...register('fullName')}
                    className="w-full bg-background border border-outline-variant rounded p-3 text-secondary focus:outline-none focus:border-brand-accent"
                    placeholder="E.g., Arjan Vohra"
                  />
                  {errors.fullName && <p className="text-[#ba1a1a] text-[10px]">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Corporate Email</label>
                  <input
                    {...register('email')}
                    className="w-full bg-background border border-outline-variant rounded p-3 text-secondary focus:outline-none focus:border-brand-accent"
                    placeholder="name@company.com"
                  />
                  {errors.email && <p className="text-[#ba1a1a] text-[10px]">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Company Name</label>
                  <input
                    {...register('companyName')}
                    className="w-full bg-background border border-outline-variant rounded p-3 text-secondary focus:outline-none focus:border-brand-accent"
                    placeholder="E.g., Standard Steel Castings"
                  />
                  {errors.companyName && <p className="text-[#ba1a1a] text-[10px]">{errors.companyName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Your Corporate Role</label>
                  <select
                    {...register('role')}
                    className="w-full bg-background border border-outline-variant rounded p-3 text-secondary focus:outline-none focus:border-brand-accent"
                  >
                    <option value="">Select Role...</option>
                    <option value="cfo">Chief Financial Officer (CFO)</option>
                    <option value="credit">Credit Risk Manager</option>
                    <option value="operations">Commercial Director / VP</option>
                    <option value="analyst">Financial Analyst</option>
                    <option value="engineer">Systems Architect / IT</option>
                    <option value="other">Other Professional</option>
                  </select>
                  {errors.role && <p className="text-[#ba1a1a] text-[10px]">{errors.role.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Inquiry Category</label>
                  <select
                    {...register('inquiryType')}
                    className="w-full bg-background border border-outline-variant rounded p-3 text-secondary focus:outline-none focus:border-brand-accent"
                  >
                    <option value="demo">Demo Request & Presentation</option>
                    <option value="sales">Sales & Pricing Query</option>
                    <option value="partnership">System Partnership Inquiry</option>
                    <option value="support">Customer Support Portal</option>
                  </select>
                  {errors.inquiryType && <p className="text-[#ba1a1a] text-[10px]">{errors.inquiryType.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">ERP Platform In Use</label>
                  <select
                    {...register('erpPlatform')}
                    className="w-full bg-background border border-outline-variant rounded p-3 text-secondary focus:outline-none focus:border-brand-accent"
                  >
                    <option value="none">No ERP / Flat Files (CSV / Excel)</option>
                    <option value="sap">SAP Enterprise</option>
                    <option value="netsuite">Oracle NetSuite</option>
                    <option value="dynamics">Microsoft Dynamics 365</option>
                    <option value="oracle">Oracle ERP Cloud</option>
                    <option value="custom">In-House Custom Ledger Database</option>
                  </select>
                  {errors.erpPlatform && <p className="text-[#ba1a1a] text-[10px]">{errors.erpPlatform.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Inquiry Details</label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className="w-full bg-background border border-outline-variant rounded p-3 text-secondary focus:outline-none focus:border-brand-accent resize-none"
                  placeholder="Please describe your ledger structure, distributor volume, or specific cash-flow problems you wish to address."
                />
                {errors.message && <p className="text-[#ba1a1a] text-[10px]">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-brand-accent text-white font-sans font-bold text-xs uppercase tracking-wider rounded hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending ? 'Registering Inquiry...' : 'Submit Secure Inquiry'}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Corporate Channels */}
        <div className="lg:col-span-5 space-y-8">
          {/* Direct channels */}
          <div className="bg-white border border-outline-variant rounded-xl p-8 space-y-6">
            <h3 className="font-headline text-base font-bold text-secondary">Corporate Channels</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start text-xs">
                <div className="w-8 h-8 rounded bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                </div>
                <div>
                  <h4 className="font-bold text-secondary">Sales & Demos</h4>
                  <p className="text-outline mt-0.5">sales@econ-iq.com</p>
                  <p className="text-[10px] text-outline mt-1 font-mono">PGP Key ID: 0xF7B2C91A</p>
                </div>
              </div>

              <div className="flex gap-4 items-start text-xs">
                <div className="w-8 h-8 rounded bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                </div>
                <div>
                  <h4 className="font-bold text-secondary">Client Support</h4>
                  <p className="text-outline mt-0.5">support@econ-iq.com</p>
                </div>
              </div>

              <div className="flex gap-4 items-start text-xs">
                <div className="w-8 h-8 rounded bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                  <span className="material-symbols-outlined text-[18px]">handshake</span>
                </div>
                <div>
                  <h4 className="font-bold text-secondary">Alliances & Partnerships</h4>
                  <p className="text-outline mt-0.5">alliances@econ-iq.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance & Verification Panel */}
          <div className="bg-secondary text-white rounded-xl p-8 space-y-4 border border-[#34485E]">
            <h3 className="font-headline text-sm font-bold text-[#FAF9F6] uppercase tracking-wider">Security & Auditing</h3>
            <p className="font-sans text-xs text-[#9EADB3] leading-relaxed">
              All communications and document transfers made via this channel are encrypted. Econ-IQ supports secure tenant spaces, SOC-2 certifications, and encrypted file transfers for corporate security validation.
            </p>
            <div className="h-px bg-[#34485E]"></div>
            <div className="flex items-center gap-4 text-[10px] text-[#80d5cb] font-semibold uppercase tracking-wider">
              <span>SOC-2 Type II</span>
              <span>•</span>
              <span>AES-256 Encrypted</span>
              <span>•</span>
              <span>ISO 27001</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
