import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../repositories/userRepository.js';
import { isEmpty, isValidEmail, isValidPassword } from '../utils/validators.js';

const SALT_ROUNDS = 10;

// Same message for both failure cases on purpose — never reveal
// whether the email exists or the password was wrong.
const LOGIN_FAIL_MSG = 'Invalid email or password.';

export async function register(name, email, password) {
  if (isEmpty(name)) {
    return { success: false, message: 'Name cannot be empty.' };
  }
  if (!isValidEmail(email)) {
    return { success: false, message: 'Invalid email format.' };
  }
  if (!isValidPassword(password)) {
    return { success: false, message: 'Password must be at least 4 characters.' };
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return { success: false, message: 'Email already exists.' };
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const id = await createUser(name, email, hashed);

  return { success: true, message: 'Registration successful!', userId: id };
}

export async function login(email, password) {
  const user = await findUserByEmail(email);
  
   console.log('DEBUG user found:', user);
  console.log('DEBUG password typed:', password, '| length:', password.length);
  if (!user) {
    return { success: false, message: LOGIN_FAIL_MSG };
  }

  const match = await bcrypt.compare(password, user.password);
  console.log('DEBUG bcrypt match result:', match);
  if (!match) {
    return { success: false, message: LOGIN_FAIL_MSG };
  }

  return {
    success: true,
    message: 'Login successful!',
    user: { id: user.id, name: user.name, email: user.email }
  };
}
