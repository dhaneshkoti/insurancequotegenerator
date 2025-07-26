const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

const QuoteSchema = new mongoose.Schema({
  name: String,
  age: Number,
  income: Number,
  healthIssues: Boolean,
  quote: Number,
  breakdown: Object
});

const Quote = mongoose.model('Quote', QuoteSchema);

app.post('/api/quote', async (req, res) => {
  const { name, age, income, healthIssues } = req.body;

  let base = 5000;
  let ageAddition = 0;
  let incomeFactor = 1;
  let healthAddition = healthIssues ? 3000 : 0;

  if (age > 60) ageAddition = 7000;
  else if (age > 40) ageAddition = 4000;
  else if (age > 25) ageAddition = 2000;
  else ageAddition = 1000;

  if (income > 1000000) incomeFactor = 1.2;
  else if (income < 300000) incomeFactor = 0.9;

  const total = Math.round((base + ageAddition + healthAddition) * incomeFactor);

  const breakdown = { base, ageAddition, incomeAdjustment: incomeFactor, healthAddition, finalQuote: total };

  const newQuote = new Quote({ name, age, income, healthIssues, quote: total, breakdown });
  await newQuote.save();

  res.json({ quote: total, breakdown });
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));

