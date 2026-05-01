import { getDynamicAdminConfig } from "../services/adminConfig.service.js";

const getAdminConfig = async (req, res) => {
    try {
        const { name } = req.params;
        const configs = await getDynamicAdminConfig();
        const config = configs.find(c => c.name === name);

        if (!config) {
            return res.status(404).json({ message: "Config not found" });
        }

        res.json(config);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllAdminConfigs = async (req, res) => {
    try {
        const configs = await getDynamicAdminConfig();
        return res.json(configs);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export { getAdminConfig, getAllAdminConfigs }