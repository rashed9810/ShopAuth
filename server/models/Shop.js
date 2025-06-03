const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Shop name is required"],
      trim: true,
      lowercase: true,
      minlength: [2, "Shop name must be at least 2 characters long"],
      maxlength: [50, "Shop name cannot exceed 50 characters"],
      match: [
        /^[a-zA-Z0-9\s-_]+$/,
        "Shop name can only contain letters, numbers, spaces, hyphens, and underscores",
      ],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
shopSchema.index({ name: 1 }, { unique: true });
shopSchema.index({ owner: 1 });

// Static method to check if shop name exists
shopSchema.statics.isNameTaken = async function (name) {
  const shop = await this.findOne({ name: name.toLowerCase().trim() });
  return !!shop;
};

// Static method to get shops by owner
shopSchema.statics.getShopsByOwner = async function (ownerId) {
  return await this.find({ owner: ownerId, isActive: true }).select(
    "name description createdAt"
  );
};

module.exports = mongoose.model("Shop", shopSchema);
