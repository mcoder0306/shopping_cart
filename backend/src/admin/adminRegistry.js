import { Product } from "../models/Product.model.js";
import { Category } from "../models/Category.model.js";
import { User } from "../models/User.model.js";
import { Cart } from "../models/Cart.model.js";

export const adminRegistry = [

    // PRODUCTS
    {
        module: "products",
        model: Product,
        label: "Products",
        icon: "faChartLine",
        sidebar: true,

        operations: {
            create: true,
            edit: true,
            delete: true,
            view: false
        },

        table: {
            columns: [
                "title",
                "price",
                "stock"
            ]
        },

        fieldOverrides: {
            description: {
                type: "textarea"
            },
            image: {
                type: "file"
            },
            category: {
                type: "select",
                relation: {
                    model: "Category",
                    labelField: "title",
                    valueField: "_id"
                }
            }
        }
    },



    // CATEGORIES
    {
        module: "categories",
        model: Category,
        label: "Categories",
        icon: "faTags",
        sidebar: true,

        operations: {
            create: true,
            edit: true,
            delete: true,
            view: false
        },

        table: {
            columns: [
                "title",
                "isActive"
            ]
        },

        fieldOverrides: {}
    },



    // USERS
    {
        module: "users",
        model: User,
        label: "Users",
        icon: "faUsers",
        sidebar: true,

        operations: {
            create: false,
            edit: true,
            delete: true,
            view: true
        },

        table: {
            columns: [
                "name",
                "email",
                "phone"
            ]
        },

        fieldOverrides: {
            password: {
                visible: {
                    table: false,
                    create: false,
                    edit: false,
                    view: false
                }
            },

            image: {
                type: "file"
            }
        }
    },



    // ORDERS
    {
        module: "orders",
        model: Cart,
        label: "Orders",
        icon: "faBagShopping",
        sidebar: true,

        operations: {
            create: false,
            edit: false,
            delete: false,
            view: true
        },

        table: {
            columns: [
                "orderId",
                "total",
                "paymentStatus",
                "orderStatus"
            ]
        },

        fieldOverrides: {
            paymentStatus: {
                type: "select",
                options: [
                    "pending",
                    "completed"
                ]
            },

            paymentMethod: {
                type: "select",
                options: [
                    "upi",
                    "card",
                    "cod"
                ]
            }
        }
    }
];