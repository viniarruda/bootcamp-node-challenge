const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const projects = [];
let numberOfRequests = 0;

const logRequests = (req, res, next) => {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
};

app.use(logRequests);

const validateTaskRequest = (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  return next();
};

const validatePostRequest = (req, res, next) => {
  const { id, title } = req.body;

  if (!title || !id) {
    return res.status(400).json({ error: "Id and title is required" });
  }

  return next();
};

const validateProjectExist = (req, res, next) => {
  const { id } = req.params;

  const findProject = projects.some(p => p.id === id);

  if (!findProject) {
    return res.status(400).json({ error: "Project does not exist" });
  }

  return next();
};

const validateProjectId = (req, res, next) => {
  const { id } = req.body;

  const findProject = projects.some(p => p.id === id);

  if (findProject) {
    return res
      .status(400)
      .json({ error: `Project ${id} exist, try using other id` });
  }

  return next();
};

app.post("/projects", validateProjectId, validatePostRequest, (req, res) => {
  const { id, title } = req.body;

  const newProject = {
    id: id,
    title: title,
    tasks: []
  };

  projects.push(newProject);

  return res.json({ message: "Project created", project: newProject });
});

app.get("/projects", (req, res) => {
  return res.json({
    projects: projects
  });
});

app.put("/projects/:id", validateProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json({
    message: `Project ${id} att`,
    project: project
  });
});

app.delete("/projects/:id", (req, res) => {
  const { id } = req.params;

  projects.map(p => {
    if (p.id === id) {
      const index = projects.indexOf(p);
      if (index > -1) {
        projects.splice(p, 1);
      }
    }
  });

  return res.json({
    message: `Project ${id} deleted`
  });
});

app.post(
  "/projects/:id/tasks",
  validateProjectExist,
  validateTaskRequest,
  (req, res) => {
    const { title } = req.body;
    const { id } = req.params;

    const project = projects.find(p => p.id === id);

    project.tasks.push(title);

    return res.json({
      message: `Task created in project ${id}`,
      project: project
    });
  }
);

app.listen(3333);
