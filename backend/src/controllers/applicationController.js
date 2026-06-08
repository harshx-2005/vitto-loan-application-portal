const applicationService = require('../services/applicationService');

const submitApplication = async (req, res, next) => {
  try {
    const application = await applicationService.createApplication(req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully',
      data: {
        id: application.id,
        applicationReference: application.applicationReference,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    // Optional status validation (if provided, verify it is pending, approved or rejected)
    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status filter query parameter. Must be pending, approved, or rejected.',
        errors: [{ field: 'status', message: 'Invalid status filter value' }],
      });
    }

    const applications = await applicationService.getAllApplications(status);

    return res.status(200).json({
      success: true,
      message: 'Applications retrieved successfully',
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Verify UUID format for parameter ID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application ID format. Must be a valid UUID.',
        errors: [{ field: 'id', message: 'Invalid ID format' }],
      });
    }

    const updatedApplication = await applicationService.updateApplicationStatus(id, status);

    return res.status(200).json({
      success: true,
      message: `Application status updated to '${status}' successfully`,
      data: updatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

const getAnalyticsSummary = async (req, res, next) => {
  try {
    const summary = await applicationService.getSummary();

    return res.status(200).json({
      success: true,
      message: 'Analytics summary retrieved successfully',
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitApplication,
  getApplications,
  updateStatus,
  getAnalyticsSummary,
};
