import { addReservation } from '../models/reservations.js';

async function test() {
    const response = await addReservation(1, 1, "2025-04-01", "2025-04-05");
    console.log(response);
}

test();
