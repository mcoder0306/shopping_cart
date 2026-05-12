import modules from "../config/modules.js";
import { Registry } from "../models/Registry.js";

export const syncRegistry = async () => {
    console.log("Registry sync started");

    const currentModuleNames = modules.map(m => m.modelName);
    await Registry.deleteMany({ modelName: { $nin: currentModuleNames } });

    for (const module of modules) {
        await Registry.findOneAndUpdate(
            { modelName: module.modelName },
            module,
            { upsert: true, returnDocument: "after" }
        );
    }

    console.log("Registry synced successfully");
    return true;
};