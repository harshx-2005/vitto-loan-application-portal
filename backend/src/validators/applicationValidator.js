const { z } = require('zod');

const ALLOWED_LANGUAGES = ['Hindi', 'Tamil', 'Telugu', 'Marathi', 'English'];
const ALLOWED_STATUSES = ['pending', 'approved', 'rejected'];

const createApplicationSchema = z.object({
  name: z
    .string({ required_error: 'Applicant name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(255, 'Name cannot exceed 255 characters'),
  mobile: z
    .string({ required_error: 'Mobile number is required' })
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Invalid mobile number. Must be a 10-digit number starting with 6-9'),
  amount: z
    .number({ required_error: 'Loan amount is required', invalid_type_error: 'Loan amount must be a number' })
    .min(50000, 'Loan amount must be at least ₹50,000')
    .max(5000000, 'Loan amount cannot exceed ₹50 Lakh (₹5,000,000)'),
  purpose: z
    .string({ required_error: 'Loan purpose is required' })
    .trim()
    .min(5, 'Purpose must be at least 5 characters long')
    .max(5000, 'Purpose cannot exceed 5000 characters'),
  language: z.enum(ALLOWED_LANGUAGES, {
    errorMap: () => ({
      message: `Preferred language must be one of: ${ALLOWED_LANGUAGES.join(', ')}`,
    }),
  }),
});

const updateStatusSchema = z.object({
  status: z.enum(['approved', 'rejected'], {
    errorMap: () => ({
      message: 'Status must be either "approved" or "rejected"',
    }),
  }),
});

module.exports = {
  createApplicationSchema,
  updateStatusSchema,
  ALLOWED_LANGUAGES,
  ALLOWED_STATUSES,
};
