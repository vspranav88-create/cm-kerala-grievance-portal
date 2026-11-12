# Database Design

MongoDB stores the application data in four Mongoose collections. ObjectId references connect grievances to their citizens, departments, and assigned officers.

## Entity relationship diagram

```mermaid
erDiagram
  USER ||--o{ GRIEVANCE : submits
  DEPARTMENT ||--o{ USER : has_officers
  DEPARTMENT ||--o{ GRIEVANCE : receives
  USER ||--o{ GRIEVANCE : handles_as_officer
  USER ||--o{ GRIEVANCE : reviews_as_cmo
  GRIEVANCE ||--o{ ASSIGNMENT : records
  GRIEVANCE ||--o{ HISTORY_ENTRY : tracks
  USER ||--o{ CONTACT_ENQUIRY : may_submit

  USER {
    ObjectId _id
    string name
    string email
    string mobile
    string password_hash
    string role
    ObjectId department
  }
  DEPARTMENT {
    ObjectId _id
    string name
    string code
    string category
    string description
  }
  GRIEVANCE {
    ObjectId _id
    string refId
    ObjectId citizen
    string district
    string category
    string subject
    string description
    string priority
    string status
    ObjectId department
    ObjectId officer
    date dueDate
    boolean escalated
    object aiSuggestion
    object actionReport
    object feedback
  }
  ASSIGNMENT {
    ObjectId department
    ObjectId officer
    ObjectId assignedBy
    string remark
    date at
  }
  HISTORY_ENTRY {
    string action
    string status
    string remark
    ObjectId by
    string byName
    string byRole
    date at
  }
  CONTACT_ENQUIRY {
    ObjectId _id
    string name
    string email
    string subject
    string message
    date createdAt
  }
```

## Collection notes

- **User**: Citizen, CMO, or officer account. Password is hashed by a Mongoose pre-save hook; it is never returned by the authentication response.
- **Department**: Government department catalogue. Officer accounts reference their department.
- **Grievance**: Main complaint record with reference ID, status, priority, current assignment, AI suggestion, attachments, action report, feedback, internal remarks, and embedded history/assignment records.
- **Contact**: Public contact form enquiries.

The diagram shows logical relations. `Assignment` and `HistoryEntry` are embedded subdocuments inside each grievance, not separate MongoDB collections.
