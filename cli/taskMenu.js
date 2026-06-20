import prompts from 'prompts';
import {
  addTask,
  getAllTasks,
  editTask,
  removeTask,
  search
} from '../services/taskService.js';

// Returns when the user picks Logout.
export async function taskMenu(user) {
  while (true) {
    console.log('\nTodo Menu\n');
    console.log('1. Add Task');
    console.log('2. View Tasks');
    console.log('3. Edit Task');
    console.log('4. Delete Task');
    console.log('5. Search Tasks');
    console.log('6. Logout\n');

    const { choice } = await prompts({
      type: 'text',
      name: 'choice',
      message: 'Enter your choice:'
    });

    if (choice === '1') await handleAdd(user.id);
    else if (choice === '2') await handleView(user.id);
    else if (choice === '3') await handleEdit(user.id);
    else if (choice === '4') await handleDelete(user.id);
    else if (choice === '5') await handleSearch(user.id);
    else if (choice === '6') return;
    else console.log('\nInvalid choice.');
  }
}

async function handleAdd(userId) {
  const answers = await prompts([
    { type: 'text', name: 'title', message: 'Enter task title:' },
    { type: 'text', name: 'description', message: 'Enter task description:' },
    { type: 'text', name: 'dueDate', message: 'Enter due date:' },
    { type: 'text', name: 'priority', message: 'Enter priority:' }
  ]);

  const result = await addTask(
    userId,
    answers.title,
    answers.description,
    answers.dueDate,
    answers.priority
  );
  console.log('\n' + result.message);
}

async function handleView(userId) {
  const { tasks } = await getAllTasks(userId);
  if (tasks.length === 0) {
    console.log('\nNo tasks found.');
    return;
  }
  console.log('\nYour Tasks:\n');
  tasks.forEach(printTask);
}

async function handleEdit(userId) {
  const { taskId } = await prompts({
    type: 'text',
    name: 'taskId',
    message: 'Enter task ID to edit:'
  });

  const { tasks } = await getAllTasks(userId);
  const existing = tasks.find(t => t.id === Number(taskId));
  if (!existing) {
    console.log('\nTask not found.');
    return;
  }

  console.log(`\nCurrent Title: ${existing.title}`);
  const { title } = await prompts({ type: 'text', name: 'title', message: 'Enter new title:' });

  console.log(`Current Description: ${existing.description}`);
  const { description } = await prompts({ type: 'text', name: 'description', message: 'Enter new description:' });

  console.log(`Current Due Date: ${formatDate(existing.dueDate)}`);
  const { dueDate } = await prompts({ type: 'text', name: 'dueDate', message: 'Enter new due date:' });

  console.log(`Current Priority: ${existing.priority}`);
  const { priority } = await prompts({ type: 'text', name: 'priority', message: 'Enter new priority:' });

  console.log(`Current Status: ${existing.status}`);
  const { status } = await prompts({ type: 'text', name: 'status', message: 'Enter new status(Pending/Complete):' });
  
  const result = await editTask(userId, Number(taskId), { title, description, dueDate, priority, status });
  console.log('\n' + result.message);
}

async function handleDelete(userId) {
  const { taskId } = await prompts({
    type: 'text',
    name: 'taskId',
    message: 'Enter task ID to delete:'
  });

  const { confirm } = await prompts({
    type: 'text',
    name: 'confirm',
    message: 'Are you sure you want to delete this task? yes/no'
  });

  const confirmed = typeof confirm === 'string' && confirm.trim().toLowerCase() === 'yes';
  const result = await removeTask(userId, Number(taskId), confirmed);
  console.log('\n' + result.message);
}

async function handleSearch(userId) {
  const { keyword } = await prompts({
    type: 'text',
    name: 'keyword',
    message: 'Enter search keyword:'
  });

  const { tasks } = await search(userId, keyword);
  if (tasks.length === 0) {
    console.log('\nNo matching tasks found.');
    return;
  }
  console.log('\nSearch Result:\n');
  tasks.forEach(printTask);
}

function printTask(t) {
  console.log(`ID: ${t.id}`);
  console.log(`Title: ${t.title}`);
  console.log(`Due Date: ${formatDate(t.dueDate)}`);
  console.log(`Priority: ${t.priority}`);
  console.log(`Status: ${t.status}\n`);
}

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toISOString().split('T')[0];
}
