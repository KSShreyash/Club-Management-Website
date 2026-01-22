```md
# Club Management Website

## Project Overview
The **Club Management Website** is a centralized, role-based web application designed for educational institutions to manage student clubs, events, and registrations efficiently. The platform supports **Super Admins**, **Club Admins (student heads)**, and **Students**, enabling structured event creation, participation, and announcement handling.

Unlike informal methods such as messaging groups or notice boards, this system provides a **transparent, scalable, and organized digital solution** for managing club activities within a campus.

---

## Problem Statement
In many colleges, club activities are managed manually using WhatsApp groups, posters, or spreadsheets. This results in:
- Poor visibility of events
- Manual registration errors
- Difficulty managing paid and non-paid events
- Lack of centralized announcements
- No proper access control

A unified digital platform is required to streamline club operations and improve student participation.

---

## Vision Statement
To build a centralized, role-based platform that simplifies **club event management**, enhances **student engagement**, and ensures **transparent administration** through a scalable and user-friendly web application.

---

## Target Users (Personas)

### 1. Student
- Browses available club events
- Registers for events
- Makes payments for paid events
- Views announcements and confirmations

### 2. Club Admin
- Student who heads a club
- Creates and manages club events
- Decides paid or non-paid events
- Views registrations and payment status

### 3. Super Admin
- Manages clubs and club admin accounts
- Posts announcements
- Maintains website configuration
- Has access to all data and activities

---

## Key Features / Goals
- Role-based authentication and access control
- Centralized event listing and registration
- Paid and non-paid event handling
- Club creation and club admin assignment
- Event registration tracking
- Announcement management
- Clean and intuitive user interface
- Scalable frontend architecture

---

## Technology Stack
```

Frontend              React.js
Routing               React Router
State Management      Context API
Styling               CSS / Tailwind CSS
Backend (future)      Node.js / Firebase
Database (future)     Firestore / MongoDB
Version Control       GitHub
Design Tool           Figma
Project Management    GitHub Issues & Projects

````

---

## Success Metrics
- Students can easily browse and register for events
- Club admins can manage events without errors
- Paid and non-paid event workflows function correctly
- Announcements reach all users
- Role-based access is enforced properly
- Project completed within academic timeline

---

## Workflow

### Student Workflow
1. Student logs in
2. Browses available events
3. Views event details
4. Registers for event
5. Makes payment (if required)
6. Receives registration confirmation

### Club Admin Workflow
1. Club admin logs in
2. Creates or updates events
3. Sets event as paid or non-paid
4. Publishes event
5. Views registered students

### Super Admin Workflow
1. Super admin logs in
2. Creates or removes clubs
3. Assigns or removes club admins
4. Posts announcements
5. Oversees system activity

---

## MoSCoW Prioritization

### Must Have
- Login and role-based access
- Event creation and management
- Event browsing and registration
- Paid and non-paid event handling
- Announcement posting
- Responsive UI

### Should Have
- Payment confirmation UI
- Registration history
- Event status tracking

### Could Have
- Event filtering
- Notifications
- Participation certificates

### Won’t Have (for this phase)
- Chat system
- Advanced analytics
- Third-party integrations

---

## Branching Strategy (GitHub Flow)

- `main` → Stable branch  
- `dev` → Development branch  
- `feature/*` → Feature development  

### Example Workflow
```bash
git checkout -b feature/event-management
git commit -m "Add event creation and registration flow"
git push origin feature/event-management
````

---

## Assumptions

* Users have access to a modern web browser
* Students have valid institutional credentials
* Club admins are responsible for accurate event data
* Internet connectivity is available

---

## Constraints

* Academic project timeline
* Use of free and open-source tools
* Limited backend scope in initial phase
* Basic authentication only
* No enterprise-scale deployment

---

## Project Setup

### Prerequisites

* Node.js (v18+)
* npm or yarn
* Git

### Install Dependencies

```bash
npm install
```

### Run the Application

```bash
npm start
```

---

## Project Status

Frontend development using React is in progress. Backend integration and deployment will be considered in future phases.

---

## Author

**Kumar Shreyash**
B.Tech Computer Science Engineering
Academic Project

```
```
