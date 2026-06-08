const prisma = require('../config/db');

/**
 * Generate a unique sequential reference number for the application: VIT-YYYY-XXXXX
 * Features concurrent safe unique checks with retry capabilities.
 */
const generateReferenceNumber = async (tx) => {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
  const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

  // Count existing applications in the current year
  const count = await tx.application.count({
    where: {
      createdAt: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
  });

  const nextIndex = count + 1;
  const suffix = String(nextIndex).padStart(5, '0');
  return `VIT-${currentYear}-${suffix}`;
};

const createApplication = async (data) => {
  // Check for duplicate mobile number to prevent duplicate entries
  const existing = await prisma.application.findFirst({
    where: { mobile: data.mobile },
  });

  if (existing) {
    const error = new Error('This mobile number is already registered under an existing application.');
    error.status = 409; // HTTP 409 Conflict
    throw error;
  }

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      // Execute within a transaction to maintain consistency
      return await prisma.$transaction(async (tx) => {
        const reference = await generateReferenceNumber(tx);
        
        return await tx.application.create({
          data: {
            applicationReference: reference,
            name: data.name,
            mobile: data.mobile,
            amount: data.amount,
            purpose: data.purpose,
            language: data.language,
            status: 'pending', // default starting status
          },
        });
      });
    } catch (error) {
      attempts++;
      // If code is P2002 (Unique constraint failed on application_reference), retry
      if (error.code === 'P2002' && attempts < maxAttempts) {
        continue;
      }
      throw error;
    }
  }
};

const getAllApplications = async (statusFilter) => {
  const where = {};
  if (statusFilter) {
    where.status = statusFilter;
  }

  return await prisma.application.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const updateApplicationStatus = async (id, status) => {
  // Check if application exists first
  const application = await prisma.application.findUnique({
    where: { id },
  });

  if (!application) {
    const error = new Error('Loan application not found');
    error.status = 404;
    throw error;
  }

  return await prisma.application.update({
    where: { id },
    data: { status },
  });
};

const getSummary = async () => {
  const [
    totalApplications,
    totalAmountAggregation,
    pendingCount,
    approvedCount,
    rejectedCount,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.aggregate({
      _sum: {
        amount: true,
      },
    }),
    prisma.application.count({ where: { status: 'pending' } }),
    prisma.application.count({ where: { status: 'approved' } }),
    prisma.application.count({ where: { status: 'rejected' } }),
  ]);

  const totalLoanAmount = totalAmountAggregation._sum.amount
    ? Number(totalAmountAggregation._sum.amount)
    : 0;

  return {
    totalApplications,
    totalLoanAmount,
    pendingCount,
    approvedCount,
    rejectedCount,
  };
};

module.exports = {
  createApplication,
  getAllApplications,
  updateApplicationStatus,
  getSummary,
};
