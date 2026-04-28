# Frolic Event Management API Documentation
# =========================================

## Table of Contents
1. Introduction
2. Quick Start Guide
3. Authentication API
4. User Management API
5. Institute API
6. Department API
7. Event API
8. Group API
9. Participant API
10. Winner Management API
11. Data Models Reference
12. Error Codes & Messages
13. Best Practices for Frontend
14. API Flow Examples
15. FAQ
16. Testing the API
17. Support

## 1. Introduction

Welcome to the Frolic Event Management System API! This API allows you to manage institutes, departments, events, groups, participants, and winners for an event management platform.

### Base URL
http://localhost:5000/api
(Replace with your actual server URL)

### Authentication
- Uses JWT tokens stored in cookies
- After login, token is automatically stored
- Include token automatically with requests
- Admin-only endpoints require isAdmin: true

## 2. Quick Start Guide

### Authentication Flow
Step 1: Register a user
POST /api/auth/register

Step 2: Login to get token (stored in cookies automatically)
POST /api/auth/login

Step 3: Use token for all protected routes automatically

### User Types & Permissions
- Admin Users: Can access everything, manage all resources
- Regular Users: Limited access based on their role
- Coordinators: Can manage their own departments/events
- Group Leaders: Can manage their own groups and participants

## 3. Authentication API

### Register New User
POST /api/auth/register

Body:
{
  "UserName": "John Doe",
  "UserPassword": "password123",
  "EmailAddress": "john@example.com",
  "PhoneNumber": "1234567890",
  "isAdmin": false
}

Response (Success - 200):
{
  "message": "User created successfully",
  "newUser": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "John Doe",
    "email": "john@example.com"
  }
}

Notes:
- isAdmin must be true or false
- Email must be unique
- All fields are required

### Login User
POST /api/auth/login

Body:
{
  "EmailAddress": "john@example.com",
  "UserPassword": "password123"
}

Response (Success - 200):
{
  "message": "Login Successfully"
}

Important: Token is automatically stored in cookies and will be sent with all subsequent requests.

### Get Current User Profile
GET /api/auth/me

Headers: Requires authentication token (automatically in cookies)

Response (Success - 200):
{
  "_id": "60d21b4667d0d8992e610c85",
  "UserName": "John Doe",
  "EmailAddress": "john@example.com",
  "PhoneNumber": "1234567890",
  "isAdmin": false,
  "__v": 0
}

## 4. User Management API

### Get All Users (Admin Only)
GET /api/users

Permissions: Only users with isAdmin: true

Response:
{
  "users": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "UserName": "John Doe",
      "EmailAddress": "john@example.com",
      "PhoneNumber": "1234567890",
      "isAdmin": false
    }
  ]
}

### Get Specific User
GET /api/users/:id

Permissions: Admin users OR the user themselves

Example: GET /api/users/60d21b4667d0d8992e610c85

Response:
{
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "UserName": "John Doe",
    "EmailAddress": "john@example.com",
    "PhoneNumber": "1234567890",
    "isAdmin": false
  }
}

### Update User
PATCH /api/users/:id

Permissions: Admin users OR the user themselves

Body (partial updates allowed):
{
  "UserName": "John Smith",
  "PhoneNumber": "9876543210"
}

Response:
{
  "message": "User updated successfully",
  "updatedUser": {
    "_id": "60d21b4667d0d8992e610c85",
    "UserName": "John Smith",
    "EmailAddress": "john@example.com",
    "PhoneNumber": "9876543210",
    "isAdmin": false
  }
}

### Delete User (Admin Only)
DELETE /api/users/:id

Permissions: Only admin users

Response:
{
  "message": "User deleted successfully",
  "deletedUser": {
    "_id": "60d21b4667d0d8992e610c85",
    "UserName": "John Doe",
    "EmailAddress": "john@example.com",
    "PhoneNumber": "1234567890",
    "isAdmin": false
  }
}

## 5. Institute API

### Get All Institutes
GET /api/institute

Permissions: Any authenticated user

