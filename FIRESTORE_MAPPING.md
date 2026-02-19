# Firestore to Relational Mapping (KiddoZ)

To satisfy the requirements of a hybrid NoSQL/Relational system, the following mapping is established between Firestore collections and the PostgreSQL/MySQL tables.

## Synchronization Strategy
1. **Source of Truth**: The Relational Database (RS) is the primary source of truth for ACID transactions (Enrollment, Payments).
2. **Real-time Projection**: Firestore is used as a real-time projection layer for live updates (Live View status, AI detections, Care Tasks).
3. **Dual Write**: Critical endpoints in the backend (e.g., `POST /students`) should ideally trigger a background job or a parallel write to Firestore to keep views updated without extra SQL queries.

## Collection Mapping

| Firestore Collection | SQL Table | Mapping Rational |
| --- | --- | --- |
| `users` | `parents` / `staff` | `uid` in Firebase Auth corresponds to the `id` or a mapping table in RS. |
| `students` | `students` | Basic child profiles are mirrored for parent portal access. |
| `attendance` | `attendance` | Real-time "Present/Absent" status for the Live View. |
| `care_tasks` | `DailyActivities` | Time-series data from IoT/AI events. |
| `health_records` | `health_records` | Metadata stored in SQL, binary pointers in Firestore/Storage. |
| `notifications` | `notifications` | Real-time push notifications delivered via listener. |

## Example DTO (Student)
```json
// Firestore Document: students/{studentId}
{
  "sql_id": 101, // FK to relational table
  "full_name": "Nabila Akter",
  "plan": "Growth Scholar",
  "status": "Present",
  "last_temp": "98.6"
}
```

## Implementation Note
The current `api.js` interceptor simulates a working backend. When a real database connection is established, the backend `student.js` controller should include:

```javascript
// Example sync logic (Conceptual)
async function enrollStudent(data) {
  const sqlStudent = await Student.create(data);
  await firestore.collection('students').doc(sqlStudent.id).set({
    ...data,
    sql_id: sqlStudent.id,
    syncedAt: serverTimestamp()
  });
  return sqlStudent;
}
```
