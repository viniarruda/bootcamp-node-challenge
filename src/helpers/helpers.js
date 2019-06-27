export const validateTaskRequest = (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    return res.json({ error: "Title is required" });
  }

  return next();
};

export const validatePostRequest = (req, res, next) => {
  const { id, title } = req.body;

  if (!title || !id) {
    return res.json({ error: "Id and title is required" });
  }

  return next();
};

export const validateProjectExist = (req, res, next) => {
  const { id } = req.params;

  const findProject = projects.some(p => p.id === id);

  if (!findProject) {
    return res.json({ error: "Project does not exist" });
  }

  return next();
};
