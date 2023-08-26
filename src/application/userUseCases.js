const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userUseCases = { };

userUseCases.registerUser = async (userData, userRepository) => {
  const existingUser = await userRepository.findByUsername(userData.username);
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = { username: userData.username, password: hashedPassword };

  return await userRepository.create(newUser);
};

userUseCases.loginUser = async (loginData, userRepository) => {
  const jwtSecret = process.env.JWT_SECRET_KEY
  const user = await userRepository.findByUsername(loginData.username);
  if (!user) throw new Error('User not found');

  const isValidPassword = await bcrypt.compare(loginData.password, user.password);
  if (!isValidPassword) throw new Error('Invalid password');

  const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' });

  return { token, userId: user.id };
};

module.exports = userUseCases;