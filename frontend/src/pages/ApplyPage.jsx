import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationApi } from '../services/api';
import { useToast } from '../hooks/useToast';
import { useRoute } from '../hooks/useRoute';
import { LANGUAGES } from '../constants/languages';
import { 
  User, 
  Phone, 
  Coins, 
  FileEdit, 
  Languages, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(255, 'Name cannot exceed 255 characters'),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Invalid mobile number. Must be a 10-digit number starting with 6-9'),
  amount: z
    .string()
    .trim()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)), 'Amount must be a valid number')
    .transform((val) => Number(val))
    .pipe(
      z.number()
        .min(50000, 'Amount must be at least ₹50,000')
        .max(5000000, 'Amount cannot exceed ₹50 Lakh (₹5,000,000)')
    ),
  purpose: z
    .string()
    .trim()
    .min(5, 'Purpose must be at least 5 characters long')
    .max(5000, 'Purpose cannot exceed 5000 characters'),
  language: z.string().min(1, 'Please select your preferred language'),
});

export const ApplyPage = () => {
  const { toast } = useToast();
  const [, navigate] = useRoute();
  const queryClient = useQueryClient();
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    localStorage.removeItem('vitto_admin_token');
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      mobile: '',
      amount: '',
      purpose: '',
      language: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => applicationApi.submit(data),
    onSuccess: (response) => {
      // Invalidate dashboard applications list & summary stats queries
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      
      toast('Loan application submitted successfully!', 'success');
      setSuccessData(response.data);
      reset();
    },
    onError: (err) => {
      const errorMsg = err.message || 'Submission failed. Please check inputs.';
      toast(errorMsg, 'error');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  // SUCCESS DISPLAY CARD
  if (successData) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-premium ring-1 ring-slate-100 animate-slide-up">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-brand-success mb-6 shadow-sm shadow-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-brand-success" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
            Application Submitted Successfully
          </h2>
          
          <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
            Your borrowing application has been uploaded to the registry. Keep the reference below to track your approval process.
          </p>

          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 mb-8">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Reference Number
            </span>
            <div className="text-2xl font-extrabold tracking-wide text-slate-800 mt-1.5 font-mono select-all select-none selection:bg-blue-100">
              {successData.applicationReference}
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/20 hover:bg-blue-700 transition-all duration-200"
          >
            <span>View Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // STANDARD FORM DISPLAY
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Copy/Branding */}
        <div className="lg:col-span-5 flex flex-col justify-center lg:py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-100 bg-blue-50 text-brand-primary text-xs font-semibold w-max mb-6">
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>INSTANT VERIFICATION</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-tight">
            Borrow simple. <br />
            Grow faster with <span className="bg-gradient-to-r from-brand-primary to-blue-500 bg-clip-text text-transparent">Vitto</span>.
          </h1>

          <p className="mt-4 text-base text-slate-500 max-w-lg leading-relaxed">
            Fill out our standardized multilingual request registry. Applications are forwarded instantly to underwriters. Connect in your local dialect.
          </p>

          <div className="mt-8 space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-slate-200 text-slate-600 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Encrypted Submissions</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  All loans and mobile verifications are fully encrypted using military-grade DB security.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-slate-200 text-slate-600 shadow-sm">
                <Languages className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Regional Assistance</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  We support processing applications in 5 distinct local languages: Hindi, Telugu, Tamil, Marathi, and English.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-premium">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Loan Application Form
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Applicant Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Applicant Name
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="Enter full legal name"
                    className={`block w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border bg-slate-50/50 hover:bg-slate-50 focus:bg-white outline-none transition-all duration-200 ${
                      errors.name 
                        ? 'border-rose-300 focus:border-brand-danger focus:ring-1 focus:ring-brand-danger' 
                        : 'border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs text-brand-danger flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    <span>{errors.name.message}</span>
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Mobile Number
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    {...register('mobile')}
                    placeholder="10-digit mobile number (e.g. 9876543210)"
                    className={`block w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border bg-slate-50/50 hover:bg-slate-50 focus:bg-white outline-none transition-all duration-200 ${
                      errors.mobile 
                        ? 'border-rose-300 focus:border-brand-danger focus:ring-1 focus:ring-brand-danger' 
                        : 'border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'
                    }`}
                  />
                </div>
                {errors.mobile ? (
                  <p className="mt-1.5 text-xs text-brand-danger flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    <span>{errors.mobile.message}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-400 pl-1">
                    Must start with digits 6, 7, 8, or 9
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Loan Amount */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Loan Amount (₹)
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                      ₹
                    </div>
                    <input
                      type="number"
                      {...register('amount')}
                      placeholder="e.g. 50000"
                      className={`block w-full pl-8 pr-3.5 py-3 text-sm rounded-xl border bg-slate-50/50 hover:bg-slate-50 focus:bg-white outline-none transition-all duration-200 ${
                        errors.amount 
                          ? 'border-rose-300 focus:border-brand-danger focus:ring-1 focus:ring-brand-danger' 
                          : 'border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'
                      }`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1.5 text-xs text-brand-danger flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      <span>{errors.amount.message}</span>
                    </p>
                  )}
                </div>

                {/* Preferred Language */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Preferred Language
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Languages className="h-4 w-4" />
                    </div>
                    <select
                      {...register('language')}
                      className={`block w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border bg-slate-50/50 hover:bg-slate-50 focus:bg-white outline-none appearance-none transition-all duration-200 ${
                        errors.language 
                          ? 'border-rose-300 focus:border-brand-danger focus:ring-1 focus:ring-brand-danger' 
                          : 'border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'
                      }`}
                    >
                      <option value="">Select Preferred Language</option>
                      {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                  {errors.language && (
                    <p className="mt-1.5 text-xs text-brand-danger flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      <span>{errors.language.message}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Loan Purpose */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Loan Purpose
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-400">
                    <FileEdit className="h-4 w-4" />
                  </div>
                  <textarea
                    {...register('purpose')}
                    rows={3}
                    placeholder="Describe why you need the loan and how you plan to use it..."
                    className={`block w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border bg-slate-50/50 hover:bg-slate-50 focus:bg-white outline-none transition-all duration-200 resize-none ${
                      errors.purpose 
                        ? 'border-rose-300 focus:border-brand-danger focus:ring-1 focus:ring-brand-danger' 
                        : 'border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'
                    }`}
                  />
                </div>
                {errors.purpose && (
                  <p className="mt-1.5 text-xs text-brand-danger flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    <span>{errors.purpose.message}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-primary/25 hover:bg-blue-700 active:scale-98 transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none"
              >
                {mutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
