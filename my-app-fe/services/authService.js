function login(email, password) {
  return fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include"
  })
    .then((response) => {
      if (!response.ok) {
        // invalid password or user does not exist
        if (response.status === 401) {
          return response.text().then((text) => {
            throw new Error(text || "Invalid credentials"); 
          });
        }
        return response.text().then((text) => {
          throw new Error(text || "Error logging in");
        });
      }
      return response;
    })
    .catch((err) => {
      throw new Error(err.message || "An unexpected error occurred.");
    });
}

function logout() {
  return fetch("/auth/logout", { method: "DELETE", credentials: "include" })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 400) {
          return response.text().then((text) => {
            throw new Error(text || "Bad request - session does not exist"); 
          });
        }
        return response.text().then((text) => {
          throw new Error(text || "Error logging out");
        });
      }
    })
    .catch((err) => {
      throw new Error(err.message || "An unexpected error occurred.");
    });
}

export { login, logout };
