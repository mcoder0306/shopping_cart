import mongoose from "mongoose";
import { errorResponse, successResponse } from "../utils/response.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// Map module names to Model names
const modelMap = {
    "users": "User",
    "products": "Product",
    "categories": "Category",
    "orders": "Order",
    "blogs": "Blog" // If it exists
};

const getModel = (moduleName) => {
    const modelName = modelMap[moduleName];
    if (!modelName) return null;
    return mongoose.model(modelName);
};

const getAll = async (req, res) => {
    try {
        const { module } = req.params;
        const Model = getModel(module);

        if (!Model) {
            return errorResponse(res, 404, "Module not found");
        }

        const data = await Model.find().sort({ createdAt: -1 });
        return successResponse(res, 200, `${module} fetched successfully`, data);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

const getById = async (req, res) => {
    try {
        const { module, id } = req.params;
        const Model = getModel(module);

        if (!Model) {
            return errorResponse(res, 404, "Module not found");
        }

        const data = await Model.findById(id);
        if (!data) {
            return errorResponse(res, 404, "Record not found");
        }

        return successResponse(res, 200, `${module} record fetched successfully`, data);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

const create = async (req, res) => {
    try {
        const { module } = req.params;
        const Model = getModel(module);

        if (!Model) {
            return errorResponse(res, 404, "Module not found");
        }

        let body = { ...req.body };

        if (req.file) {
            const uploadRes = await uploadToCloudinary(req.file.path, "crud");
            body.image = uploadRes.secure_url;
        }

        const newData = await Model.create(body);
        return successResponse(res, 201, `${module} created successfully`, newData);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

const update = async (req, res) => {
    try {
        const { module, id } = req.params;
        const Model = getModel(module);

        if (!Model) {
            return errorResponse(res, 404, "Module not found");
        }

        let body = { ...req.body };

        if (req.file) {
            const uploadRes = await uploadToCloudinary(req.file.path, "crud");
            body.image = uploadRes.secure_url;
        }

        const updatedData = await Model.findByIdAndUpdate(id, body, { new: true });
        if (!updatedData) {
            return errorResponse(res, 404, "Record not found");
        }

        return successResponse(res, 200, `${module} updated successfully`, updatedData);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

const remove = async (req, res) => {
    try {
        const { module, id } = req.params;
        const Model = getModel(module);

        if (!Model) {
            return errorResponse(res, 404, "Module not found");
        }

        const deletedData = await Model.findByIdAndDelete(id);
        if (!deletedData) {
            return errorResponse(res, 404, "Record not found");
        }

        return successResponse(res, 200, `${module} deleted successfully`, deletedData);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

export { getAll, getById, create, update, remove };
