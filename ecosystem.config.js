module.exports = {
  apps: [
    {
      name: "b",
      script: "npm",
      args: "start",
      cwd: "./v2/b",
    },
    {
      name: "f",
      script: "npm",
      args: "start",
      cwd: "./v2/f",
      interpreter: "none",
    },
  ],
};
