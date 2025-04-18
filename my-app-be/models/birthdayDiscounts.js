import pool from '../config/db.js';

export const createOrUpdateBirthdayDiscount = async (userId, date) => {
    try {
        const result = await pool.query(
            `
            INSERT INTO birthday_discounts (user_id, discount, validity)
            VALUES ($1, 20, $2::DATE + INTERVAL '1 year')
            ON CONFLICT (user_id) 
            DO UPDATE SET discount = 20, validity = CURRENT_DATE + INTERVAL '1 year'
            `,
            [userId, date]
        );
        return { success: true, message: 'Birthday discount created/updated successfully.' };
    } catch (error) {
        console.error('Error creating/updating birthday discount:', error);
        return { success: false, error: 'Failed to create/update birthday discount: ' + error.message };
    }
};

//using during login
export const createOrUpdateBirthdayDiscountIfToday = async (userId, birthDate) => {
    try {
        const today = new Date();
        const birth = new Date(birthDate);

        const isTodayBirthday =
            today.getDate() === birth.getDate() &&
            today.getMonth() === birth.getMonth();

        if (!isTodayBirthday) {
            return { success: false, message: "Today is not the user's birthday." };
        }

        // Always upsert: insert if not exists, update if already exists
        await pool.query(
            `INSERT INTO birthday_discounts (user_id, discount, validity)
             VALUES ($1, 20, CURRENT_DATE + INTERVAL '1 year')
             ON CONFLICT (user_id)
             DO UPDATE SET
                 discount = EXCLUDED.discount,
                 validity = EXCLUDED.validity`,
            [userId]
        );

        return { success: true, message: "Birthday discount created or updated." };
    } catch (error) {
        console.error("Error in birthday discount check/create:", error);
        return { success: false, error: error.message };
    }
};


export const getBirthdayDiscount = async (userId) => {
    try {
        const result = await pool.query(
            `
            SELECT discount, validity
            FROM birthday_discounts
            WHERE user_id = $1 AND validity > CURRENT_TIMESTAMP
            `,
            [userId]
        );
        
        if (result.rows.length === 0) {
            return { success: false, message: 'No valid birthday discount available.' };
        }
        return { success: true, discount: result.rows[0] };
    } catch (error) {
        console.error('Error getting birthday discount:', error);
        return { success: false, error: 'Failed to get birthday discount: ' + error.message };
    }
};

export const applyBirthdayDiscount = async (userId, roomPrice) => {
    try {
        const discountResult = await pool.query(
            `
            SELECT discount, validity
            FROM birthday_discounts
            WHERE user_id = $1 AND validity > CURRENT_TIMESTAMP
            `,
            [userId]
        );

        if (discountResult.rows.length === 0) {
            return { success: false, message: 'No valid birthday discount available.' };
        }

        const discount = discountResult.rows[0].discount;
        const discountedPrice = roomPrice - (roomPrice * discount / 100);

        await pool.query(
            `
            DELETE FROM birthday_discounts
            WHERE user_id = $1
            `,
            [userId]
        );

        return { success: true, discountedPrice, message: 'Discount applied successfully.' };
    } catch (error) {
        console.error('Error applying birthday discount:', error);
        return { success: false, error: 'Failed to apply birthday discount: ' + error.message };
    }
};

export const expireBirthdayDiscount = async (userId) => {
    try {
        await pool.query(
            `
            UPDATE birthday_discounts
            SET validity = CURRENT_TIMESTAMP - INTERVAL '1 day'
            WHERE user_id = $1
            `,
            [userId]
        );
        return { success: true, message: 'Birthday discount expired.' };
    } catch (error) {
        console.error('Error expiring birthday discount:', error);
        return { success: false, error: error.message };
    }
};