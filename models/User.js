const crypto = require("crypto")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const salaryPaymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Salary amount is required.']
  },
  month: {
    type: String,
    required: [true, 'Salary month is required.']
  },
  year: {
    type: Number,
    required: [true, 'Salary year is required.']
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paidBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    role: {
      type: String,
      enum: ["manager", "team_lead", "executive"],
      default: "executive",
    },
    refId: {
      type: String,
      required: [true, "Reference ID is required for signup"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password
        },
        message: "Passwords are not the same!",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    baseSalary: {
      type: Number,
      default: 0
    },
    salaryHistory: [salaryPaymentSchema]
  },
  {
    timestamps: true,
  },
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next()

  this.passwordChangedAt = Date.now() - 1000
  next()
})

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } })
  next()
})

userSchema.methods.correctPassword = async (candidatePassword, userPassword) =>
  await bcrypt.compare(candidatePassword, userPassword)

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Number.parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return JWTTimestamp < changedTimestamp
  }
  return false
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex")

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

const User = mongoose.model("User", userSchema)

module.exports = User
