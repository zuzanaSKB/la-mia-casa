async function login(email, password) {
  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      //handle invalid credentials (401)
      if (response.status === 401) {
        const text = await response.text();
        throw new Error(text || "Invalid credentials");
      }
      const text = await response.text();
      throw new Error(text || "Error logging in");
    }

    //parse and return the JSON response if successful
    return await response.json();
  } catch (err) {
    throw new Error(err.message || "An unexpected error occurred.");
  }
}


async function logout() {
  try {
    const response = await fetch("http://localhost:3000/auth/logout", {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      //handle errors during logout (e.g., session doesn't exist)
      if (response.status === 400) {
        const text = await response.text();
        throw new Error(text || "Bad request - session does not exist");
      }
      const text = await response.text();
      throw new Error(text || "Error logging out");
    }
  } catch (err) {
    throw new Error(err.message || "An unexpected error occurred.");
  }
}


export { login, logout };