Response:
{
  "institutes": [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "InstituteName": "MIT",
      "InstituteImage": "mit.jpg",
      "InstituteDescription": "Massachusetts Institute of Technology",
      "InstituteCoOrdinatorID": "60d21b4667d0d8992e610c85",
      "ModifiedBy": "60d21b4667d0d8992e610c85",
      "createdAt": "2023-01-15T10:30:00.000Z",
      "updatedAt": "2023-01-15T10:30:00.000Z"
    }
  ]
}

### Get Single Institute
GET /api/institute/:id

Example: GET /api/institute/60d21b4667d0d8992e610c86

Response:
{
  "institute": {
    "_id": "60d21b4667d0d8992e610c86",
    "InstituteName": "MIT",
    "InstituteImage": "mit.jpg",
    "InstituteDescription": "Massachusetts Institute of Technology",
    "InstituteCoOrdinatorID": "60d21b4667d0d8992e610c85",
    "ModifiedBy": "60d21b4667d0d8992e610c85",
    "createdAt": "2023-01-15T10:30:00.000Z",
    "updatedAt": "2023-01-15T10:30:00.000Z"
  }
}

### Create Institute (Admin Only)
POST /api/institute

Body:
{
  "InstituteName": "Stanford University",
  "InstituteImage": "stanford.jpg",
  "InstituteDescription": "Stanford University description",
  "InstituteCoOrdinatorID": "60d21b4667d0d8992e610c85"
}

Required Fields: InstituteName, InstituteCoOrdinatorID

Response:
{
  "message": "Institute created successfully",
  "institute": {
    "_id": "60d21b4667d0d8992e610c87",
    "InstituteName": "Stanford University",
    "InstituteImage": "stanford.jpg",
    "InstituteDescription": "Stanford University description",
    "InstituteCoOrdinatorID": "60d21b4667d0d8992e610c85",
    "ModifiedBy": "60d21b4667d0d8992e610c85",
    "createdAt": "2023-01-15T10:30:00.000Z",
    "updatedAt": "2023-01-15T10:30:00.000Z"
  }
}

### Update Institute (Admin Only)
PATCH /api/institute/:id

Body: Any fields to update
{
  "InstituteName": "Stanford University Updated",
  "InstituteDescription": "Updated description"
}

Response:
{
  "message": "Institute updated successfully",
  "updatedInstitute": {
    "_id": "60d21b4667d0d8992e610c87",
    "InstituteName": "Stanford University Updated",
    "InstituteImage": "stanford.jpg",
    "InstituteDescription": "Updated description",
    "InstituteCoOrdinatorID": "60d21b4667d0d8992e610c85",
    "ModifiedBy": "60d21b4667d0d8992e610c85",
    "createdAt": "2023-01-15T10:30:00.000Z",
    "updatedAt": "2023-01-16T11:30:00.000Z"
  }
}

### Delete Institute (Admin Only)
DELETE /api/institute/:id

Response:
{
  "message": "Institute deleted successfully",
  "deletedInstitute": {
    "_id": "60d21b4667d0d8992e610c87",
    "InstituteName": "Stanford University",
    "InstituteImage": "stanford.jpg",
    "InstituteDescription": "Stanford University description",
    "InstituteCoOrdinatorID": "60d21b4667d0d8992e610c85",
    "ModifiedBy": "60d21b4667d0d8992e610c85",
    "createdAt": "2023-01-15T10:30:00.000Z",
    "updatedAt": "2023-01-15T10:30:00.000Z"
  }
}

## 6. Department API

### Get All Departments
GET /api/departments

Response:
{
  "departments": [
    {
      "_id": "60d21b4667d0d8992e610c88",
      "DepartmentName": "Computer Science",
      "DepartmentImage": "cs.jpg",
      "DepartmentDescription": "CS Department",
      "InstituteID": "60d21b4667d0d8992e610c86",
      "DepartmentCoOrdinatorID": "60d21b4667d0d8992e610c85",
      "ModifiedBy": "60d21b4667d0d8992e610c85",
      "createdAt": "2023-01-15T10:30:00.000Z",
      "updatedAt": "2023-01-15T10:30:00.000Z"
    }
  ]
}

### Get Departments by Institute
GET /api/departments/:instituteId/departments

Example: GET /api/departments/60d21b4667d0d8992e610c86/departments

