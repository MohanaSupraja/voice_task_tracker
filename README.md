ADVANCED TECHNIQUES USED - Debouncing & Create Portals

1. Project Setup

This document explains how to set up and run the voice_task_tracker project locally, including prerequisites, installation steps, email configuration, and developer utilities.

a. Prerequisites

Before running the project, ensure the following software and keys are available:

Required Software
| Component   | Version / Requirement                                     |
| ----------- | --------------------------------------------------------- |
| **Node.js** | v18+ recommended (Project tested on **v24.11.0**)         |
| **npm**     | Installed with Node                                       |
| **MongoDB** | MongoDB Atlas connection string or local MongoDB instance |
| **Git**     | Required to clone repo                                    |

Required API Keys

The backend uses Together AI for LLM-based natural speech parsing.
You must create an API key from: https://api.together.ai

Add it in .env as :
TOGETHER_API_KEY=your_key_here

b. Install Steps
Clone the Repository
git clone <your-repo-url>
cd voice_task_tracker

Frontend Setup
cd frontend
npm install

Backend Setup
cd backend
npm install

c. How to Configure Email Sending / Receiving
Email Sending (Required)

Email notifications are triggered whenever a task is created, updated, or deleted.

Ensure .env contains:

EMAIL_USER=your@gmail.com
EMAIL_PASS=your_16_char_app_password
NOTIFY_EMAIL=recipient@gmail.com

d. How to Run Everything Locally
Backend
cd backend
npm run dev

This uses nodemon to auto-reload on file changes.

Backend will run at : http://localhost:5000

Frontend
cd frontend
npm start

Frontend will run at: http://localhost:5173

<!-- -------------------------------------------------------------------------------->

2. Tech Stack

This project uses a modern, scalable technology stack to enable voice-based task creation, NLP processing, task management, email notifications, and a real-time UI.

a. Technology Overview 

Frontend - Key Libraries & Tools

| Library                         | Purpose                                          |
| ------------------------------- | ------------------------------------------------ |
| **React 18**                    | Core UI framework                                |
| **Redux Toolkit**               | State management for tasks & parsed voice data   |
| **@hello-pangea/dnd**           | Drag-and-drop Kanban board functionality         |
| **SpeechRecognition (Web API)** | Browser-based voice input                        |
| **CSS (custom)**                | Advanced styling, grid layout, responsive design |


Backend - Key Libraries & Tools

| Library             | Purpose                               |
| ------------------- | ------------------------------------- |
| **Express.js**      | HTTP server & routing                 |
| **Together AI SDK** | Llama 3.1 LLM for NLP task extraction |
| **chrono-node**     | Natural language date parsing         |
| **nodemailer**      | Email sending                         |
| **dotenv**          | Environment variable management       |
| **cors**            | Cross-origin request handling         |


Database

| Database                        | Usage                                                                      |
| ------------------------------- | -------------------------------------------------------------------------- |
| **MongoDB Atlas (Recommended)** | Cloud database for easy setup & deployment (`MONGO_URL=mongodb+srv://...`) |
| **Local MongoDB (Optional)**    | For offline development (`mongodb://127.0.0.1:27017/voice_task_tracker`)   |


AI Provider

| Component | Details                                                 |
| --------- | ------------------------------------------------------- |
| **Model** | meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo             |
| **Usage** | Converts natural language speech → structured task JSON |
| **API**   | together-ai Node SDK (`npm i together-ai`)              |

Email Solution

| Purpose                 | Description                               |
| ----------------------- | ----------------------------------------- |
| **sendEmail() Utility** | Sends emails on task create/update/delete |
| **Gmail App Password**  | Required for secure SMTP authentication   |
| **NOTIFY_EMAIL**        | Recipient who receives notifications      |


<!-- ------------------------------------------------------------------------------ -->

3. API Documentation

This backend exposes REST APIs for creating, updating, deleting, and filtering tasks, as well as parsing natural language using AI.

