import prompts from 'prompts';
import { register, login } from '../services/authService.js';

// Returns the logged-in user object, or null if the user chose Exit.
export async function authMenu() {
  while (true) {
    console.log('\nWelcome to Todo App\n');
    console.log('1. Register');
    console.log('2. Login');
    console.log('3. Exit\n');

    const { choice } = await prompts({
      type: 'text',
      name: 'choice',
      message: 'Enter your choice:'
    });

    if (choice === '1') {
      const result = await handleRegister();
      console.log('\n' + result.message);
    } else if (choice === '2') {
      const result = await handleLogin();
      console.log('\n' + result.message);
      if (result.success) {
        return result.user;
      }
    } else if (choice === '3') {
      return null;
    } else {
      console.log('\nInvalid choice.');
    }
  }
}

async function handleRegister() {
  const answers = await prompts([
    { type: 'text', name: 'name', message: 'Enter your name:' },
    { type: 'text', name: 'email', message: 'Enter your email:' },
    { type: 'password', name: 'password', message: 'Enter your password:' }
  ]);
  return register(answers.name, answers.email, answers.password);
}

async function handleLogin() {
  const answers = await prompts([
    { type: 'text', name: 'email', message: 'Enter your email:' },
    { type: 'password', name: 'password', message: 'Enter your password:' }
  ]);
  return login(answers.email, answers.password);
}
