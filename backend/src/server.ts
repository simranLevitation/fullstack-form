import app from './app';
import { connectDB } from './config/db';
const PORT: number = Number(process.env.PORT );
async function start(): Promise<void> {
await connectDB();
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
}
start().catch((err) => {
console.error('Failed to start', err);
process.exit(1);
});