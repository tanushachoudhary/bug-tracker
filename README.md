# 🐞 Serverless Bug Tracker Application

A **full-stack, serverless web application** for tracking and managing software bugs.  
Built with **React**, **AWS Lambda**, and **DynamoDB**, it’s scalable, cost-efficient, and easy to deploy.

<img width="1861" height="853" alt="image" src="https://github.com/user-attachments/assets/cd744524-d23f-4255-9610-e684da7d1970" />
<img width="1855" height="858" alt="Screenshot 2025-10-30 162203" src="https://github.com/user-attachments/assets/fa0b6fc1-8f05-402d-b32a-ba94798b8195" />


## 🚀 Features

- **Create Bugs** – Submit new bugs with a title and description.  
- **View Bugs** – See a real-time list of all submitted bugs.  
- **Update Status** – Change the status of any bug (Open, In Progress, Resolved).  
- **Email Notifications** – Automatically sends an email via Amazon SES when a new bug is submitted.  

---

## 🧩 Architecture Overview

This project follows a **serverless architecture** using AWS services.

### Data Flow

1. **Frontend:**  
   Users interact with the React app hosted on **Amazon S3** (static website hosting).  
2. **API Layer:**  
   React (via `axios`) sends HTTP requests to **Amazon API Gateway**.  
3. **Compute:**  
   API Gateway triggers an **AWS Lambda function** (`BugTrackerHandler`) through **Lambda Proxy Integration**.  
4. **Business Logic:**  
   The Lambda function (Node.js 20.x) handles CRUD operations, generates UUIDs, and manages bug data.  
5. **Database:**  
   Lambda reads/writes bug data in a **DynamoDB** table (`BugsTable`).  
6. **Notifications (Optional):**  
   On new bug creation, Lambda sends an email notification via **Amazon SES**.  
7. **Response:**  
   Data flows back: DynamoDB → Lambda → API Gateway → React App → UI Update.  

---

## 🧠 Technology Stack

### Frontend
- ⚛️ React 18  
- 🌐 axios (for API requests)  
- 🎨 HTML5, CSS3 (modern dark theme)

### Backend (Serverless)
- 🧭 **API:** Amazon API Gateway (REST API)  
- ⚙️ **Compute:** AWS Lambda (Node.js 20.x)  
- 🗄️ **Database:** Amazon DynamoDB (Single Table)  
- ✉️ **Notifications:** Amazon SES (Simple Email Service)  
- ☁️ **Hosting:** Amazon S3 (Static Website Hosting)  
- 🔒 **IAM:** AWS Identity and Access Management  

---

## 🛠️ Deployment Guide

### Part 1: Backend Setup (AWS)

#### 🗄️ DynamoDB
1. Create a new table, e.g., **`BugsTable`**  
2. Partition key: `id` (String)  
3. Keep all other defaults  

#### ⚙️ Lambda Function
1. Create function **`BugTrackerHandler`** (Runtime: Node.js 20.x).  
2. **Add a Layer for `uuid`:**
   ```bash
   mkdir nodejs && cd nodejs
   npm init -y
   npm install uuid
   zip -r layer.zip nodejs
   ````

Upload `layer.zip` as a new Lambda Layer and attach it.
3. Paste your Lambda code (`index.mjs`) into the code editor.


#### 🔑 IAM Permissions

Attach the following policies to the Lambda execution role:

* `AmazonDynamoDBFullAccess`
* `AmazonSESFullAccess`

(Or limit to specific permissions like `PutItem`, `Scan`, `UpdateItem`, `SendEmail`.)

#### 🌐 API Gateway

1. Create a new **REST API**.
2. Create resource: `/bugs`

   * **GET** → Lambda Proxy Integration
   * **POST** → Lambda Proxy Integration
3. Create a child resource: `/bugs/{id}`

   * **PUT** → Lambda Proxy Integration
4. Enable **CORS** for `/bugs` and `/bugs/{id}`
5. Deploy the API to a new stage (e.g., `prod` or `stage1`).
6. Copy the **Invoke URL**.

#### ✉️ Amazon SES 

1. Verify sender and recipient emails under **Verified Identities**.
2. Sandbox accounts require both addresses to be verified.

---

### Part 2: Frontend Deployment

#### ⚙️ Configure React App

1. Open `App.jsx`.
2. Set the API URL:

   ```js
   const API_URL = "https://your-api-gateway-url.amazonaws.com/prod";
   ```

#### 🧱 Build the App

```bash
npm install
npm run build
```

This creates a `/build` (or `/dist`) folder.

#### ☁️ Host on Amazon S3

1. Create a bucket (e.g., `bug-tracker-ui`).
2. **Permissions:**

   * Uncheck **Block all public access**
   * Add this **Bucket Policy**:

     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Sid": "PublicReadGetObject",
           "Effect": "Allow",
           "Principal": "*",
           "Action": "s3:GetObject",
           "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
         }
       ]
     }
     ```
3. **Static Website Hosting:**

   * Enable it in the **Properties** tab.
   * Set `index.html` as the Index document.
4. Upload the build files (`index.html`, `assets/`, `static/`) to the bucket root.
5. Use your **S3 Website Endpoint** to access the live app.

---

## 🔗 API Endpoints

**Base URL:** `https://your-api-gateway-url.amazonaws.com/prod`

| Method | Endpoint     | Body (JSON)                                      | Description             |
| ------ | ------------ | ------------------------------------------------ | ----------------------- |
| POST   | `/bugs`      | `{ "title": "Bug Title", "description": "..." }` | Creates a new bug.      |
| GET    | `/bugs`      | None                                             | Retrieves all bugs.     |
| PUT    | `/bugs/{id}` | `{ "status": "In Progress" }`                    | Updates a bug’s status. |

---

## 📬 Example Email Notification 

When a new bug is created, Amazon SES sends a notification email:

```
Subject: 🐞 New Bug Submitted
Body: A new bug titled "Login Button Not Working" has been added to the tracker.
```

---

## 📸 Live Demo 
👉 [Link](http://bug-tracker-ui.s3-website.ap-south-1.amazonaws.com/)