Response:
{
  "departments": [
    {
      "_id": "60d21b4667d0d8992e610c88",
      "DepartmentName": "Computer Science",
      "DepartmentImage": "cs.jpg",
      "DepartmentDescription": "CS Department",
      "InstituteID": "60d21b4667d0d8992e610c86",
      "DepartmentCoOrdinatorID": {
        "_id": "60d21b4667d0d8992e610c85",
        "UserName": "John Doe",
        "EmailAddress": "john@example.com"
      },
      "ModifiedBy": "60d21b4667d0d8992e610c85",
      "createdAt": "2023-01-15T10:30:00.000Z",
      "updatedAt": "2023-01-15T10:30:00.000Z"
    }
  ]
}

### Create Department
POST /api/departments

Permissions: Admin OR Institute Coordinator

Body:
{
  "DepartmentName": "Electrical Engineering",
  "DepartmentImage": "ee.jpg",
  "DepartmentDescription": "EE Department",
  "InstituteID": "60d21b4667d0d8992e610c86",
  "DepartmentCoOrdinatorID": "60d21b4667d0d8992e610c85"
}

Required Fields: DepartmentName, InstituteID, DepartmentCoOrdinatorID

Response:
{
  "message": "Department registered successfully",
  "department": {
    "_id": "60d21b4667d0d8992e610c89",
    "DepartmentName": "Electrical Engineering",
    "DepartmentImage": "ee.jpg",
    "DepartmentDescription": "EE Department",
    "InstituteID": "60d21b4667d0d8992e610c86",
    "DepartmentCoOrdinatorID": "60d21b4667d0d8992e610c85",
    "ModifiedBy": "60d21b4667d0d8992e610c85",
    "createdAt": "2023-01-15T10:30:00.000Z",
    "updatedAt": "2023-01-15T10:30:00.000Z"
  }
}

### Update Department
PATCH /api/departments/:id

Permissions: Admin OR Department Coordinator

Body (partial updates):
{
  "DepartmentName": "Updated EE Department",
  "DepartmentDescription": "Updated description"
}

Response:
{
  "message": "Department Updated",
  "updatedDepartment": {
    "_id": "60d21b4667d0d8992e610c89",
    "DepartmentName": "Updated EE Department",
    "DepartmentImage": "ee.jpg",
    "DepartmentDescription": "Updated description",
    "InstituteID": "60d21b4667d0d8992e610c86",
    "DepartmentCoOrdinatorID": "60d21b4667d0d8992e610c85",
    "ModifiedBy": "60d21b4667d0d8992e610c85",
    "createdAt": "2023-01-15T10:30:00.000Z",
    "updatedAt": "2023-01-16T11:30:00.000Z"
  }
}

### Delete Department (Admin Only)
DELETE /api/departments/:id

Response:
{
  "message": "Department Deleted Successfully",
  "deletedDepartment": {
    "_id": "60d21b4667d0d8992e610c89",
    "DepartmentName": "Electrical Engineering",
    "DepartmentImage": "ee.jpg",
    "DepartmentDescription": "EE Department",
    "InstituteID": "60d21b4667d0d8992e610c86",
    "DepartmentCoOrdinatorID": "60d21b4667d0d8992e610c85",
    "ModifiedBy": "60d21b4667d0d8992e610c85",
    "createdAt": "2023-01-15T10:30:00.000Z",
    "updatedAt": "2023-01-15T10:30:00.000Z"
  }
}

## 7. Event API

### Get All Events
GET /api/events

Response:
{
  "events": [
    {
      "_id": "60d21b4667d0d8992e610c90",
      "EventName": "Coding Competition",
      "EventTagline": "Code your way to victory",
      "EventImage": "coding.jpg",
      "EventDescription": "Annual coding competition",
      "GroupMinParticipants": 1,
      "GroupMaxParticipants": 3,
      "EventFees": 100,
      "EventFirstPrice": 5000,
      "EventSecondPrice": 3000,
      "EventThirdPrice": 1000,
      "DepartmentID": "60d21b4667d0d8992e610c88",
      "EventCoOrdinatorID": "60d21b4667d0d8992e610c85",
      "EventMainStudentCoOrdinatorName": "Alice",
      "EventMainStudentCoOrdinatorPhone": "9876543210",
      "EventMainStudentCoOrdinatorEmail": "alice@example.com",
      "EventLocation": "Main Auditorium",
      "MaxGroupsAllowed": 20,
      "ModifiedBy": "60d21b4667d0d8992e610c85",
      "createdAt": "2023-01-15T10:30:00.000Z",
      "updatedAt": "2023-01-15T10:30:00.000Z"
    }
  ]
}

