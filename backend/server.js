// server.js
import app from './app.js';

const PORT = process.env.PORT || 3020;


app.use(cors({
  origin: "https://event-checker-one.vercel.app",
}));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
