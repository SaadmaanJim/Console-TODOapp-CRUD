import { authMenu } from './cli/authMenu.js';
import { taskMenu } from './cli/taskMenu.js';
import pool from './config/db.js';

async function main() {
  while (true) {
    const user = await authMenu();
    if (!user) break; // user chose Exit

    await taskMenu(user); // returns when user chooses Logout
  }

  console.log('\nGoodbye!');
  await pool.end();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('Fatal error:', err);
  await pool.end();
  process.exit(1);
});
