# Club Management Website

## Project Overview

The Club Management Website is a centralized, role-based web application designed for educational institutions to manage student clubs, events, and registrations efficiently.

The platform supports **Super Admins**, **Club Admins (student heads)**, and **Students**, enabling structured event creation, participation, and announcement handling through a single unified system.

Unlike informal methods such as messaging groups or notice boards, this platform provides a **transparent, scalable, and organized digital solution** for managing campus club activities.

---

## Problem Statement

As student clubs and campus activities increase, colleges need a simple and centralized way to manage club events, registrations, and announcements, while administrators need reliable tools to oversee clubs and ensure smooth coordination.

Current approaches either:
- Rely on informal platforms such as messaging groups and notice boards, or
- Use manual spreadsheets and disconnected tools

This lack of a unified system makes it difficult to ensure **event visibility, accurate registrations, transparent administration, and efficient student participation**.

---

## Vision Statement

To create a centralized, transparent, and scalable platform that seamlessly integrates **club management, event organization, and student participation**, enabling reliable administration and structured engagement across all campus clubs.

---

## Target Users (Personas)

### Student
- Browses available club events
- Views event details
- Registers for events
- Makes payments for paid events
- Views announcements and confirmations

### Club Admin
- Student who heads a club
- Creates and manages club events
- Decides whether events are paid or non-paid
- Sets event date and time
- Views registrations and payment status

### Super Admin
- Manages clubs and club admin accounts
- Posts announcements
- Maintains website configuration
- Oversees all system activity

---

## Key Features

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

- **Frontend:** React.js  
- **Routing:** React Router  
- **State Management:** Context API  
- **Styling:** CSS / Tailwind CSS  
- **Backend (future scope):** Node.js / Firebase  
- **Database (future scope):** Firestore / MongoDB  
- **Design Tool:** Figma  
- **Version Control:** GitHub  
- **Project Management:** GitHub Issues & Projects  

---

## Success Metrics

- Students can easily browse and register for events
- Club admins can manage events without errors
- Paid and non-paid event workflows function correctly
- Announcements reach all users
- Role-based access is enforced properly
- Project is completed within the academic timeline

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

- `main` → Stable production-ready branch  
- `dev` → Development branch  
- `feature/*` → New feature development  

### Example Workflow
```bash
git checkout -b feature/event-management
git commit -m "Add event creation and registration flow"
git push origin feature/event-management

```
---
## Assumptions

- Users have access to a modern web browser.
- Students and club admins have valid institutional credentials.
- Club admins enter correct and up-to-date event information.
- Internet connectivity is available for accessing the platform.
- Payment handling (if enabled) follows predefined workflows.
- The frontend application is sufficient for the current academic phase.

---

## Constraints

- The project must be completed within the academic timeline.
- Only free and open-source technologies are used.
- Backend functionality is limited or simulated in the initial phase.
- Security mechanisms are basic and role-based.
- The system is not designed for enterprise-scale deployment.
- Real-time notifications and advanced analytics are out of scope.

---

## Docker Setup

The Club Management Website can be containerized using Docker to ensure consistent execution across different environments.

### Prerequisites
- Docker (v20 or higher)
- Docker Compose (optional)
- Git

### Build the Docker Image
```bash
docker-compose build
docker-compose up
