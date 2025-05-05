//create / update birthday discount for a user
export const createOrUpdateBirthdayDiscount = async (date) => {
    try {
      const response = await fetch("/api/birthdayDiscount/createOrUpdateBirthdayDiscount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Error Response:", data);
        throw new Error(data.error || "Chyba pri vytváraní/updating birthday discount.");
      }
  
      return data;
    } catch (error) {
      console.error("Request Failed:", error);
      throw new Error(error.message || "Chyba siete.");
    }
};
  
//get birthday discount for a user
export const getBirthdayDiscount = async () => {
    try {
      const response = await fetch(`/api/birthdayDiscount/getBirthdayDiscount`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();
  
      if (!response.ok) {
        console.error("Error Response:", response);
        if (response.status === 404) {
          return null;
        }
        throw new Error("Chyba pri získavaní narodeninovej zľavy.");
      }
      
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
export const applyBirthdayDiscount = async (roomPrice) => {
    try {
      const response = await fetch("/api/birthdayDiscount/applyBirthdayDiscount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ roomPrice }),
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

export const expireBirthdayDiscount = async () => {
    try {
    const response = await fetch("/api/birthdayDiscount/expireBirthdayDiscount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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