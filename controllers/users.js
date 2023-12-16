const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { error } = require("../utils/logger");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    url: 1,
    likes: 1,
  });
  res.status(200).json(users);
});

usersRouter.post("/", async (req, res) => {
  const { userName, name, password } = req.body;
  if (!password) {
    return res
      .status(400)
      .json({ error: "Username and Password are required" });
  }
  if (password.length < 3) {
    return res.status(400).json({
      error: "UserName and Password must be atleast 3 characters long",
    });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({
    userName,
    name,
    passwordHash,
  });
  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

module.exports = usersRouter;

// const usersRouter = require("express").Router();
// const User = require("../models/user");
// const bcrypt = require("bcrypt");
// const { error } = require("../utils/logger");

// usersRouter.get("/", async (req, res) => {
//   const users = await User.find({}).populate("blogs", {
//     title: 1,
//     url: 1,
//     likes: 1,
//   });
//   res.status(200).json(users);
// });

// usersRouter.post("/", async (req, res) => {
//   const {
//     userName,
//     name,
//     password,
//     EmployeeName,
//     departments,
//     departmentNumber,
//     salary,
//   } = req.body;
//   if (!password) {
//     return res
//       .status(400)
//       .json({ error: "Username and Password are required" });
//   }
//   if (password.length < 3) {
//     return res.status(400).json({
//       error: "UserName and Password must be atleast 3 characters long",
//     });
//   }
//   const saltRounds = 10;
//   const passwordHash = await bcrypt.hash(password, saltRounds);
//   const user = new User({
//     userName,
//     name,
//     passwordHash,
//     EmployeeName,
//     departments,
//     departmentNumber,
//     salary,
//   });
//   const savedUser = await user.save();
//   res.status(201).json(savedUser);
// });

// // defining a router for deleting multiple documents
// // usersRouter.delete("/", async (req, res) => {
// //   // send array of Ids
// //   const { userIds } = req.body;

// //   if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
// //     return res.status(400).json({ error: "Invalid input for deleting users" });
// //   }

// //   try {
// //     await User.deleteMany({ _id: { $in: userIds } });
// //     res.status(204).end();
// //   } catch (error) {
// //     console.error("Error deleting users:", error);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });

// usersRouter.delete("/:departmentNumber", async (req, res) => {
//   const id = req.params.departmentNumber;

//   try {
//     await User.deleteMany({ departmentNumber: id });
//     res.status(204).end();
//   } catch (error) {
//     console.error("Error deleting users:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Calculate sum of salaries for a specific department
// usersRouter.get("/salary/:department", async (req, res) => {
//   const { department } = req.params;

//   try {
//     const sumOfSalaries = await User.aggregate([
//       { $match: { departments: department } },
//       { $group: { _id: null, total: { $sum: "$salary" } } },
//     ]);

//     if (sumOfSalaries.length > 0) {
//       res.status(200).json({ sumOfSalaries: sumOfSalaries[0].total });
//     } else {
//       res.status(404).json({ error: "Department not found" });
//     }
//   } catch (error) {
//     console.error("Error calculating sum of salaries:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Total number of employees work in a same department
// usersRouter.get("/count/:department", async (req, res) => {
//   const { department } = req.params;

//   try {
//     const employeeCount = await User.countDocuments({
//       departments: department,
//     });

//     res.status(200).json({ employeeCount });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// module.exports = usersRouter;
