import axios from "axios";

const API_URL = "http://192.168.1.121:5000";

// Updated RegisterUser function to accept name, username, phone, and password
export const RegisterUser = async (name, username, phone, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,     // Send name to the backend
      username, // Send username
      phone,    // Send phone number
      password, // Send password
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error register");
  }
};

export const LoginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    // ✅ ตอนนี้ return ทั้ง object { token, user: { id, name }, message }
    return response.data;

  } catch (error) {
    throw new Error(error.response?.data?.message || "Error login");
  }
};


// Fetching current loans
// Modify the API call to accept user_id and pass it to the backend API
export const GetCurrentLoans = async (token, user_id) => {
  try {
    const response = await fetch(`http://192.168.1.121:5000/loans/borrowed/${user_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data; // Return the response data
    } else {
      throw new Error(data.message || 'Something went wrong');
    }
  } catch (error) {
    console.error('Error fetching loan data:', error);
    throw error;
  }
};

export const Rooms = async () => {
  try {
    const response = await axios.get(`${API_URL}/rooms`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching rooms");
  }

  //app.get("/items", getItems);
  

};

export const Items = async () => {
  try {
    const response = await axios.get(`${API_URL}/items`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching items");
  }  

  //loanItems
};


export const loanItems = async (req, res) => {
  try {
    const { user_id, item_id, quantity, borrow_date, return_date } = req.body;
    const sql = `INSERT INTO Loans (user_id, item_id, quantity, borrow_date, return_date) VALUES (?, ?, ?, ?, ?)`;
    await runQuery(sql, [user_id, item_id, quantity, borrow_date, return_date]);
    res.json({ message: "Items loaned successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error loaning items", error: error.message });
  }
};

export const Users = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching users");
  }
};

export const GetLoans = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/loans/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching loans");
  }
};
export const addLoan = async (
  user_id,
  item_id,
  status,
  borrow_date,
  return_date,
  token
) => {
  try {
    const response = await axios.post(
      `${API_URL}/add-loan`,
      { user_id, item_id, status, borrow_date, return_date },
      {
        headers: { Authorization: `Bearer ${token}` }, // ใช้ token สำหรับการยืนยันตัวตน
      }
    );
    return response.data; // ส่งคืนข้อมูลการเพิ่มการยืม
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error adding loan");
  }
};
export const returnLoan = async (loan_id, item_id, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/return-loan`,
      { loan_id, item_id ,token },
      {
        headers: { Authorization: `Bearer ${token}` }, // token ต้องส่งไปที่ API
      }
    );
    return response.data; // ส่งคืนข้อมูลการคืนอุปกรณ์
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error returning loan");
  }
};
export const addReserve = async (user_id, room_id, bookingDate, startTime, endTime, token) => {
  try {
    const response = await fetch("API_URL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id,
        room_id,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to make reservation');
    }
    return await response.json();
  } catch (error) {
    console.error("Error while making reservation:", error.message);
    throw error; // Rethrow to be caught in the calling function
  }
};

export const GetCurrentReservedRooms = async (token, user_id) => {
  try {
    const response = await fetch(`http://192.168.1.121:5000/reserves/current/${user_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data; // Return the response data
    } else {
      throw new Error(data.message || 'Something went wrong');
    }
  } catch (error) {
    console.error('Error fetching reserved room data:', error);
    throw error;
  }
};
