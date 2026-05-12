import { AdminConfig } from "../models/adminConfig.model.js";
import { adminRegistry } from "./adminRegistry.js";
import { generateFields } from "./generateFields.js";


export const syncAdminConfigs = async () => {

    for (const item of adminRegistry) {

        // GENERATE FIELDS
        const fields = generateFields(
            item.model.schema,
            item.fieldOverrides
        );



        // FINAL CONFIG OBJECT
        const payload = {

            module: item.module,

            label: item.label,

            icon: item.icon,

            sidebar: item.sidebar,

            operations: item.operations,

            table: item.table,

            fields
        };



        // CHECK EXISTING
        const existing =
            await AdminConfig.findOne({

                module: item.module
            });



        // CREATE
        if (!existing) {

            await AdminConfig.create(
                payload
            );

            console.log(
                `${item.module} created`
            );
        }



        // UPDATE
        else {

            await AdminConfig.findOneAndUpdate(

                {
                    module: item.module
                },

                payload,

                {
                    new: true
                }
            );

            console.log(
                `${item.module} updated`
            );
        }
    }
};