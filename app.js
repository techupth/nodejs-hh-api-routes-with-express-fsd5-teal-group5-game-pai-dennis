// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let assignmentsDatabase = assignments;
let commentsDatabase = comments;

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

//Get assignments
app.get("/assignments", (req, res) => {
  const limit = req.query.limit;

  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request. Can get data up to 10 assignment per request",
    });
  }

  const assignments = assignmentsDatabase.slice(0, limit);

  return res.json({
    data: { assignments },
  });
});

//Get assignment by id
app.get("/assignments/:assignmentsId", (req, res) => {
  const inputAssignmentId = Number(req.params.assignmentsId);

  const assignments = assignmentsDatabase.filter(
    (item) => item.id === inputAssignmentId
  );

  return res.json({
    data: assignments[0],
  });
});

//add new assignment
app.post("/assignments", (req, res) => {
  const index = assignmentsDatabase[assignmentsDatabase.length - 1].id + 1;
  assignmentsDatabase.push({ id: index, ...req.body });

  return res.json({
    message: "New assignment has been created successfully",
    data: req.body,
  });
});

//delete assignment
app.delete("/assignments/:assignmentsId", (req, res) => {
  const inputAssignmentId = Number(req.params.assignmentsId);

  assignmentsDatabase = assignmentsDatabase.filter((item) => {
    return item.id != inputAssignmentId;
  });

  return res.json({
    message: `Assignment Id : ${inputAssignmentId}  has been deleted successfully`,
  });
});

//update assignment
app.put("/assignments/:assignmentsId", (req, res) => {
  const inputAssignmentId = Number(req.params.assignmentsId);
  const assignmentIndex = assignmentsDatabase.findIndex(
    (item) => item.id === inputAssignmentId
  );

  assignmentsDatabase[assignmentIndex] = { id: inputAssignmentId, ...req.body };

  return res.json({
    message: `Assignment Id : ${inputAssignmentId}  has been updated successfully`,
    data: assignmentsDatabase[assignmentIndex],
  });
});


//get comment by assignmentID
app.get("/assignments/:assignmentsId/comments", (req, res) => {
  const inputAssignmentId = Number(req.params.assignmentsId);

  const comments = commentsDatabase.filter(
    (item) => item.assignmentId === inputAssignmentId
  );

  return res.json({
    message: "Complete fetching comments",
    data: comments,
  });
});



app.post("/assignments/:assignmentsId/comments", (req, res) => {
    const inputAssignmentId = Number(req.params.assignmentsId);
  
    const currentId = commentsDatabase[commentsDatabase.length-1].id;

    commentsDatabase.push({
        id : currentId+1,
        ...req.body,
    })
  
    return res.json({
        message: "New comment has been created successfully",
        data: commentsDatabase[commentsDatabase.length-1],
    });
  });