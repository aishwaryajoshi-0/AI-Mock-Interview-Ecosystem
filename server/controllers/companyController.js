// MODIFIED
import { apiError, apiSuccess } from '../utils/apiResponse.js';
import * as companyService from '../services/companyService.js';

/**
 * Gets all active company names.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await companyService.getAllCompanies();
    return apiSuccess(res, { companies }, 'Companies retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * Gets active roles for a company.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
const getRolesForCompany = async (req, res, next) => {
  try {
    const roles = await companyService.getRolesForCompany(req.params.company);
    return apiSuccess(res, { roles }, 'Roles retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * Gets an active company profile for a company and role.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next function.
 * @returns {Promise<void>}
 */
const getCompanyProfile = async (req, res, next) => {
  try {
    const profile = await companyService.getCompanyProfile(req.params.company, req.params.role);
    if (!profile) {
      return apiError(res, 'Company profile not found', 404);
    }
    return apiSuccess(res, profile, 'Company profile retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

export { getAllCompanies, getRolesForCompany, getCompanyProfile };