### Get Events by Department
GET /api/events/:id/events

Example: GET /api/events/60d21b4667d0d8992e610c88/events

Response: Same format as above with populated coordinator details

### Get Single Event
GET /api/events/:id

Example: GET /api/events/60d21b4667d0d8992e610c90

### Create Event
POST /api/events

Permissions: Admin OR Department Coordinator

Body:
{
  "EventName": "Robotics Workshop",
  "EventTagline": "Build your own robot",
  "EventImage": "robotics.jpg",
  "EventDescription": "Hands-on robotics workshop",
  "GroupMinParticipants": 2,
  "GroupMaxParticipants": 4,
  "EventFees": 200,
  "EventFirstPrice": 10000,
  "EventSecondPrice": 5000,
  "EventThirdPrice": 2000,
  "DepartmentID": "60d21b4667d0d8992e610c88",
  "EventCoOrdinatorID": "60d21b4667d0d8992e610c85",
  "EventMainStudentCoOrdinatorName": "Bob",
  "EventMainStudentCoOrdinatorPhone": "9876543211",
  "EventMainStudentCoOrdinatorEmail": "bob@example.com",
  "EventLocation": "Lab 5",
  "MaxGroupsAllowed": 15
}

Required Fields: EventName, DepartmentID, EventCoOrdinatorID

Validation: GroupMinParticipants must be ≤ GroupMaxParticipants

### Update Event
PATCH /api/events/:id

Permissions: Admin OR Event Coordinator

Body (partial updates):
{
  "EventName": "Updated Robotics Workshop",
  "EventFees": 250,
  "MaxGroupsAllowed": 20
}

### Delete Event (Admin Only)
DELETE /api/events/:id

### Get Groups for Event
GET /api/events/:id/groups

Permissions: Admin OR Event Coordinator

Example: GET /api/events/60d21b4667d0d8992e610c90/groups

Response:
{
  "groups": [
    {
      "_id": "60d21b4667d0d8992e610c91",
      "GroupName": "Team Alpha",
      "EventID": "60d21b4667d0d8992e610c90",
      "IsPaymentDone": true,
      "IsPresent": true,
      "ModifiedBy": "60d21b4667d0d8992e610c85",
      "createdAt": "2023-01-15T10:30:00.000Z",
      "updatedAt": "2023-01-15T10:30:00.000Z"
    }
  ]
}

### Create Group for Event
POST /api/events/:id/groups

Body:
{
  "GroupName": "Team Beta"
}

Required Fields: GroupName

Note: Cannot exceed MaxGroupsAllowed for the event

### Get Event Winners
GET /api/events/:id/winners

Example: GET /api/events/60d21b4667d0d8992e610c90/winners

Response:
{
  "id": "60d21b4667d0d8992e610c90",
  "winners": [
    {
      "_id": "60d21b4667d0d8992e610c95",
      "EventID": {
        "_id": "60d21b4667d0d8992e610c90",
        "EventName": "Coding Competition",
        "EventFees": 100
      },
      "GroupID": {
        "_id": "60d21b4667d0d8992e610c91",
        "GroupName": "Team Alpha"
      },
      "sequence": 1,
      "ModifiedBy": "60d21b4667d0d8992e610c85",
      "createdAt": "2023-01-15T10:30:00.000Z",
      "updatedAt": "2023-01-15T10:30:00.000Z"
    }
  ]
}

### Declare Event Winner
POST /api/events/:id/winners

Permissions: Admin OR Event Coordinator

Body:
{
  "GroupID": "60d21b4667d0d8992e610c91",
  "sequence": 1
}

Rules:
- sequence must be 1, 2, or 3 (1st, 2nd, 3rd place)
- Group must belong to the event
- Cannot declare same position twice
- Group cannot win multiple positions

## 8. Group API

### Get Group Details
GET /api/groups/:id

Permissions: Admin OR Group Leader OR Event Coordinator

Example: GET /api/groups/60d21b4667d0d8992e610c91

Response: Group details with populated Event and ModifiedBy

