export const generateFields = (
    schema,
    overrides = {}
) => {

    const fields = [];

    Object.entries(schema.paths).forEach(
        ([key, value]) => {

            // SKIP DEFAULT FIELDS
            if (
                key === "_id" ||
                key === "__v" ||
                key === "createdAt" ||
                key === "updatedAt"
            ) return;



            // DEFAULT INPUT TYPE
            let type = "text";



            // STRING
            if (value.instance === "String") {
                type = "text";
            }



            // NUMBER
            if (value.instance === "Number") {
                type = "number";
            }



            // BOOLEAN
            if (value.instance === "Boolean") {
                type = "checkbox";
            }



            // OBJECT ID
            if (value.instance === "ObjectId") {
                type = "select";
            }



            // ARRAY
            if (value.instance === "Array") {
                type = "array";
            }



            // FIELD OBJECT
            const field = {

                name: key,

                label:
                    key.charAt(0).toUpperCase() +
                    key.slice(1),

                type,

                required:
                    value.options?.required || false,

                constraints: {},

                visible: {

                    table: true,

                    create: true,

                    edit: true,

                    view: true
                }
            };



            // AUTO CONSTRAINTS
            if (value.options?.min) {
                field.constraints.min =
                    value.options.min;
            }

            if (value.options?.max) {
                field.constraints.max =
                    value.options.max;
            }

            if (value.options?.minlength) {
                field.constraints.minLength =
                    value.options.minlength;
            }

            if (value.options?.maxlength) {
                field.constraints.maxLength =
                    value.options.maxlength;
            }

            if (value.options?.enum) {
                field.options =
                    value.options.enum;
            }



            // APPLY OVERRIDES
            if (overrides[key]) {

                Object.assign(
                    field,
                    overrides[key]
                );
            }

            fields.push(field);
        }
    );

    return fields;
};