# 📝 Todo CRUD App — Console Edition

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-password%20hashing-orange?style=for-the-badge)
![Status](https://img.shields.io/badge/status-complete-brightgreen?style=for-the-badge)

A console-based Todo application with user authentication and full task CRUD,
built in **JavaScript (Node.js)** with **MySQL** for persistence. Built as a
CSE coursework project (Batch 18 — Simple CRUD Project) with an emphasis on
layered architecture, input validation, and basic security practices
(password hashing, access-control scoping, parameterized queries).

---

## 🎥 Demo Video

[Watch the full workflow demo](https://drive.google.com/file/d/1tcgYLGXmbTioX8wM2Q8B2SYmylmAcrd8/view?usp=sharing)

*(Register → Login → Add/View/Edit/Search/Delete Task → Logout → Exit)*

---

## ✨ Features

- **User Registration** — name, email, password with validation (empty checks, email format, password length, duplicate email rejection)
- **User Login** — credential verification via bcrypt hash comparison, unified error messaging
- **Add Task** — title, description, due date, priority, defaults to `Pending` status
- **View Tasks** — lists all tasks scoped to the logged-in user only
- **Edit Task** — update any field; leaving a prompt blank keeps its current value
- **Delete Task** — requires explicit yes/no confirmation before removal
- **Search Tasks** — keyword match against title or description
- **Logout / Exit** — clean session reset and graceful database disconnect

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Database | MySQL |
| DB Driver | `mysql2` (promise-based, parameterized queries) |
| Password Hashing | `bcrypt` |
| CLI Input | `prompts` |
| Config | `dotenv` |

---

## 📂 Project Structure

```
todo-app/
├── app.js                     # Entry point — owns the main program loop
├── schema.sql                 # Database schema (User + Task tables)
├── config/
│   └── db.js                  # MySQL connection pool
├── cli/
│   ├── authMenu.js            # Console I/O — Register / Login / Exit
│   └── taskMenu.js            # Console I/O — Task menu (post-login)
├── services/
│   ├── authService.js         # Business rules — register/login validation, hashing
│   └── taskService.js         # Business rules — task validation, edit/delete logic
├── repositories/
│   ├── userRepository.js      # Raw SQL — User table only
│   └── taskRepository.js      # Raw SQL — Task table only
└── utils/
    └── validators.js          # Pure validation functions (no DB, no I/O)
```

**Why layered?** Each layer has exactly one responsibility — the CLI talks to
the human, services hold the business rules, repositories talk to SQL. This
means each layer can be reasoned about and tested independently, without
needing the layers above or below it.

---

## 🚀 Setup & Run

### 1. Clone the repository
```bash
git clone https://github.com/your-username/todo-app-crud.git
cd todo-app-crud
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create the MySQL database
Run the contents of `schema.sql` against your MySQL server — either paste it
into MySQL Workbench / DBeaver and execute, or via CLI:
```bash
mysql -u root -p < schema.sql
```

### 4. Configure environment variables
Copy the example file and fill in your real MySQL credentials:
```bash
cp .env.example .env
```
Edit `.env`:
```
DB_HOST=localhost
DB_USER=my_name
DB_PASSWORD=your_mysql_password
DB_NAME=todo_app
```
> ⚠️ `.env` is gitignored 

### 5. Run the app
```bash
npm start
```

---

## 🧠 Design Decisions (where the spec was ambiguous)

1. **Passwords are bcrypt-hashed**, not stored in plaintext, even though the
   original spec's console flow implied a plaintext-looking value. Storing
   plaintext passwords is unacceptable practice regardless of what a mock
   flow shows.

2. **Login returns one unified error message** (`Invalid email or
   password.`) for both "email not found" and "wrong password," instead of
   two different strings. Revealing which one failed lets an attacker
   enumerate which emails are registered — a real information leak.

3. **Editing a task**: leaving a prompt blank keeps the field's current
   value instead of failing validation. Forcing a full re-type of every
   field on every edit is poor UX, and nothing in the spec requires it.

4. **Edit and Delete are scoped by `userId` *and* task `id`** in every
   query — not just task `id` alone. This prevents one logged-in user from
   editing or deleting another user's task by guessing an ID. Not stated in
   the original spec, but a genuine access-control gap if skipped.

---

## ✅ Manual Test Cases Verified

- [x] Duplicate email registration → `Email already exists.`
- [x] Password under 4 characters → rejected; exactly 4 → accepted
- [x] Wrong email and wrong password → identical error message both times
- [x] Empty task title → `Task title cannot be empty.`
- [x] Invalid date (e.g. `2026-02-30`) → `Invalid date format.`
- [x] Invalid priority value → rejected
- [x] View tasks with none existing → `No tasks found.`
- [x] Edit/Delete a non-existent task ID → `Task not found.`
- [x] Delete confirmation declined → `Delete cancelled.`
- [x] Search with no keyword match → `No matching tasks found.`
- [x] Logout returns to Welcome screen, not the task menu
- [x] One user cannot edit/delete another user's task by ID

---

## 👤 Author

**Sadman Islam** — CSE Undergraduate, American International University-Bangladesh