### Update Group
PATCH /api/groups/:id

Permissions: Admin OR Event Coordinator

Body:
{
  "GroupName": "Updated Team Name",
  "IsPaymentDone": true,
  "IsPresent": false
}

### Delete Group
DELETE /api/groups/:id

Permissions: Admin OR Group Leader

Note: Also deletes all participants in the group

### Get Group Participants
GET /api/groups/:id/participants

Permissions: Admin OR Group Leader OR Event Coordinator

Example: GET /api/groups/60d21b4667d0d8992e610c91/participants

Response:
{
  "participants": [
    {
      "_id": "60d21b4667d0d8992e610c92",
      "ParticipantName": "Charlie",
      "ParticipantEnrollmentNumber": "EN12345",
      "ParticipantInstituteName": "MIT",
      "ParticipantCity": "Boston",
      "ParticipantMobile": "9876543212",
      "ParticipantEmail": "charlie@example.com",
      "IsGroupLeader": true,
      "GroupID": "60d21b4667d0d8992e610c91",
      "ModifiedBy": {
        "_id": "60d21b4667d0d8992e610c85",
        "UserName": "John Doe",
        "EmailAddress": "john@example.com"
      },
      "createdAt": "2023-01-15T10:30:00.000Z",
      "updatedAt": "2023-01-15T10:30:00.000Z"
    }
  ]
}

### Add Participant to Group
POST /api/groups/:id/participants

Permissions: Group Leader only

Body:
{
  "ParticipantName": "David",
  "ParticipantEnrollmentNumber": "EN12346",
  "ParticipantInstituteName": "MIT",
  "ParticipantCity": "Boston",
  "ParticipantMobile": "9876543213",
  "ParticipantEmail": "david@example.com"
}

Required Fields: ParticipantName, ParticipantEnrollmentNumber

Note: Enrollment number must be unique

### Get All Participants (Registry View)
GET /api/participants

Permissions: Admin Only

Response:
Returns a full list of all participants with deep population:
- GroupID
- EventID
- DepartmentID
- InstituteID

Notes: This is used for the master Participant Registry and supports cross-event data analysis.

## 9. Participant API

### Update Participant
PATCH /api/participants/:id

Permissions: Group Leader OR Event Coordinator

Body (partial updates):
{
  "ParticipantName": "Updated Name",
  "ParticipantMobile": "9876543214",
  "IsGroupLeader": true
}

### Delete Participant
DELETE /api/participants/:id

Permissions: Admin OR Group Leader OR Event Coordinator

Notes: Administrators have master permission to delete any participant entry.

## 10. Winner Management API

### Update Winner Position
PATCH /api/winners/:id

Permissions: Admin OR Event Coordinator

Body:
{
  "sequence": 2
}

Note: sequence must be 1, 2, or 3

### Delete Winner (Admin Only)
DELETE /api/winners/:id

## 11. Data Models Reference

### User
{
  UserName: String,          // Required
  UserPassword: String,      // Required (hashed)
  EmailAddress: String,      // Required, Unique
  PhoneNumber: String,       // Required
  isAdmin: Boolean          // Default: false
}

### Institute
{
  InstituteName: String,     // Required
  InstituteImage: String,
  InstituteDescription: String,
  InstituteCoOrdinatorID: ObjectId,  // Required, references User
  ModifiedBy: ObjectId       // References User
}

### Department
{
  DepartmentName: String,    // Required
  DepartmentImage: String,
  DepartmentDescription: String,
  InstituteID: ObjectId,     // Required, references Institute
  DepartmentCoOrdinatorID: ObjectId, // Required, references User
  ModifiedBy: ObjectId       // References User
}

### Event
{
  EventName: String,         // Required
  EventTagline: String,
  EventImage: String,
  EventDescription: String,
  GroupMinParticipants: Number, // Required
  GroupMaxParticipants: Number, // Required
  EventFees: Number,         // Default: 0
  EventFirstPrice: Number,
  EventSecondPrice: Number,
  EventThirdPrice: Number,
  DepartmentID: ObjectId,    // Required, references Department
  EventCoOrdinatorID: ObjectId, // Required, references User
  EventMainStudentCoOrdinatorName: String,
  EventMainStudentCoOrdinatorPhone: String,
  EventMainStudentCoOrdinatorEmail: String,
  EventLocation: String,
  MaxGroupsAllowed: Number,  // Required
  ModifiedBy: ObjectId       // References User
}

