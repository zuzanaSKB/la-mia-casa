export const register = async (name, email, phone_number, birth_date, password) => {
  try {
    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone_number, birth_date, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error Response:", data);
      throw new Error(data.error || "Chyba pri registrácii.");
    }

    return data;
  } catch (error) {
    console.error("Request Failed:", error);
    throw new Error(error.message || "Chyba siete.");
  }
};

export const fetchUserById = async (userId) => {
  const response = await fetch(`/api/users/${userId}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Nepodarilo sa načítať používateľa (status: ${response.status})`);
  }

  const data = await response.json();
  return data.user;
};

export const updateUserName = async (userId, name) => {
  const response = await fetch(`/api/users/${userId}/name`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.user;
};

export const updateUserPhone = async (userId, phone_number) => {
  const response = await fetch(`/api/users/${userId}/phone`, {
    method: "PATCH",
    body: JSON.stringify({ phone_number }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.user;
};

export const updateUserPassword = async (userId, password) => {
  try {
    const response = await fetch(`/api/users/${userId}/password`, {
      method: "PATCH",
      body: JSON.stringify({ password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error Response:", data);
      throw new Error(data.error || `Nepodarilo sa zmeniť heslo (status: ${response.status})`);
    }
  
    return data;
  } catch (error) {
    console.error("Request Failed:", error);
    throw new Error(error.message || "Chyba siete.");
  }
};
