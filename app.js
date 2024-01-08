// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";
const app = express();
const port = 4000;
let assignmentsData = assignments;
let commentsData = comments;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// get all assignments with limit
app.get("/assignments", (req, res) => {
  const limit = req.query.limit || 10;

  const assignmentsWithLimit = assignmentsData.slice(0, limit);
  limit <= 10
    ? res.json({
        message: "Complete Fetching assignments",
        data: assignmentsWithLimit,
      })
    : res.status(401).json({
        message: "Invalid request. Can fetch up to 10 posts per request.",
      });
});

// get an assignments with id
app.get("/:assignments/:assignmentsId", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  let assignmentsById = assignmentsData.filter((assignment) => {
    return assignment.id === assignmentsIdFromClient;
  });
  !assignmentsById[0]
    ? res.json({ message: `Not Found an id ${assignmentsIdFromClient}` })
    : res.json({
        message: "Complete Fetching assignments",
        data: assignmentsById[0],
      });
});

// create new assignment
app.post("/assignments", (req, res) => {
  if (!req.body.title || !req.body.categories || !req.body.description) {
    return res.status(418).json({
      message: "Server cannot brew a coffee.",
    });
  }

  const newAssignment = {
    id: assignmentsData[assignmentsData.length - 1]?.id + 1 || 1,
    title: req.body.title,
    categories: req.body.categories,
    description: req.body.description,
  };
  assignmentsData.push(newAssignment);

  return res.json({
    message: "New assignment has been created successfully",
    data: newAssignment,
  });
});

// update an assignment
app.put("/assignments/:assignmentId", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentId);
  const assignmentIndex = assignmentsData.findIndex((assignment) => {
    return assignment.id === assignmentsIdFromClient;
  });

  if (
    !req.body.title ||
    !req.body.categories ||
    !req.body.description ||
    assignmentIndex === -1
  ) {
    return res.json({
      message: "Cannot update, No data available!",
    });
  } else {
    assignmentsData[assignmentIndex] = {
      id: assignmentsIdFromClient,
      ...req.body,
    };
    return res.json({
      message: `Assignment Id : ${assignmentsIdFromClient}  has been updated successfully`,
      data: assignmentsData[assignmentIndex],
    });
  }
});

// delete an assignment
app.delete("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  const assignmentIndex = assignmentsData.findIndex(
    (assignment) => assignment.id === assignmentsIdFromClient
  );
  console.log(assignmentIndex);

  if (assignmentIndex === -1)
    return res.json({
      message: "Cannot delete, No data available!",
    });
  const newAssignmentsData = assignmentsData.filter((assignment) => {
    return assignment.id !== assignmentsIdFromClient;
  });

  assignmentsData = newAssignmentsData;

  return res.json({
    message: `Assignment Id : ${assignmentsIdFromClient} has been deleted successfully`,
  });
});

// delete all
app.delete("/assignments/delete/all", (req, res) => {
  let newAssignmentsData = [];
  assignmentsData = newAssignmentsData;

  return res.json({
    message: `Deleted successfully`,
  });
});

// OPTIONAL
app.get("/assignments/:assignmentsId/comments", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  let commentInAssignmentsId = commentsData.filter((comment) => {
    return comment.assignmentId === assignmentsIdFromClient;
  });

  if (commentInAssignmentsId.length === 0) {
    return res.json({
      message: `Not found data in id ${assignmentsIdFromClient}`,
    });
  } else {
    return res.json({
      message: "Complete fetching comments",
      data: commentInAssignmentsId,
    });
  }
});

// Create comment in assignment
app.post("/assignments/:assignmentsId/comments", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  const index = assignmentsData.findIndex((assignment) => {
    return assignment.id === assignmentsIdFromClient;
  });

  if (index === -1) {
    return res.json({
      message: `Please add an assignment id ${assignmentsIdFromClient}`,
    });
  }

  let newComment = {
    id: commentsData[commentsData.length - 1]?.id + 1 || 1,
    assignmentId: assignmentsIdFromClient,
    content: req.body.content,
  };

  commentsData = [...commentsData, newComment];
  return res.json({
    message: "New comment has been created successfully",
    data: newComment,
  });
});

// listen to the port
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