### Group
{
  GroupName: String,         // Required
  EventID: ObjectId,         // Required, references Event
  IsPaymentDone: Boolean,
  IsPresent: Boolean,
  ModifiedBy: ObjectId       // References User
}

### Participant
{
  ParticipantName: String,   // Required
  ParticipantEnrollmentNumber: String, // Required, Unique
  ParticipantInstituteName: String,
  ParticipantCity: String,
  ParticipantMobile: String,
  ParticipantEmail: String,
  IsGroupLeader: Boolean,    // Default: false
  GroupID: ObjectId,         // Required, references Group
  ModifiedBy: ObjectId       // References User
}

### EventWiseWinners
{
  EventID: ObjectId,         // Required, references Event
  GroupID: ObjectId,         // Required, references Group
  sequence: Number,          // Required (1, 2, or 3)
  ModifiedBy: ObjectId       // References User
}

## 12. Error Codes & Messages

Status Code | Message | Meaning
------------|---------|---------
200 | Success | Request completed successfully
201 | Created | Resource created successfully
400 | Bad Request | Invalid input/parameters
401 | Authentication required | Not logged in
403 | Unauthorized/Access denied | No permission
404 | Not found | Resource doesn't exist
409 | Conflict | Already exists/duplicate
500 | Internal Server Error | Server error

## 13. Best Practices for Frontend Developers

1. Always Handle These Cases:
// Check response status
if (response.status === 401) {
  // Redirect to login
}
if (response.status === 403) {
  // Show "Access Denied" message
}
if (response.status === 404) {
  // Show "Not Found" message
}

2. Store IDs Properly:
- All IDs are MongoDB ObjectIds (24-character hex strings)
- Always validate IDs before sending requests

3. Form Validation:
- Check required fields before submission
- Validate email format
- Ensure phone numbers are strings

4. Loading States:
- Show loading indicators during API calls
- Disable buttons while requests are in progress

5. Error Messages:
- Display user-friendly error messages
- Log technical errors for debugging

## 14. API Flow Examples

Scenario 1: Creating an Event
1. POST /api/auth/login
2. GET /api/institute (to get institute list)
3. GET /api/departments/:instituteId/departments
4. POST /api/events

Scenario 2: Registering a Group
1. POST /api/auth/login
2. GET /api/events (to browse events)
3. POST /api/events/:eventId/groups
4. POST /api/groups/:groupId/participants (add yourself as leader)
5. POST /api/groups/:groupId/participants (add team members)

Scenario 3: Declaring Winners
1. POST /api/auth/login (as admin/coordinator)
2. GET /api/events/:eventId/groups (view groups)
3. POST /api/events/:eventId/winners (declare 1st, 2nd, 3rd)

## 15. Common Questions (FAQ)

Q: How do I know if I'm an admin?
A: After login, check /api/auth/me - the response includes isAdmin field

Q: Can a user be coordinator for multiple departments?
A: Yes, a user can coordinate multiple departments/institutes

Q: How do I change a group leader?
A: Update the participant with IsGroupLeader: true using PATCH /api/participants/:id

Q: What happens when an event is deleted?
A: All groups and participants for that event are also deleted

Q: Can participants be in multiple groups?
A: No, each participant has a unique enrollment number and belongs to one group

## 16. Testing the API

Using Postman/Insomnia:
1. Set base URL: http://localhost:5000/api
2. Register a user first
3. Login to get token (automatically in cookies)
4. Test other endpoints

Sample Test Data:
// For testing admin functionality:
{
  "UserName": "Admin User",
  "UserPassword": "admin123",
  "EmailAddress": "admin@test.com",
  "PhoneNumber": "9999999999",
  "isAdmin": true
}

## 17. Support

If you encounter issues:
1. Check the error message
2. Verify you're logged in
3. Check your permissions
4. Validate all required fields
5. Ensure IDs are valid ObjectIds

For backend-specific issues, contact your backend team with:
- The endpoint you're calling
- Request body/parameters
- Error message received
- What you expected to happen

---

Happy Coding! 🚀