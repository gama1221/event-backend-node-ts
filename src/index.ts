import { createApp } from "./createApp";
import dotenv from 'dotenv';
import './utils/reminderScheduler'
import './utils/createEventOnCalender'
dotenv.config();

const app = createApp();

// const PORT = 4000;
const PORT = process.env.PORT;
console.log("PORT : "+PORT);

app.listen(PORT, () => {
	console.log(`Running on Port ${PORT}`);
});
