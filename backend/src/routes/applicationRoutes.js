const express = require('express');
const router = express.Router();

const applicationController = require('../controllers/applicationController');
const validate = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { createApplicationSchema, updateStatusSchema } = require('../validators/applicationValidator');

// POST /api/auth/login - Authenticate admin credentials
router.post('/auth/login', (req, res) => {
  const { email, password, secretKey } = req.body;
  const key = password || secretKey;

  if (email === 'admin@example.com' && key === 'admin@vitto') {
    return res.status(200).json({
      success: true,
      message: 'Admin authenticated successfully',
      data: {
        token: 'vitto-admin-session-token-2026',
        user: {
          email: 'admin@example.com',
          role: 'admin'
        }
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials. Check your email and secret key.',
    errors: [{ message: 'Invalid email or secret key' }]
  });
});

// POST /api/applications - Submit a new loan application (Public endpoint)
router.post('/applications', validate(createApplicationSchema), applicationController.submitApplication);

// GET /api/applications - Get all loan applications (Protected)
router.get('/applications', authMiddleware, applicationController.getApplications);

// PATCH /api/applications/:id/status - Update application status (Protected)
router.patch('/applications/:id/status', authMiddleware, validate(updateStatusSchema), applicationController.updateStatus);

// GET /api/summary - Get aggregate analytics summary for applications (Protected)
router.get('/summary', authMiddleware, applicationController.getAnalyticsSummary);

module.exports = router;
