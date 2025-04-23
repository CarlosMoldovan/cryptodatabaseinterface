import { useEffect, useState } from "react";
import axios from "axios";

type Cryptocurrency = {
  ID: number;
  Name: string;
  Symbol: string;
  CurrentPrice: number;
  MarketCap: number;
};

type Exchange = {
  ID: number;
  Name: string;
  Country: string;
  Volume24h: number;
  UserCount: number;
}

export default function CryptoList() {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [form, setForm] = useState<Partial<Cryptocurrency>>({
    Name: '',
    Symbol: '',
    CurrentPrice: 0,
    MarketCap: 0
  });

  const [formE, setFormE] = useState<Partial<Exchange>>({
    Name: '',
    Country: '',
    Volume24h: 0,
    UserCount: 0
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = () => {
    axios.get("http://localhost:3001/api/cryptocurrencies")
      .then(res => setCryptos(res.data))
      .catch(err => console.error("Eroare la preluare:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.Name || !form.Symbol) return;

    const data = {
      ...form,
      CurrentPrice: parseFloat(String(form.CurrentPrice)),
      MarketCap: parseFloat(String(form.MarketCap))
    };

    if (isEditing && form.ID !== undefined) {
      await axios.put(`http://localhost:3001/api/cryptocurrencies/${form.ID}`, data);
    } else {
      await axios.post("http://localhost:3001/api/cryptocurrencies", data);
    }

    setForm({ Name: '', Symbol: '', CurrentPrice: 0, MarketCap: 0 });
    setIsEditing(false);
    fetchData();
  };

  const handleEdit = (crypto: Cryptocurrency) => {
    setForm(crypto);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Ești sigur că vrei să ștergi această criptomonedă?")) {
      await axios.delete(`http://localhost:3001/api/cryptocurrencies/${id}`);
      fetchData();
    }
  };

  const [exchanges, setExchanges] = useState<Exchange[]>([]);
const [isEditingExchange, setIsEditingExchange] = useState(false);

const fetchExchanges = () => {
  axios.get("http://localhost:3001/api/exchanges")
    .then(res => setExchanges(res.data))
    .catch(err => console.error("Eroare la preluare exchanges:", err));
};

useEffect(() => {
  fetchExchanges();
}, []);

const handleExchangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormE({ ...formE, [e.target.name]: e.target.value });
};

const handleExchangeSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formE.Name || !formE.Country) return;

  const data = {
    ...formE,
    Volume24h: parseFloat(String(formE.Volume24h)),
    UserCount: parseInt(String(formE.UserCount))
  };

  if (isEditingExchange && formE.ID !== undefined) {
    await axios.put(`http://localhost:3001/api/exchanges/${formE.ID}`, data);
  } else {
    await axios.post("http://localhost:3001/api/exchanges", data);
  }

  setFormE({ Name: '', Country: '', Volume24h: 0, UserCount: 0 });
  setIsEditingExchange(false);
  fetchExchanges();
};

const handleEditExchange = (exchange: Exchange) => {
  setFormE(exchange);
  setIsEditingExchange(true);
};

const handleDeleteExchange = async (id: number) => {
  if (confirm("Ești sigur că vrei să ștergi acest exchange?")) {
    await axios.delete(`http://localhost:3001/api/exchanges/${id}`);
    fetchExchanges();
  }
};

  return (
    <div>
      <h2>Lista criptomonedelor</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input name="Name" placeholder="Nume" value={form.Name || ''} onChange={handleChange} required />
        <input name="Symbol" placeholder="Simbol" value={form.Symbol || ''} onChange={handleChange} required />
        <input name="CurrentPrice" placeholder="Preț" type="number" value={form.CurrentPrice || ''} onChange={handleChange} required />
        <input name="MarketCap" placeholder="Market Cap" type="number" value={form.MarketCap || ''} onChange={handleChange} required />
        <button type="submit">{isEditing ? "Salvează" : "Adaugă"}</button>
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nume</th>
            <th>Simbol</th>
            <th>Preț Curent</th>
            <th>Market Cap</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map(crypto => (
            <tr key={crypto.ID}>
              <td>{crypto.ID}</td>
              <td>{crypto.Name}</td>
              <td>{crypto.Symbol}</td>
              <td>{crypto.CurrentPrice.toFixed(2)} $</td>
              <td>{crypto.MarketCap.toLocaleString()}</td>
              <td>
                <button onClick={() => handleEdit(crypto)}>Edit</button>{" "}
                <button onClick={() => handleDelete(crypto.ID)}>Șterge</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Lista exchange-urilor</h2>

<form onSubmit={handleExchangeSubmit} style={{ marginBottom: "20px" }}>
  <input name="Name" placeholder="Nume" value={formE.Name || ''} onChange={handleExchangeChange} required />
  <input name="Country" placeholder="Țară" value={formE.Country || ''} onChange={handleExchangeChange} required />
  <input name="Volume24h" placeholder="Volum 24h" type="number" value={formE.Volume24h || ''} onChange={handleExchangeChange} required />
  <input name="UserCount" placeholder="Număr Utilizatori" type="number" value={formE.UserCount || ''} onChange={handleExchangeChange} required />
  <button type="submit">{isEditingExchange ? "Salvează" : "Adaugă"}</button>
</form>

<table style={{ width: "100%", borderCollapse: "collapse" }}>
  <thead>
    <tr>
      <th>ID</th>
      <th>Nume</th>
      <th>Țară</th>
      <th>Volum 24h</th>
      <th>Utilizatori</th>
      <th>Acțiuni</th>
    </tr>
  </thead>
  <tbody>
    {exchanges.map(exchange => (
      <tr key={exchange.ID}>
        <td>{exchange.ID}</td>
        <td>{exchange.Name}</td>
        <td>{exchange.Country}</td>
        <td>{exchange.Volume24h.toLocaleString()}</td>
        <td>{exchange.UserCount}</td>
        <td>
          <button onClick={() => handleEditExchange(exchange)}>Edit</button>{" "}
          <button onClick={() => handleDeleteExchange(exchange.ID)}>Șterge</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}
