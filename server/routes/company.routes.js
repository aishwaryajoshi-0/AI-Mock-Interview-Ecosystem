import express from 'express';
import * as companyController from '../controllers/companyController.js';

const router = express.Router();

/**
 * GET /api/companies - Get all active companies
 */
router.get('/', companyController.getAllCompanies);

/**
 * GET /api/companies/:company/roles - Get roles for a company
 */
router.get('/:company/roles', companyController.getRolesForCompany);

/**
 * GET /api/companies/:company/:role - Get company profile for a role
 */
router.get('/:company/:role', companyController.getCompanyProfile);

export default router;
