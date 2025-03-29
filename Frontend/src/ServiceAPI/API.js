import axios from "axios";

const API_URL = "http://192.168.100.2:5000";

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
export const GetCurrentLoans = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/loans/current`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching current loans");
  }
};

// Fetching rooms (remains the same)
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

  
}