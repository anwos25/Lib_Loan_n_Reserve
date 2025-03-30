import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { getQuery,runQuery, allQuery } from "../models/queries.js";


export const registerUser = async (req, res) => {
  try {
    const { name, username, phone, password } = req.body;
    const hashedPassword = await argon2.hash(password);

    await runQuery(
      `INSERT INTO Users (name, username, phone, password) VALUES (?, ?, ?, ?)`,
      [name, username, phone, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// User login endpoint
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await allQuery(`SELECT * FROM Users WHERE username = ?`, [
      username,
    ]);

    if (user.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await argon2.verify(user[0].password, password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user[0].id, username: user[0].username },
      "secret",
      { expiresIn: "15m" }
    );
    res.status(200).json({ message: "Login successful", token ,user: {
      id: user[0].id,
      name: user[0].name
    }});
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const addItem = async (req, res) => {
  try {
    const { name, description, available_quantity, total_quantity } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็นต้องมี
    if (!name || !total_quantity || available_quantity === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ตรวจสอบว่า available_quantity ไม่มากกว่า total_quantity
    if (available_quantity > total_quantity) {
      return res.status(400).json({
        message: "Available quantity cannot be greater than total quantity",
      });
    }

    const sql = `INSERT INTO Items (name, description, available_quantity, total_quantity) VALUES (?, ?, ?, ?)`;
    const result = await runQuery(sql, [
      name,
      description || "",
      available_quantity,
      total_quantity,
    ]);

    res
      .status(201)
      .json({ message: "Item added successfully", item_name: name });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding item", error: error.message });
  }
};

export const addRoom = async (req, res) => {
  try {
    let { room_name, capacity } = req.body;

    // ตรวจสอบค่าที่จำเป็นต้องมี
    if (!room_name || capacity === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    room_name = room_name.trim(); // ลบช่องว่างข้างหน้าหรือท้ายออก
    capacity = Number(capacity); // แปลงให้เป็นตัวเลข

    // ตรวจสอบว่า capacity ต้องเป็นตัวเลขและมากกว่า 0
    if (isNaN(capacity) || capacity <= 0) {
      return res
        .status(400)
        .json({ message: "Capacity must be a positive number" });
    }

    const sql = `INSERT INTO Rooms (room_name, capacity, is_available) VALUES (?, ?, ?)`;
    const result = await runQuery(sql, [room_name, capacity, 1]);

    res.status(201).json({
      message: "Room added successfully",
      room_id: room_name,
      capacity,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding room", error: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const sql = "SELECT * FROM Rooms WHERE is_available = 1";
    const rooms = await allQuery(sql, []); // allQuery ต้องรองรับ Promise
    res.json(rooms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting rooms", error: error.message });
  }
};

export const getSchedule = async (req, res) => {
  try {
    const sql = `
      SELECT 
        r.room_id, 
        r.room_name, 
        rb.start_time, 
        rb.end_time, 
        COALESCE(rb.status, 'Available') AS status
      FROM Rooms r
      LEFT JOIN RoomBookings rb ON r.room_id = rb.room_id
      WHERE COALESCE(rb.status, '') != 'Booked'
    `;

    const schedule = await allQuery(sql, []);

    res.json(schedule);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting schedule", error: error.message });
  }
};

export const bookRoom = async (req, res) => {
  try {
    const { user_id, room_id, start_time, end_time, booking_date } = req.body;

    if (!user_id || !room_id || !start_time || !end_time || !booking_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ตรวจสอบว่าห้องยังว่างหรือไม่
    const checkSQL = `
      SELECT * FROM RoomBookings 
      WHERE room_id = ? AND status = 'Booked'
      AND (start_time < ? AND end_time > ?)
      
    `;

    const existingBookings = await allQuery(checkSQL, [
      room_id,
      end_time,
      start_time,
    ]);

    if (existingBookings.length > 0) {
      return res
        .status(400)
        .json({ message: "Room is already booked during this time" });
    }

    // ทำการจองห้อง
    const sql = `
      INSERT INTO RoomBookings (room_id, user_id, booking_date, start_time, end_time, status) 
      VALUES (?, ?, ?, ?, ?, 'Booked')
    `;

    const result = await runQuery(sql, [
      room_id,
      user_id,
      booking_date,
      start_time,
      end_time,
    ]);

    res.json({
      message: "Room booked successfully",
      booking_id: user_id,
      room_id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error booking room", error: error.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const sql = "SELECT id, name, available_quantity FROM Items";
    const items = await allQuery(sql, []); // allQuery ควรเป็นฟังก์ชันที่คืนค่า Promise
    res.json(items);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting items", error: error.message });
  }
};

export const getQueue = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const sql = `
      SELECT Q.position, U.name, L.due_date
      FROM Queue Q
      JOIN Users U ON Q.user_id = U.id
      LEFT JOIN Loans L ON Q.item_id = L.item_id AND L.status = 'borrowed'
      WHERE Q.item_id = ? ORDER BY Q.position ASC
    `;
    // ใช้ await กับ allQuery ที่คืนค่าผลลัพธ์เป็น Promise
    const rows = await allQuery(sql, [itemId]);

    const estimatedTime =
      rows.length > 0 ? `ประมาณ ${rows.length * 30} นาที` : "ไม่มีคิวรอ";

    res.json({ queue: rows, estimated_time: estimatedTime });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting queue", error: error.message });
  }
};

// ฟังก์ชันส่งการแจ้งเตือนเข้า Database
export const sendNotification = async (req, res) => {
  try {
    const { user_id, message } = req.body; // ดึงค่าจาก request body

    const sql = `INSERT INTO Notifications (user_id, message) VALUES (?, ?)`;
    await runQuery(sql, [user_id, message]); // รอให้คำสั่ง SQL ทำงานเสร็จ

    console.log("Notification sent:", message);

    res.json({ success: true, message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending notification:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// API ดึงการแจ้งเตือนของผู้ใช้
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const sql = `SELECT notification_id, message, sent_at, is_read FROM Notifications WHERE user_id = ? ORDER BY sent_at DESC`;
    const notifications = await allQuery(sql, [userId]);
    res.json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting notifications", error: error.message });
  }
};

// API อัปเดตการอ่านแจ้งเตือน
export const markNotificationsAsRead = async (req, res) => {
  try {
    const { user_id } = req.params;
    const sql = `UPDATE Notifications SET is_read = TRUE WHERE user_id = ?`;

    const result = await runQuery(sql, [user_id]); // รอให้คำสั่ง SQL ทำงานเสร็จ

    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({
      message: "Error marking notifications as read",
      error: error.message,
    });
  }
};

// ตรวจสอบสถานะการจองเปลี่ยนแปลง
export const updateBookingStatus = async (req, res) => {
  try {
    const { booking_id, status } = req.body;

    if (!booking_id || !status) {
      return res
        .status(400)
        .json({ error: "Missing booking_id or new_status" });
    }

    // ดึง user_id ของการจองนี้ก่อน
    const checkSQL = `SELECT user_id FROM RoomBookings WHERE booking_id = ?`;
    const booking = await runQuery(checkSQL, [booking_id]);

    if (!booking || booking.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // อัปเดตสถานะการจอง
    const sql = `UPDATE RoomBookings SET status = ? WHERE booking_id = ?`;
    const result = await runQuery(sql, [status, booking_id]);

    res.json({ message: "Booking status updated" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating booking status", error: error.message });
  }
};

// API ดึงค่าการตั้งค่าของผู้ใช้
export const getSettings = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    const sql = `SELECT theme, notifications_enabled FROM Settings WHERE user_id = ?`;
    const rows = await allQuery(sql, [user_id]); // รอให้คำสั่ง SQL ทำงานเสร็จ

    if (!rows || rows.length === 0) {
      return res.json({ theme: "light", notifications_enabled: true }); // ค่าเริ่มต้น
    }

    res.json(rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting settings", error: error.message });
  }
};

// API อัปเดตการตั้งค่า
export const updateSettings = async (req, res) => {
  try {
    const { user_id, theme, notifications_enabled } = req.body; // รับค่าจาก body

    // ตรวจสอบให้แน่ใจว่ามี user_id, theme, notifications_enabled ใน request
    if (
      !user_id ||
      theme === undefined ||
      notifications_enabled === undefined
    ) {
      return res
        .status(400)
        .json({ error: "Missing userId, theme, or notifications_enabled" });
    }

    // ตรวจสอบว่ามีข้อมูลการตั้งค่าอยู่ในฐานข้อมูลหรือไม่
    const checkSQL = `SELECT * FROM Settings WHERE user_id = ?`;
    const existingSettings = await runQuery(checkSQL, [user_id]);

    if (existingSettings.length > 0) {
      // ถ้ามีข้อมูลอยู่แล้วทำการ UPDATE
      const sql = `
        UPDATE Settings
        SET theme = ?, notifications_enabled = ?
        WHERE user_id = ?
      `;
      await runQuery(sql, [theme, notifications_enabled, user_id]);
    } else {
      // ถ้าไม่มีข้อมูลทำการ INSERT
      const sql = `
        INSERT INTO Settings (user_id, theme, notifications_enabled) 
        VALUES (?, ?, ?)
      `;
      await runQuery(sql, [user_id, theme, notifications_enabled]);
    }

    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating settings", error: error.message });
  }
};

// export const loanItems = async (req, res) => {
//   const { user_id, item_id, quantity, borrow_date, return_date } = req.body;

//   console.log("REQ BODY:", req.body); // ✅ แสดงข้อมูลที่ส่งมา
//   try {
//     const sql = `
//       INSERT INTO Loans (user_id, item_id, quantity, borrow_date, due_date, status)
//       VALUES (?, ?, ?, ?, ?, 'borrowed')
//     `;
//     await runQuery(sql, [user_id, item_id, quantity, borrow_date, return_date]);

//     const updateQtySql = `
//       UPDATE Items SET available_quantity = available_quantity - ? WHERE id = ?
//     `;
//     await runQuery(updateQtySql, [quantity, item_id]);

//     console.log("✅ ยืมสำเร็จและอัปเดตจำนวนแล้ว");
//     res.json({ message: "ยืมสำเร็จ!" });
//   } catch (error) {
//     console.error("❌ ERROR:", error.message); // ✅ log error
//     res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
//   }
// };

export const loanItems = async (req, res) => {
  const { user_id, item_id, borrow_date, return_date } = req.body;

  console.log("REQ BODY:", req.body);

  try {
    const sql = `
      INSERT INTO Loans (user_id, item_id, borrow_date, due_date, status)
      VALUES (?, ?, ?, ?, 'borrowed')
    `;
    await runQuery(sql, [user_id, item_id, borrow_date, return_date]);

    // ✅ หักจำนวน 1 ชิ้นจาก item (เพราะไม่มี quantity แล้ว)
    const updateQtySql = `
      UPDATE Items SET available_quantity = available_quantity - 1 WHERE id = ?
    `;
    await runQuery(updateQtySql, [item_id]);

    console.log("✅ ยืมสำเร็จและอัปเดตจำนวนแล้ว");
    res.json({ message: "ยืมสำเร็จ!" });
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
};


export const getUser = async (req, res) => {
  try {
    const { name } = req.query;  // Get 'name' from query params
    console.log("Received name:", name);  // Debugging log

    if (!name) {
      return res.status(400).json({ message: "Name query parameter is required" });
    }

    const sql = "SELECT * FROM Users WHERE name = ?";
    const users = await allQuery(sql, [name]);

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found with the given name" });
    }

    // Remove password field from each user object
    users.forEach(user => {
      delete user.password;
    });

    res.json(users);
  } catch (error) {
    console.error("Error getting user:", error.message);  // Log error details
    res.status(500).json({ message: "Error getting user", error: error.message });
  }
};


export const getBorrowedItems = async (req, res) => {
  const { user_id } = req.params;

  console.log("Received user_id:", user_id); // เพิ่ม log เพื่อตรวจสอบค่า user_id

  try {
    const sql = `
      SELECT L.id AS loan_id, I.name, L.borrow_date, L.due_date
      FROM Loans L
      JOIN Items I ON L.item_id = I.id
      WHERE L.user_id = ? AND L.status = 'borrowed'
    `;
    const rows = await getQuery(sql, [user_id]);

    console.log("Rows returned from database:", rows);

    // ตรวจสอบว่า rows มีข้อมูลหรือไม่
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No borrowed items found" });
    }

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถโหลดข้อมูลกำลังยืม", error: error.message });
  }
};


export const getLoans = async (req, res) => {
  const { userId } = req.params; // รับ userId จาก URL

  console.log("Fetching loans for user:", userId);

  try {
    const sql = `
      SELECT L.id AS loan_id, I.name, L.borrow_date, L.due_date, L.status
      FROM Loans L
      JOIN Items I ON L.item_id = I.id
      WHERE L.user_id = ?
    `;
    const loans = await getQuery(sql, [userId]);

    console.log("Loans found:", loans);

    if (loans.length === 0) {
      return res.status(404).json({ message: "No loans found for this user" });
    }
    
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching loans", error: error.message });
  }
};

export const addLoan = async (req, res) => {
  try {
    const { user_id, item_id, status, borrow_date, return_date } = req.body;

    // ตรวจสอบว่าไอเท็มมีจำนวนเพียงพอหรือไม่
    const item = await allQuery(
      `SELECT available_quantity FROM Items WHERE id = ?`,
      [item_id]
    );

    if (item.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item[0].available_quantity <= 0) {
      return res.status(400).json({ message: "Item is out of stock" });
    }

    // เพิ่มข้อมูลการยืม
    await runQuery(
      `INSERT INTO Loans (user_id, item_id, status, borrow_date, return_date) 
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, item_id, status, borrow_date, return_date]
    );

    // อัปเดตจำนวน available_quantity ลดลง 1
    await runQuery(
      `UPDATE Items SET available_quantity = available_quantity - 1 WHERE id = ?`,
      [item_id]
    );

    res.status(201).json({ message: "Loan added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding loan", error: error.message });
  }
};

export const returnLoan = async (req, res) => {
  try {
    const { loan_id, item_id } = req.body;

    // Check if loan exists and is borrowed
    const loan = await allQuery(
      `SELECT * FROM Loans WHERE id = ? AND status = 'borrowed'`,
      [loan_id]
    );

    if (loan.length === 0) {
      return res.status(404).json({ message: "Loan not found or already returned" });
    }

    // Update the loan status to 'returned'
    await runQuery(
      `UPDATE Loans SET status = 'returned' WHERE id = ?`,
      [loan_id]
    );

    // Increase available_quantity of the item
    await runQuery(
      `UPDATE Items SET available_quantity = available_quantity + 1 WHERE id = ?`,
      [item_id]
    );

    res.status(200).json({ message: "Item returned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error returning loan", error: error.message });
  }
};


