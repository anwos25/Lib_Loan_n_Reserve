import sqlite3 from "sqlite3";
import { db } from "./db.js";

// Helper function to run database queries with Promises
export const runQuery = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const allQuery = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};


// Helper function to run database queries with Promises
export const getQuery = async (sql, params) => {
  try {
    // ใช้ db.all() สำหรับ query ที่ต้องการดึงหลายแถว
    const rows = await new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
    console.log("Query result:", rows);
    return rows; // คืนค่า rows ที่ดึงมา
  } catch (err) {
    console.log("Error in query:", err);
    throw err;
  }
};


