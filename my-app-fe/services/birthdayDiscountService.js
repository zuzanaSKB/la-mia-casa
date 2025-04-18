//create / update birthday discount for a user
export const createOrUpdateBirthdayDiscount = async (userId, date) => {
    try {
      const response = await fetch("http://localhost:3000/birthdayDiscount/createOrUpdateBirthdayDiscount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, date }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Error Response:", data);
        throw new Error(data.error || "Chyba pri vytváraní/updating birthday discount.");
      }
  
      return data; // success response with message
    } catch (error) {
      console.error("Request Failed:", error);
      throw new Error(error.message || "Chyba siete.");
    }
};
  
//get birthday discount for a user
export const getBirthdayDiscount = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/birthdayDiscount/getBirthdayDiscount?userId=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        console.error("Error Response:", response);
        if (response.status === 404) {
          return null;
        }
        throw new Error("Chyba pri získavaní narodeninovej zľavy.");
      }
  
      const data = await response.json();
      
      if (!data || Object.keys(data).length === 0) {
        return null;
      }
  
      return data;
    } catch (error) {
      console.error("Request Failed:", error);
      throw new Error(error.message || "Chyba siete.");
    }
  };  
  
//apply birthday discount to a reservation
export const applyBirthdayDiscount = async (userId, roomPrice) => {
    try {
      const response = await fetch("http://localhost:3000/birthdayDiscount/applyBirthdayDiscount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, roomPrice }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Error Response:", data);
        throw new Error(data.error || "Chyba pri aplikovaní narodeninovej zľavy.");
      }
  
      return data;
    } catch (error) {
      console.error("Request Failed:", error);
      throw new Error(error.message || "Chyba siete.");
    }
};

export const expireBirthdayDiscount = async (userId) => {
    try {
    const response = await fetch("http://localhost:3000/birthdayDiscount/expireBirthdayDiscount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Chyba pri expirovaní narodeninovej zľavy.");
    }

    return data;
    } catch (error) {
    console.error("Request Failed:", error);
    throw new Error(error.message || "Chyba siete.");
    }
};  