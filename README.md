# Todo App — Setup & Run

## 1. Install Node dependencies
Open this folder in VS Code, open the terminal, run:
```
npm install
```

## 2. Create the MySQL database
Open MySQL Workbench (or `mysql` CLI), run the contents of `schema.sql`:
```
mysql -u root -p < schema.sql
```
Or just copy-paste the contents of `schema.sql` into Workbench and execute it.

## 3. Set your DB credentials
Copy `.env.example` to a new file named `.env`, then fill in your real MySQL
password:
```
cp .env.example .env
```
`.env` is already in `.gitignore` — never commit it.

## 4. Run the app
```
npm start
```

## How the files map to the assignment's use cases
- `cli/authMenu.js` → Main Menu, Use Case 1 (Register), Use Case 2 (Login)
- `cli/taskMenu.js` → Todo Menu, Use Cases 3–8 (Add/View/Edit/Delete/Search/Logout)
- `services/authService.js` → all Register/Login validation + password hashing
- `services/taskService.js` → all Task validation + business rules
- `repositories/*.js` → raw SQL only, no validation, no console output
- `utils/validators.js` → reusable validation functions, no DB or console
- `config/db.js` → single MySQL connection pool shared by both repositories

## Design decisions made where the spec was ambiguous (explain these in your report)

1. **Passwords are hashed with bcrypt**, not stored in plaintext, even though
   the spec's console flow shows a plaintext-looking value. The `password`
   column stores the hash. This is correct practice and easy to justify if
   asked.

2. **Login uses one error message for both "email not found" and "wrong
   password"** (`Invalid email or password.`) instead of the spec's two
   different strings. Revealing which one failed is a security leak — an
   attacker could otherwise enumerate which emails are registered.

3. **Editing a task**: pressing Enter (leaving an answer blank) keeps the
   current value instead of failing validation. Re-typing every field on every
   edit is bad UX and the spec doesn't say it should fail.

4. **Edit/Delete are scoped by `userId` as well as task `id`** in every query.
   This stops one logged-in user from editing or deleting another user's task
   by guessing an ID. Not explicitly stated in the spec, but it's a real
   access-control bug if skipped — worth mentioning in your report as a
   security consideration you accounted for.

## Test these yourself before submitting
- Register with a duplicate email → "Email already exists."
- Register with a 3-character password → should fail; 4 characters → should pass.
- Login with wrong email, then wrong password → same error message both times.
- Add a task with an empty title → should fail.
- Add a task with `priority = "high"` (lowercase) → decide and verify it's rejected unless you normalize case.
- Add a task with an impossible date like `2026-02-30` → should fail.
- View tasks with zero tasks → "No tasks found."
- Edit/Delete a task ID that doesn't exist → "Task not found."
- Delete a task and answer anything other than "yes" → "Delete cancelled."
- Search a keyword that matches nothing → "No matching tasks found."
- Logout → should return to the Welcome (Register/Login/Exit) screen, not the task menu.
