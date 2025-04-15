export const register = async (name, email, phone_number, birth_date, password) => {
  try {
    const response = await fetch("http://localhost:3000/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone_number, birth_date, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error Response:", data);
      throw new Error(data.error || "Chyba pri registrácii.");
    }

    return data; //success response with message
  } catch (error) {
    console.error("Request Failed:", error);
    throw new Error(error.message || "Chyba siete.");
  }
};