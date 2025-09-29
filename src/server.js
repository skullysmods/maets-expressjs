import 'dotenv/config';
import app from './app.js';
import { sequelize } from './models/index.js';
import { connectMongo } from './config/db/mongodb.js';

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('DB connected.');
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    } catch (e) {
        console.error('DB connection failed:', e);
        process.exit(1);
    }
})();

connectMongo();

app.listen(PORT, () => {
    console.log(`API running on :${PORT}`);
    console.log('MongoDB URI:', process.env.MONGODB_URI);
});