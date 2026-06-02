const mongoose = require('mongoose');
const { ORDER_STATUSES } = require('../utils/constants');
const crypto = require('crypto');

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: [true, 'Menu item reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
    },
    price: {
      type: Number,
      required: [true, 'Item price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      max: [50, 'Quantity cannot exceed 50'],
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(ORDER_STATUSES),
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    address: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true,
      minlength: [5, 'Address must be at least 5 characters'],
      maxlength: [300, 'Address cannot exceed 300 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: function (v) {
          // Accepts formats: +1234567890, 1234567890, 123-456-7890, (123) 456-7890
          return /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/.test(v);
        },
        message: 'Please provide a valid phone number',
      },
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order must contain at least one item'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'Order must contain at least one item',
      },
    },
    customer: {
      type: customerSchema,
      required: [true, 'Customer information is required'],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(ORDER_STATUSES),
        message: '{VALUE} is not a valid order status',
      },
      default: ORDER_STATUSES.ORDER_RECEIVED,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
    estimatedDelivery: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate unique order number before saving
orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    this.orderNumber = `ORD-${randomHex}`;

    // Add initial status to history
    this.statusHistory.push({
      status: ORDER_STATUSES.ORDER_RECEIVED,
      timestamp: new Date(),
    });

    // Set estimated delivery (90 minutes from now)
    this.estimatedDelivery = new Date(Date.now() + 90 * 60 * 1000);
  }
  next();
});

// Indexes for efficient queries
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'customer.phone': 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
