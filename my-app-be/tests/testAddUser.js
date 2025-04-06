import { addUser } from '../models/users.js';

async function test() {
    const response = await addUser("Enzo Pytlik", "enzo@pytlik.it", "635862442", "woof", "2024-03-29");
    console.log(response);
}

test();
