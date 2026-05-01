import { errorResponse, successResponse } from "../utils/response.js";
import {
    createAdminEntryService,
    getEntriesService,
    getEntryByIdService,
    updateAdminEntryService,
    deleteAdminEntryService,
    getAdminConfigsService
} from "../services/admin.service.js";

const getAdminConfigs = async (req, res) => {
    try {
        const response = await getAdminConfigsService();
        return successResponse(res, response.status, response.message, response.data);
    } catch (error) {
        return errorResponse(res, 500, "Controller error", error);
    }
};

const createEntry = async (req, res) => {
    try {
        const { name } = req.params;
        const response = await createAdminEntryService({ name, data: req.body, file: req.file })
        if (response.status === 201) {
            return successResponse(res, response.status, response.message, response.data)
        } else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 500, "error in creating entry", error)
    }
};

const getEntries = async (req, res) => {
    try {
        const { name } = req.params;
        const response = await getEntriesService({ name });
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.data);
        }
        return errorResponse(res, response.status, response.message);
    } catch (error) {
        return errorResponse(res, 500, "Controller error", error);
    }
};

const getEntryById = async (req, res) => {
    try {
        const { name, id } = req.params;
        const response = await getEntryByIdService({ name, id });
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.data);
        }
        return errorResponse(res, response.status, response.message);
    } catch (error) {
        return errorResponse(res, 500, "Controller error", error);
    }
};

const updateEntry = async (req, res) => {
    try {
        const { name, id } = req.params;
        const response = await updateAdminEntryService({ name, id, data: req.body, file: req.file, adminId: req.user?._id });
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.data);
        }
        return errorResponse(res, response.status, response.message);
    } catch (error) {
        return errorResponse(res, 500, "Controller error", error);
    }
};

const deleteEntry = async (req, res) => {
    try {
        const { name, id } = req.params;
        const response = await deleteAdminEntryService({ name, id });
        if (response.status === 200) {
            return successResponse(res, response.status, response.message);
        }
        return errorResponse(res, response.status, response.message);
    } catch (error) {
        return errorResponse(res, 500, "Controller error", error);
    }
};

export { getEntries, createEntry, getEntryById, updateEntry, deleteEntry, getAdminConfigs };