import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#0b0c10", color: "#fff", padding: "40px 24px" },
  title: { color: "#ec4899", fontSize: "28px", marginBottom: "24px" },
  card: { backgroundColor: "#111318", border: "1px solid #1f2128", borderRadius: "12px", padding: "16px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  meta: { color: "#9ca3af", fontSize: "14px" },
  btn: { backgroundColor: "#ec4899", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontWeight: "bold" },
  removeBtn: { background: "none", border: "1px solid #374151", color: "#9ca3af", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" },
};

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("auralis_cart")) || [];
  } catch {
    return [];
  }
}

export default function Cart() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setItems(getCart());
  }, []);

  const removeItem = (index) => {
    const next = items.filter((_, i) => i !== index);
    setItems(next);
    localStorage.setItem("auralis_cart", JSON.stringify(next));
  };

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Keranjang</h1>

      {items.length === 0 && <p style={styles.meta}>Keranjang kamu kosong.</p>}

      {items.map((it, i) => (
        <div key={i} style={styles.card}>
          <div>
            <strong>{it.event_title}</strong>
            <p style={styles.meta}>{it.ticket_type_name} • {it.quantity}x Rp {Number(it.price).toLocaleString("id-ID")}</p>
          </div>
          <button style={styles.removeBtn} onClick={() => removeItem(i)}>Hapus</button>
        </div>
      ))}

      {items.length > 0 && (
        <div style={{ marginTop: "24px", textAlign: "right" }}>
          <p style={{ fontSize: "18px", marginBottom: "12px" }}>
            Total: <span style={{ color: "#ec4899", fontWeight: "bold" }}>Rp {total.toLocaleString("id-ID")}</span>
          </p>
          <button style={styles.btn} onClick={() => navigate("/checkout", { state: { items } })}>
            Lanjut ke Checkout
          </button>
        </div>
      )}
    </div>
  );
}