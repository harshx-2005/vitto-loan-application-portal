const errorHandler = (err, req, res, next) => {
  // Always log the full error stack trace for cloud diagnostics
  console.error('[Error Handler Trace]:', err);

  // Handle Zod Validation Errors
  if (err.name === 'ZodError' || (err.issues && Array.isArray(err.issues))) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  // Handle Prisma Database Errors
  if (err.code && err.code.startsWith('P')) {
    let statusCode = 500;
    let message = 'Database error occurred';

    if (err.code === 'P2002') {
      statusCode = 409;
      message = `Unique constraint failed on field(s): ${err.meta?.target || 'unknown'}`;
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    }

    return res.status(statusCode).json({
      success: false,
      message,
      errors: [{ message: err.message }],
    });
  }

  // Handle Custom API Errors (with status property)
  const statusCode = err.status || 500;
  const message = err.message || 'Internal server error';

  return res.status(statusCode).json({
    success: false,
    message,
    errors: [{ message }],
  });
};

module.exports = errorHandler;
