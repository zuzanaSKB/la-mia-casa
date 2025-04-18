import { addReservation } from '../models/reservations.js';
import { getAvailableRooms } from  '../models/rooms.js';

async function test() {
    const response = await addReservation(1, 1, "2025-04-01", "2025-04-05");
    //const response = await getAvailableRooms("2025-04-01", "2025-04-05");
    console.log(response);
}

test();
