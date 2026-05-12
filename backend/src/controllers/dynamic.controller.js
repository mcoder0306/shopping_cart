import { modelMap } from "../config/modelMap.js";
import modules from "../config/modules.js";

// GET LIST
export const getAllData = async (req, res) => {
    try {
        const { modelName } = req.params;
        const Model = modelMap[modelName];
        if (!Model) {
            return res.status(400).json({
                success: false,
                message: "Invalid model"
            });
        }

        // Find module config to identify reference fields
        const moduleConfig = modules.find(m => m.modelName === modelName);
        let query = Model.find();

        if (moduleConfig && moduleConfig.fields) {
            moduleConfig.fields.forEach(field => {
                if (field.ref) {
                    query = query.populate(field.name);
                }
            });
        }

        const data = await query.exec();
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET SINGLE
export const getSingleData = async (req, res) => {
    try {
        const { modelName, id } = req.params;
        const Model = modelMap[modelName];
        const data = await Model.findById(id);
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// CREATE
export const createData = async (req, res) => {
    try {
        const { modelName } = req.params;
        const Model = modelMap[modelName];
        const data = await Model.create(req.body);
        return res.status(201).json({
            success: true,
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE
export const updateData = async (req, res) => {
    try {
        const { modelName, id } = req.params;
        const Model = modelMap[modelName];
        const data = await Model.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true
            }
        );
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE
export const deleteData = async (req, res) => {
    try {
        const { modelName, id } = req.params;
        const Model = modelMap[modelName];
        await Model.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};