// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";
const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Server is running at port ${port}`));

//ex1
app.get("/assignments", (req, res) => {
  const limit = Number(req.query.limit);

  const assignmentsData = assignments.slice(0, limit);

  limit >= 1 && limit <= 10
    ? res.json({
        message: "Complete Fetching assignments",
        data: [...assignmentsData],
      })
    : limit > 10
    ? res.json({
        message: "Invalid request,limit must not exceeds 10 assignments",
      })
    : res.json({
        message: "Complete Fetching assignments",
        data: [...assignments],
      });
});

//ex2
app.get("/assignments/:assignmentsId", (req, res) => {
  const getId = req.params.assignmentsId;
  const dataWithId = assignments.filter((data) => getId == data.id);

  return res.json({
    message: "Complete Fetching assignments",
    data: [...dataWithId],
  });
});

//ex3

app.post("/assignments", (req, res) => {
  assignments.push({
    id: assignments[assignments.length - 1].id + 1,
    ...req.body,
  });
  return res.json({
    message: "New assignment has been created successfully",
  });
});

//ex4
app.delete("/assignments/:assignmentsId", (req, res) => {
  const getId = Number(req.params.assignmentsId);

  if (!assignments.some((obj) => obj.id == getId)) {
    return res.json({
      message: "Cannot delete, No data available!",
    });
  }

  const newAssignments = assignments.filter((item) => {
    return item.id !== getId;
  });

  res.json({
    message: `Assignment Id : ${getId}  has been deleted successfully`,
  });
});

//ex5
app.put("/assignments/:assignmentsId", (req, res) => {
  const getId = Number(req.params.assignmentsId);
  if (assignments.some((obj) => obj.id !== getId)) {
    return res.json({
      message: "Cannot update, No data available!",
    });
  }

  const putItem = assignments.findIndex((item) => {
    return item.id == getId;
  });

  assignments[putItem] = { id: getId, ...req.body };

  res.json({
    message: `Assignment Id : ${getId}  has been updated successfully`,
    data: assignments,
  });
});
