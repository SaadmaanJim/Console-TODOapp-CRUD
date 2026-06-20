export function isEmpty(str) {
  return !str || str.trim().length === 0;
}

export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 4;
}

export function isValidDate(dateStr) {
  if (typeof dateStr !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(dateStr);

  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
}

export function isValidPriority(priority) {
  return ['Low', 'Medium', 'High'].includes(priority);
}

export function isValidStatus(status) {
  return ['Pending', 'Completed'].includes(status);
}
