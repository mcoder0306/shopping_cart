import mongoose from "mongoose";

const pluralize = (str) => {
    if (str.endsWith('y')) return str.slice(0, -1) + 'ies';
    if (str.endsWith('s')) return str;
    return str + 's';
};

const getDynamicAdminConfig = async () => {
    const models = mongoose.modelNames();
    const configs = [];

    const excludedModels = ["AdminConfig", "Order", "Favourite"];

    for (const modelName of models) {
        if (excludedModels.includes(modelName)) continue;

        const Model = mongoose.model(modelName);
        const schema = Model.schema;
        const fields = [];

        for (const [path, details] of Object.entries(schema.paths)) {
            if (path === "__v" || path === "_id" || path === "updatedAt" || path === "refreshToken") {
                continue;
            }

            let type = "text";
            let ref = details.options?.ref;
            let options = null;

            if (details.instance === "String") {
                if (path.toLowerCase().includes("image")) type = "file";
                else if (path.toLowerCase().includes("password")) type = "password";
                else if (path.toLowerCase().includes("email")) type = "email";
                else if (path.toLowerCase().includes("description")) type = "textarea";
                else type = "text";
            } else if (details.instance === "Number") {
                type = "number";
            } else if (details.instance === "Boolean") {
                type = "select";
                options = [
                    { label: "Active", value: true },
                    { label: "Inactive", value: false }
                ];
                if (path === "isAdmin") {
                    options = [
                        { label: "Admin", value: true },
                        { label: "User", value: false }
                    ];
                }
            } else if (details.instance === "ObjectID" || ref) {
                type = "select";
            }

            let label = path.charAt(0).toUpperCase() + path.slice(1).replace(/([A-Z])/g, ' $1');
            if (path === "createdAt") label = "Date";

            // Special labels for Orders (Cart model) to match dashboard
            if (modelName === "Cart") {
                if (path === "user") label = "Customer";
                if (path === "orderId") label = "Order ID";
                if (path === "orderStatus") label = "Status";
                if (path === "paymentMethod") label = "Payment";
            }

            fields.push({
                name: path,
                label,
                type,
                required: details.options?.required ? true : false,
                ref,
                options,
                showInTable: ["title", "name", "email", "image", "price", "stock", "category", "isActive", "orderId", "user", "orderStatus", "total", "createdAt", "paymentMethod"].includes(path),
                showInCreate: !["isActive", "isAdmin", "orderStatus", "orderId", "addresses", "refreshToken", "createdAt"].includes(path),
                showInEdit: !["password", "isActive", "isAdmin", "orderStatus", "orderId", "addresses", "refreshToken", "createdAt"].includes(path),
            });
        }

        let label = modelName;
        let icon = "faBox";
        let readonly = false;
        let hideAdd = false;

        if (modelName === "Product") {
            label = "Products";
            icon = "faBox";
        } else if (modelName === "Category") {
            label = "Categories";
            icon = "faTags";
        } else if (modelName === "User") {
            label = "Users";
            icon = "faUsers";
            hideAdd = true;
        } else if (modelName === "Cart") {
            label = "Orders";
            icon = "faBagShopping";
            readonly = true;
            hideAdd = true;
        } else if (modelName === "Blog") {
            label = "Blogs";
            icon = "faTags";
        }

        // Specific field ordering for Orders (Cart model) to match dashboard
        if (modelName === "Cart") {
            const orderOrder = ["orderId", "user", "createdAt", "orderStatus", "paymentMethod", "total"];
            fields.sort((a, b) => {
                const indexA = orderOrder.indexOf(a.name);
                const indexB = orderOrder.indexOf(b.name);
                if (indexA === -1 && indexB === -1) return 0;
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            });
        }

        configs.push({
            name: modelName === "Cart" ? "orders" : pluralize(modelName.toLowerCase()),
            modelName,
            label,
            icon,
            readonly,
            hideAdd,
            fields
        });
    }

    return configs;
};

export { getDynamicAdminConfig };
