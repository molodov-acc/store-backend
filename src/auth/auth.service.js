const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../errors/AppError");
const storage = require("./auth.storage");

exports.register = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Email and password required", 400);
  }

  const existingUser = storage.findByEmail(email);
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
  };

  storage.create(user);

  return generateToken(user);
};

exports.login = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Email and password required", 400);
  }

  const user = storage.findByEmail(email);
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  return generateToken(user);
};

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}
