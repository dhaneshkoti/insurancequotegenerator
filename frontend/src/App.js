import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [form, setForm] = useState({ name: '', age: '', income: '', healthIssues: false });
  const [quote, setQuote] = useState(null);
  const [quoteDetails, setQuoteDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setQuote(null);
    try {
      const res = await axios.post('/api/quote', form);
      setQuote(res.data.quote);
      setQuoteDetails(res.data.breakdown);
    } catch (err) {
      setError('Error fetching quote. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="app">
      <div className="form-container">
        <h1>💼 Insurance Quote Calculator</h1>
        <form onSubmit={handleSubmit}>
          <input className="input-large" name="name" placeholder="Enter your name" onChange={handleChange} required />
          <input name="age" type="number" placeholder="Enter your age" onChange={handleChange} required />
          <input name="income" type="number" placeholder="Annual income" onChange={handleChange} required />
          <label className="checkbox">
            <input name="healthIssues" type="checkbox" onChange={handleChange} />
            Do you have any health issues?
          </label>
          <button type="submit">Get Quote</button>
        </form>

        {quote !== null && (
          <div className="result">
            <strong>Your Insurance Quote is: ₹{quote}</strong>
            <div className="breakdown">
              <p>📌 <b>Base:</b> ₹{quoteDetails.base}</p>
              <p>📈 <b>Age Risk:</b> ₹{quoteDetails.ageAddition}</p>
              <p>💰 <b>Income Factor:</b> × {quoteDetails.incomeAdjustment}</p>
              <p>🩺 <b>Health Risk:</b> ₹{quoteDetails.healthAddition}</p>
              <hr />
              <p><b>Total:</b> ₹{quoteDetails.finalQuote}</p>
            </div>
          </div>
        )}

        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default App;
