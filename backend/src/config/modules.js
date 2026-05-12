const modules = [

    // DASHBOARD

    {
        modelName: "Dashboard",
        route: "/dashboard",
        sidebarLabel: "Dashboard",
        icon: "faChartLine",
        showInSidebar: true,
        apiEndpoint: "/api/dashboard",
        actions: {
            create: false,
            edit: false,
            delete: false,
            view: true
        },

        fields: []
    },

    // PRODUCTS

    {
        modelName: "Product",
        route: "/products",
        sidebarLabel: "Products",
        icon: "faBox",
        showInSidebar: true,
        apiEndpoint: "/api/products",
        actions: {
            create: true,
            edit: true,
            delete: true,
            view: false
        },

        fields: [

            {
                name: "title",
                label: "Title",
                type: "text",
                required: true,
                minLength: 3,
                maxLength: 100,
                placeholder: "Enter product Title",
                visibleInTable: true,
                visibleInAdd: true,
                visibleInEdit: true,
                search: {
                    enabled: true
                }
            },

            {
                name: "description",
                label: "Description",
                placeholder: "Enter product Description",
                type: "textarea",
                required: true,
                minLength: 10,
                visibleInAdd: true,
                visibleInEdit: true
            },

            {
                name: "image",
                label: "Image",
                type: "file",
                required: true,
                visibleInTable: true,
                visibleInAdd: true,
                visibleInEdit: true
            },

            {
                name: "price",
                label: "Price",
                type: "number",
                required: true,
                min: 0,
                placeholder: "Enter product price",
                visibleInTable: true,
                visibleInAdd: true,
                visibleInEdit: true
            },

            {
                name: "stock",
                label: "Stock",
                type: "number",
                required: true,
                min: 0,
                placeholder: "Enter stock quantity",
                visibleInTable: true,
                visibleInAdd: true,
                visibleInEdit: true
            },

            {
                name: "category",
                label: "Category",
                type: "select",
                ref: "Category",
                required: true,
                visibleInTable: true,
                visibleInAdd: true,
                visibleInEdit: true,
                filter: {
                    enabled: true,
                    type: "relation"
                },
                refConfig: {
                    labelField: "title",
                    valueField: "_id",
                    filters: {
                        isActive: true
                    }
                }
            },

            {
                name: "isActive",
                label: "Status",
                type: "select",
                required: true,
                options: [
                    {
                        label: "Active",
                        value: true
                    },
                    {
                        label: "Inactive",
                        value: false
                    }
                ],
                visibleInTable: true,
                visibleInAdd: false,
                visibleInEdit: false,
                filter: {
                    enabled: true,
                    type: "select"
                }
            },

            {
                name: "createdAt",
                label: "Date",
                type: "date",
                visibleInTable: true
            }
        ]
    },

    // CATEGORY
    {
        modelName: "Category",
        route: "/categories",
        sidebarLabel: "Categories",
        icon: "faTags",
        showInSidebar: true,
        apiEndpoint: "/api/categories",
        actions: {
            create: true,
            edit: true,
            delete: true,
            view: false
        },
        fields: [
            {
                name: "title",
                label: "Title",
                type: "text",
                required: true,
                minLength: 2,
                maxLength: 100,
                placeholder: "Enter category title",
                visibleInTable: true,
                visibleInAdd: true,
                visibleInEdit: true,
                search: {
                    enabled: true
                }
            },
            // {
            //     name: "name",
            //     label: "Name",
            //     type: "textarea",
            //     required: true,
            //     minLength: 2,
            //     maxLength: 100,
            //     placeholder: "Enter category name",
            //     visibleInAdd: true,
            //     visibleInEdit: true,
            // },

            {
                name: "isActive",
                label: "Status",
                type: "select",
                required: true,
                options: [
                    {
                        label: "Active",
                        value: true
                    },
                    {
                        label: "Inactive",
                        value: false
                    }
                ],
                visibleInTable: true,
                visibleInAdd: false,
                visibleInEdit: false,
                filter: {
                    enabled: true,
                    type: "select"
                }
            },

            {
                name: "createdAt",
                label: "Date",
                type: "date",
                visibleInTable: true
            }
        ]
    },

    // USERS

    {
        modelName: "User",
        route: "/users",
        sidebarLabel: "Users",
        icon: "faUsers",
        showInSidebar: true,
        apiEndpoint: "/api/users",
        actions: {
            create: false,
            edit: true,
            delete: true,
            view: true
        },
        fields: [
            {
                name: "name",
                label: "Name",
                type: "text",
                required: true,
                minLength: 2,
                maxLength: 100,
                placeholder: "Enter user name",
                visibleInTable: true,
                visibleInEdit: true,
                visibleInView: true,
                search: {
                    enabled: true
                }
            },

            {
                name: "email",
                label: "Email",
                type: "email",
                required: true,
                readonly: true,
                placeholder: "Enter email",
                visibleInTable: true,
                visibleInView: true,
                visibleInEdit: true,
            },

            {
                name: "phone",
                label: "Phone",
                type: "text",
                minLength: 10,
                maxLength: 10,
                placeholder: "Enter phone number",
                visibleInEdit: true,
                visibleInView: true
            },

            {
                name: "image",
                label: "Image",
                type: "file",
                visibleInTable: true,
                visibleInEdit: true,
                visibleInView: true
            },

            {
                name: "isActive",
                label: "Status",
                type: "select",
                required: true,
                options: [
                    {
                        label: "Active",
                        value: true
                    },
                    {
                        label: "Inactive",
                        value: false
                    }
                ],
                visibleInTable: true,
                visibleInEdit: false,
                visibleInView: true,
                filter: {
                    enabled: true,
                    type: "select"
                }
            },

            {
                name: "isAdmin",
                label: "Role",
                type: "badge",
                visibleInView: true,
                formatter: {
                    trueLabel: "Admin",
                    falseLabel: "Customer"
                }
            },

            {
                name: "createdAt",
                label: "Date",
                type: "date",
                visibleInTable: true,
                visibleInView: true
            }
        ]
    },

    // ORDERS

    {
        modelName: "Cart",
        route: "/orders",
        sidebarLabel: "Orders",
        icon: "faBagShopping",
        showInSidebar: true,
        apiEndpoint: "/api/orders",
        actions: {
            create: false,
            edit: false,
            delete: false,
            view: true
        },

        fields: [

            {
                name: "orderId",
                label: "Order ID",
                type: "text",
                visibleInTable: true,
                visibleInView: true
            },

            {
                name: "user",
                label: "User",
                type: "select",
                ref: "User",
                refConfig: {
                    labelField: "name",
                    valueField: "_id",
                    filters: {
                        isActive: true
                    }
                },
                visibleInTable: true,
                visibleInView: true,
                search: {
                    enabled: true
                }
            },

            {
                name: "total",
                label: "Total Amount",
                type: "number",
                visibleInTable: true,
                visibleInView: true,
                formatter: {
                    prefix: "$"
                }
            },

            {
                name: "paymentMethod",
                label: "Payment Method",
                type: "select",
                required: true,
                options: [
                    {
                        label: "UPI",
                        value: "upi"
                    },
                    {
                        label: "Card",
                        value: "card"
                    },
                    {
                        label: "COD",
                        value: "cod"
                    }
                ],
                visibleInTable: true,
                visibleInView: true,
                filter: {
                    enabled: true,
                    type: "select"
                }
            },

            {
                name: "paymentStatus",
                label: "Payment Status",
                type: "badge",
                options: [
                    {
                        label: "Pending",
                        value: "pending"
                    },
                    {
                        label: "Cancelled",
                        value: "cancelled"
                    },
                    {
                        label: "Failed",
                        value: "failed"
                    },
                    {
                        label: "Completed",
                        value: "completed"
                    }
                ],
                visibleInTable: false,
                visibleInView: true,
                filter: {
                    enabled: true,
                    type: "select"
                }
            },

            {
                name: "orderStatus",
                label: "Order Status",
                type: "badge",
                options: [
                    {
                        label: "Draft",
                        value: "draft"
                    },
                    {
                        label: "Completed",
                        value: "completed"
                    }
                ],
                visibleInTable: true,
                visibleInView: true,
                filter: {
                    enabled: true,
                    type: "select"
                }
            },

            {
                name: "createdAt",
                label: "Date",
                type: "date",
                visibleInTable: true,
                visibleInView: true
            }
        ]
    },
      // CUSTOMER
    {
        modelName: "Customer",
        route: "/customers",
        sidebarLabel: "Customers",
        icon: "faUsers",
        showInSidebar: true,
        apiEndpoint: "/api/customers",
        actions: {
            create: true,
            edit: true,
            delete: true,
            view: true
        },
        fields: [
            {
                name: "title",
                label: "Title",
                type: "text",
                required: true,
                minLength: 2,
                maxLength: 100,
                placeholder: "Enter customer title",
                visibleInTable: true,
                visibleInAdd: true,
                visibleInEdit: true,
                search: {
                    enabled: true
                }
            },
            {
                name: "name",
                label: "Name",
                type: "textarea",
                required: true,
                minLength: 2,
                maxLength: 100,
                placeholder: "Enter customer name",
                visibleInAdd: true,
                visibleInEdit: true,
            },

            {
                name: "isActive",
                label: "Status",
                type: "select",
                required: true,
                options: [
                    {
                        label: "Active",
                        value: true
                    },
                    {
                        label: "Inactive",
                        value: false
                    }
                ],
                visibleInTable: true,
                visibleInAdd: false,
                visibleInEdit: false,
                filter: {
                    enabled: true,
                    type: "select"
                }
            },

            {
                name: "createdAt",
                label: "Date",
                type: "date",
                visibleInTable: true
            }
        ]
    },

];

export default modules;