BASE_URL = `http://localhost:5000`

| Feature           | Endpoint            | Method |
| ----------------- | ------------------- | ------ |
| Parse voice input | `/api/parse`        | POST   |
| Create task       | `/api/tasks`        | POST   |
| Filter tasks      | `/api/tasks/filter` | POST   |
| Update task       | `/api/tasks/:id`    | PUT    |
| Delete task       | `/api/tasks/:id`    | DELETE |

<!-- --------------------------------------------------------------------------- -->

4. Decisions & Assumptions

4.a. Key Design Decisions

1. Task Model Structure

Tasks follow a strict schema for consistency across frontend, backend, and AI parsing.

Fields chosen:
title – required, short text
description – optional text
priority – Low | Medium | High
status – To Do | In Progress | Done
dueDate – stored as YYYY-MM-DD
createdAt / updatedAt – managed by Mongoose timestamps

2. Natural Language Parsing Flow

Design Choice: Voice → Text → LLM → Chrono
LLM extracts:
Title
Priority
Status
Due Date
chrono-node normalizes dates (e.g., "next Monday" → actual date).
LLM alone is not reliable for date resolution; chrono ensures accuracy.

3. Confidence Score in LLM Responses

The LLM returns response JSON along with:
"confidence": 0.0 - 1.0"
Debugging parsing quality
Understanding ambiguity in voice inputs
Future improvements like "low confidence = improve prompt"

4. Kanban Board Interaction

Implemented using @hello-pangea/dnd.
Dragging behavior moved into a portal to eliminate drag-jumping and clipping under columns.
Default library dragging causes issues with overflowed columns; portal solves it cleanly.

5. Search Debouncing

Typing in search filters triggers useDebounce() to reduce API calls.
Prevents fetching on every keystroke and improves performance.

6. Email Notification Strategy

Email is sent only on task creation (update/delete support optional).
Backend responds immediately before sending email (email runs asynchronously).
Tech used: Nodemailer + Gmail SMTP (App Password).
Avoids UI blocking while still delivering notifications in the background.

7. UI/UX Decisions

Board View and List View toggle to support different use cases.
Sticky toolbar keeps filters and voice input always accessible.
Modal review step before confirming tasks parsed from voice.
Inline editing within cards for quick updates.
Columns have controlled height with internal scroll for clean layout.

8. Error Handling Design

Error Boundaries are implemented around all major UI regions.
All backend responses are standardized JSON objects.
Email failures never prevent task creation.
Voice input errors are gracefully surfaced to the user.

4.b. Assumptions Made

1. Email Workflow Assumptions

System uses one sender Gmail account + one notify email.
Users do not authenticate individually.
Gmail requires App Password (not normal login password).

2. Voice Input Assumptions

User is using Chrome or a browser supporting the Web Speech API.
Spoken commands are brief and in English.
Phrases generally follow patterns like “Create a high priority task due tomorrow”.

3. Date Parsing Assumptions

Relative dates are interpreted based on:
today = new Date().toISOString().split("T")[0].
LLM may output approximate dates, so chrono is used to normalize.
If a date cannot be parsed → dueDate = null.

<!---------------------------------------------------------------------------------->

5. AI Tools Usage

| AI Tool / Platform                         | Purpose                                                     |
| ------------------------------------------ | ----------------------------------------------------------- |
| **GitHub Copilot**                         | Autocomplete imports (React components, Express routers).   |
| **Together AI (Llama-3.1 8B)**             | used for speech-to-task parsing.                            |
| **Browser DevTools**                       | Error tracing and quick refactoring suggestions.            |

What I Learned From Using These Tools

1. AI accelerates development but needs human supervision

LLMs are fast, but:
Dates must still be validated with chrono-node.
LLM JSON can break unless carefully prompted.
CSS fixes often require manual fine-tuning.

2. Prompt engineering helps - Small changes (like adding today's date) drastically improve model reliability.