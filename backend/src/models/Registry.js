import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    label: {
      type: String
    },

    value: {
      type: mongoose.Schema.Types.Mixed
    }
  },

  {
    _id: false
  }
);

const searchSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: false
    }
  },
  {
    _id: false
  }
);



const filterSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    }
  },
  {
    _id: false
  }
);


const fieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    label: {
      type: String,
      required: true
    },

    type: {
      type: String,
      required: true
    },

    required: {
      type: Boolean,
      default: false
    },

    readonly: {
      type: Boolean,
      default: false
    },

    min: Number,
    max: Number,
    minLength: Number,
    maxLength: Number,
    pattern: String,

    placeholder: {
      type: String
    },

    options: [optionSchema],

    ref: {
      type: String
    },

    refConfig: {
      labelField: String,
      valueField: String,
      filters: mongoose.Schema.Types.Mixed
    },

    formatter: mongoose.Schema.Types.Mixed,

    visibleInTable: {
      type: Boolean,
      default: false
    },

    visibleInAdd: {
      type: Boolean,
      default: false
    },

    visibleInEdit: {
      type: Boolean,
      default: false
    },

    visibleInView: {
      type: Boolean,
      default: false
    },

    search: {
      type: searchSchema,
      default: () => ({})
    },

    filter: {
      type: filterSchema,
      default: () => ({})
    },
  },

  {
    _id: false
  }
);




const registrySchema = new mongoose.Schema(
  {
    modelName: {
      type: String,
      required: true,
      unique: true
    },

    route: {
      type: String,
      required: true
    },

    apiEndpoint: {
      type: String,
      required: true
    },

    sidebarLabel: {
      type: String,
      required: true
    },
    
    icon: {
      type: String,
      default: "faBox"
    },

    showInSidebar: {
      type: Boolean,
      default: true
    },



    // =========================
    // ACTIONS
    // =========================

    actions: {

      create: {
        type: Boolean,
        default: false
      },

      edit: {
        type: Boolean,
        default: false
      },

      delete: {
        type: Boolean,
        default: false
      },

      view: {
        type: Boolean,
        default: false
      }
    },



    fields: [fieldSchema]
  },

  {
    timestamps: true
  }
);



export const Registry = mongoose.model(
  "Registry",
  registrySchema
);