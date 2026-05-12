import { Registry } from "../models/Registry.js";
import { syncRegistry } from "../services/registry.service.js";

export const syncRegistryController = async (req, res) => {
    try {
        await syncRegistry();
        return res.status(200).json({
            success: true,
            message: "Registry synced successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// SIDEBAR MODULES
export const getSidebarModules = async (req, res) => {
    try {
        const modules = await Registry.find({
            showInSidebar: true
        });
        return res.status(200).json({
            success: true,
            data: modules
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// SINGLE MODULE CONFIG
export const getModuleConfig = async (req, res) => {
    try {
        const { modelName } = req.params;
        const module = await Registry.findOne({
            modelName
        });
        return res.status(200).json({
            success: true,
            data: module
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};