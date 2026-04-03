Task Management Fullstack App

A full-stack Todo application built with **Django REST Framework** and **React (Vite)** featuring role-based task assignment, approval workflow, and live search with autocomplete.

---

Features

Authentication & Authorization

* JWT-based authentication
* User registration and login
* Role-based access control (**Admin** and **Worker**)

---

Task Assignment & Workflow System

Admin Capabilities

* Assign todos to specific workers
* View all todos across all users
* Approve or unapprove completed tasks

Worker Capabilities

* View only their assigned todos
* Mark todos as **Completed** (submit for approval)

---

Status Workflow

```
Ongoing → For Approval → Approved
```

* **Ongoing** → Assigned by admin
* **For Approval** → Marked complete by worker
* **Approved** → Verified by admin

---

Search & Filtering

Admin

* Search by:

  * Worker full name
  * Title
  * Description
* Full visibility across all todos

Worker

* Search only within their own todos
* Search by:

  * Title
  * Description

Features

* Live search with debounce
* Autocomplete dropdown suggestions
* Unique result filtering (e.g., duplicate titles handled)

---

Pagination

* Server-side pagination
* Next / Previous navigation

---

Frontend

* Built with React + Vite
* Styled using Tailwind CSS
* Responsive UI
* Modal-based editing

---

Backend

* Django REST Framework
* Custom permissions (role-based restrictions)
* Filtered querysets based on user role
* Secure API endpoints

---
Key Highlights

* Role-based task assignment system (Admin → Worker)
* Controlled approval workflow
* Scoped data access (workers only see their own data)
* Advanced search with role-based filtering
* Clean API and frontend separation

---
