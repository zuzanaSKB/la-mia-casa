async function login(email, password) {
  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        const text = await response.json();
        throw new Error(text.error || "Neplatné prihlasovacie údaje.");
      }
      const text = await response.text();
      throw new Error(text || "Chyba pri prihlasovaní.");
    }

    return await response.json();
  } catch (err) {
    throw new Error(err.message || "Nastala neočakávaná chyba.");
  }
}


async function logout() {
  try {
    const response = await fetch("http://localhost:3000/auth/logout", {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 400) {
        const text = await response.text();
        throw new Error(text || "Neplatná požiadavka - session neexistuje.");
      }
      const text = await response.text();
      throw new Error(text || "Chyba pri odhlasovaní.");
    }
  } catch (err) {
    throw new Error(err.message || "Nastala neočakávaná chyba.");
  }
}

export { login, logout };