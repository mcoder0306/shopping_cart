import mongoose from "mongoose";
import { deleteImage } from "../utils/deleteImage.js";
import { getDynamicAdminConfig } from "./adminConfig.service.js";

const getModel = (name) => {
    const modelNames = mongoose.modelNames();

    if (name === "orders") {
        const found = modelNames.find(m => m.toLowerCase() === "cart");
        if (found) return mongoose.model(found);
    }

    const normalized = name.toLowerCase();

    const found = modelNames.find(m => {
        const ml = m.toLowerCase();
        return ml === normalized ||
            ml === normalized.slice(0, -1) ||
            normalized === ml + 's' ||
            (normalized.endsWith('ies') && normalized.slice(0, -3) + 'y' === ml);
    });

    return found ? mongoose.model(found) : null;
};

const getAdminConfigsService = async () => {
    const configs = await getDynamicAdminConfig();
    return {
        status: 200,
        message: "Configs fetched successfully",
        data: configs
    };
};

const createAdminEntryService = async ({ name, data, file }) => {
    const configs = await getDynamicAdminConfig();
    const config = configs.find(c => c.name === name);
    if (!config) return { status: 404, message: "invalid config!!" }

    const Model = getModel(name);
    if (!Model) return { status: 404, message: "Model not found" };

    // validation
    for (let field of config.fields) {
        if (field.required && !data[field.name] && field.type !== 'file') {
            return { status: 400, message: `${field.label} is required` }
        }
    }

    const body = { ...data };
    if (file) {
        body.image = file.path;
    }

    for (let field of config.fields) {
        if (field.ref && body[field.name]) {
            if (mongoose.Types.ObjectId.isValid(body[field.name])) {
                body[field.name] = new mongoose.Types.ObjectId(body[field.name]);
            }
        }
    }

    const result = await Model.create(body);

    if (!result) {
        return { status: 500, message: "error in creating entry" }
    }

    return {
        status: 201,
        message: `${name} created successfully`,
        data: result
    };
}

const getEntriesService = async ({ name }) => {
    const Model = getModel(name);

    if (!Model) {
        return { status: 404, message: "Model not found" };
    }

    let query = Model.find();

    // Auto-populate based on schema refs
    const paths = Model.schema.paths;
    Object.keys(paths).forEach(path => {
        if (paths[path].options && paths[path].options.ref) {
            query = query.populate(path);
        }
    });

    const data = await query.sort({ createdAt: -1 });
    return {
        status: 200,
        message: `${name} fetched successfully`,
        data
    };
};

const getEntryByIdService = async ({ name, id }) => {
    const Model = getModel(name);

    if (!Model) {
        return { status: 404, message: "Model not found" };
    }

    let query = Model.findById(id);

    // Auto-populate based on schema refs
    const paths = Model.schema.paths;
    Object.keys(paths).forEach(path => {
        if (paths[path].options && paths[path].options.ref) {
            query = query.populate(path);
        }
    });

    const data = await query;

    if (!data) {
        return { status: 404, message: "Data not found" };
    }

    return {
        status: 200,
        message: "Fetched successfully",
        data
    };

};

const updateAdminEntryService = async ({ name, id, data, file, adminId }) => {
    const configs = await getDynamicAdminConfig();
    const config = configs.find(c => c.name === name);
    if (!config) return { status: 404, message: "invalid config!!" }

    const Model = getModel(name);
    if (!Model) return { status: 404, message: "Model not found" };

    // Self-deactivation guard for Users
    if (name === 'users' && String(id) === String(adminId)) {
        if (data.isActive === false || data.isActive === 'false') {
            return { status: 400, message: "Admin cannot deactivate themselves" };
        }
    }

    // validation (only for fields present in data to allow partial updates like status toggles)
    for (let field of config.fields) {
        if (field.name in data && field.required && field.showInEdit !== false && !data[field.name] && field.type !== 'file') {
            return { status: 400, message: `${field.label} is required` }
        }
    }

    const body = { ...data };
    if (file) {
        const oldRecord = await Model.findById(id);
        if (oldRecord?.image) {
            await deleteImage(oldRecord.image);
        }
        body.image = file.path;
    }

    // Convert stringified IDs to ObjectIds if necessary
    for (let field of config.fields) {
        if (field.ref && body[field.name]) {
            if (mongoose.Types.ObjectId.isValid(body[field.name])) {
                body[field.name] = new mongoose.Types.ObjectId(body[field.name]);
            }
        }
    }

    const result = await Model.findByIdAndUpdate(id, body, { new: true });

    if (!result) {
        return { status: 404, message: "Entry not found" }
    }

    return {
        status: 200,
        message: `${name} updated successfully`,
        data: result
    };
}

const deleteAdminEntryService = async ({ name, id }) => {
    const Model = getModel(name);
    if (!Model) return { status: 404, message: "Model not found" };

    const entry = await Model.findById(id);
    if (entry?.image) {
        await deleteImage(entry.image);
    }
    const result = await Model.findByIdAndDelete(id);

    if (!result) {
        return { status: 404, message: "Entry not found" }
    }

    return {
        status: 200,
        message: `${name} deleted successfully`
    };
}

export {
    createAdminEntryService,
    getEntriesService,
    getEntryByIdService,
    updateAdminEntryService,
    deleteAdminEntryService,
    getAdminConfigsService
}