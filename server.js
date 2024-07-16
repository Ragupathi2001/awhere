const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3004;
const bodyParser = require("body-parser");

app.use(bodyParser.json());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.post("/api/user-list", async (req, res) => {
  const { email } = req.body;

  const endpoint = `https://api.hubapi.com/contacts/v1/search/query?q=${email}`;

  const apiKey = "Bearer pat-na1-6a2f19d5-fb24-45c7-84af-6fb5d7644c5b";

  const headers = {
    "Content-Type": "application/json",
    Authorization: apiKey,
  };

  try {
    // Make a GET request to HubSpot API to search contacts by email
    const response = await axios.get(endpoint, { headers });

    // Check if any contacts were found and return the user data
    if (response.data.total > 0) {
      const user = response.data.contacts[0]; // Get the first matching contact
      res.json(user);
    } else {
      res.status(404).json({ error: "No user found with the provided email." });
    }
  } catch (error) {
    // Handle errors
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: error.message });
  }
});

app.get("/api/search-contact", async (req, res) => {
  const apiKey = "Bearer pat-na1-6a2f19d5-fb24-45c7-84af-6fb5d7644c5b";
  const endpoint =
    "https://api.hubapi.com/contacts/v1/lists/all/contacts/all?property=location";
  const headers = {
    Authorization: apiKey,
  };

  try {
    const response = await axios.get(endpoint, { headers });
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status || 500).json({ error: error.message });
  }
});

app.get("/api/login", async (req, res) => {
  const apiKey = "Bearer pat-na1-6a2f19d5-fb24-45c7-84af-6fb5d7644c5b";
  const endpoint =
    "https://api.hubapi.com/contacts/v1/lists/all/contacts/all?property=firstname";
  const headers = {
    Authorization: apiKey,
  };

  try {
    const response = await axios.get(endpoint, { headers });
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status || 500).json({ error: error.message });
  }
});

app.get("/api/userdetails/:id", async (req, res) => {
  const { id } = req.params;

  const apiKey = "Bearer pat-na1-6a2f19d5-fb24-45c7-84af-6fb5d7644c5b";
  const endpoint = `https://api.hubapi.com/crm/v3/objects/contacts/${id}?properties=userRole,Groups,dangermode,groupdangermode,profileimage,coverimage,email,firstname,lastname`;

  const headers = {
    Authorization: apiKey,
  };

  try {
    const response = await axios.get(endpoint, { headers });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(error.response.status || 500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
