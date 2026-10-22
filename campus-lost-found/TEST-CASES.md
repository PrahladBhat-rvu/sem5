# Test Cases — Campus Lost & Found

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| TC-01 | Create student | Submit valid name, unique email, department, phone | Student saved and profile displayed |
| TC-02 | Duplicate email | Create another student using the same email | Duplicate rejected; no second profile |
| TC-03 | Invalid ID | Visit `/students/not-an-object-id` | Friendly 404 page; server remains running |
| TC-04 | Missing record | Visit `/found-items/64b000000000000000000000` when absent | Friendly 404 page |
| TC-05 | Valid lost report | Select profile and submit complete form | Report saved and details page shown |
| TC-06 | Invalid report | Submit empty/invalid fields | Validation/flash error; no report created |
| TC-07 | Empty found list | Start with no found reports | Empty-state message appears |
| TC-08 | Valid claim | Student B claims Student A's found item with a reason | Claim saved with `Pending` status |
| TC-09 | Duplicate claim | Student B submits another claim for same item | Duplicate claim blocked |
| TC-10 | Claim own item | Student A tries to claim their own found item | Request blocked |
| TC-11 | Unauthorized review | Student B submits PATCH for Student A's item claim | HTTP 403; claim/item unchanged |
| TC-12 | Approve claim | Student A approves Student B's pending claim | Claim `Approved`, item `Returned` |
| TC-13 | Reject other pending claims | Two students claim; owner approves one | Selected claim approved, other pending claims rejected |
| TC-14 | Claim returned item | Try to submit a new claim after return | Claim blocked |
| TC-15 | Invalid status | Send status other than Approved/Rejected | Request rejected |
| TC-16 | Search/filter | Search by item name/location/category | Matching database records shown |
