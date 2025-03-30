export async function addUser(name, email, phone_number, password, birth_date) {
    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone_number, password, birth_date }),
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.error || "Chyba pri registrácii.");
  
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  