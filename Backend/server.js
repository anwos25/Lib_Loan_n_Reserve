import express from "express";
import cors from "cors";
import { initDB } from "./src/models/db.js";
import { validateFields, isAdmin } from "./src/middleware/middleware.js";
import {
  registerUser,
  loginUser,
  addItem,
  addRoom,
  getRooms,
  getSchedule,
  bookRoom,
  getItems,
  getQueue,
  getLoans,
  sendNotification,
  getNotifications,
  markNotificationsAsRead,
  updateBookingStatus,
  getSettings,
  updateSettings,
  getUser,
  loanItems,
  getBorrowedItems,
  addLoan,
} from "./src/routes/userRoutes.js";
import { returnLoan } from "./src/routes/userRoutes.js";


const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());

initDB();

app.post(
  "/register",
  validateFields(["name", "username", "phone", "password"]),
  registerUser
);
app.post("/login", validateFields(["username", "password"]), loginUser);
app.get("/user", getUser);

app.post(
  "/admin/items",
  [
    isAdmin,
    validateFields([
      "name",
      "description",
      "available_quantity",
      "total_quantity",
    ]),
  ],
  addItem
);
app.post(
  "/admin/rooms",
  [isAdmin, validateFields(["room_name", "capacity"])],
  addRoom
);
app.get("/rooms", getRooms);
app.get("/schedule", getSchedule);
app.post(
  "/book",
  validateFields([
    "user_id",
    "booking_date",
    "room_id",
    "start_time",
    "end_time",
  ]),
  bookRoom
);
app.post(
  "/loans",
  validateFields([
    "user_id",
    "item_id",
    "quantity",
    "borrow_date",
    "return_date",
  ]),
  loanItems
);

app.get("/loans/borrowed/:user_id", getBorrowedItems);


app.get("/items", getItems);
app.get("/queue/:itemId", getQueue);
app.get("/loans/:userId", getLoans);
app.get("/notifications/:userId", getNotifications);
app.post(
  "/notifications/send",
  validateFields(["user_id", "message"]),
  sendNotification
);
app.post(
  "/notifications/read/:user_id",
  validateFields(["user_id"]),
  markNotificationsAsRead
);
app.post(
  "/bookings/update-status",
  validateFields(["booking_id", "status"]),
  updateBookingStatus
);
app.get("/settings/:user_id", getSettings);
app.post(
  "/settings",
  validateFields(["user_id", "theme", "notifications_enabled"]),
  updateSettings
);

// Start serve
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.post('/update-settings', async (req, res) => {
  const { user_id, theme, notifications_enabled } = req.body;

  try {
    const result = await db.run(
      'UPDATE Users SET theme = ?, notifications_enabled = ? WHERE id = ?',
      [theme, notifications_enabled, user_id]
    );
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});
app.post(
  "/add-loan",
  validateFields([
    "user_id",
    "item_id",
    "status",
    "borrow_date",
    "return_date",
  ]),
  addLoan
);

app.post(
  "/return-loan",
  validateFields(["loan_id", "item_id"]),
  returnLoan
);
