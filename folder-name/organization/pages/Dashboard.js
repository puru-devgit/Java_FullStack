import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import "./Dashboard.css";

function Dashboard() {
  const [queue, setQueue] = useState([]);
  const [activity, setActivity] = useState([]); // ✅ NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [orgName] = useState(() => localStorage.getItem("orgName"));
  const [qrURL] = useState(() => localStorage.getItem("qrURL"));

  // ─── Fetch queue ───────────────────────────
  const fetchQueue = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/queue");
      if (!res.ok) throw new Error("Failed to fetch queue");

      const data = await res.json();

      // 🔥 Detect new joins
      if (queue.length > 0 && data.length > queue.length) {
        const newPerson = data[data.length - 1];
        addActivity(`${newPerson.name} joined the queue`);
      }

      setQueue(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Add activity ───────────────────────────
  const addActivity = (text) => {
    const newEntry = {
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString()
    };

    setActivity(prev => [newEntry, ...prev.slice(0, 4)]); // keep last 5
  };

  // ─── Auto refresh ───────────────────────────
  useEffect(() => {
    fetchQueue();

    const interval = setInterval(() => {
      fetchQueue();
    }, 3000);

    return () => clearInterval(interval);
  }, [queue]); // important for detecting changes

  // ─── Serve next ───────────────────────────
  const serveNext = async () => {
    if (queue.length === 0) return;

    const servedPerson = queue[0];

    try {
      await fetch(`http://localhost:5000/api/queue/${servedPerson.id}`, {
        method: "DELETE",
      });

      setQueue(prev => prev.slice(1));

      // ✅ Add activity
      addActivity(`${servedPerson.name} was served`);

    } catch (err) {
      alert("Failed to serve next person.");
    }
  };

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>FlowQ</h2>
        <button>Dashboard</button>
        <button>Queue</button>
        <button>Settings</button>
      </div>

      {/* Main */}
      <div className="main">

        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          {orgName || "Organization"} Dashboard
        </motion.h2>

        <div className="flex">

          {/* Total */}
          <motion.div className="card" whileHover={{ scale: 1.05 }}>
            <h3>Total in Queue</h3>
            <h1>{queue.length}</h1>
          </motion.div>

          {/* QR */}
          <motion.div className="card" whileHover={{ scale: 1.05 }}>
            <h3>QR Code</h3>
            {qrURL ? (
              <QRCodeCanvas value={qrURL} size={150} />
            ) : (
              <p>QR not generated yet</p>
            )}
          </motion.div>

        </div>

        {/* Serve Button */}
        <motion.button
          className="serve-btn"
          onClick={serveNext}
          whileTap={{ scale: 0.9 }}
          disabled={queue.length === 0}
        >
          Serve Next
        </motion.button>

        <div className="flex">

          {/* Queue List */}
          <div className="card" style={{ flex: 2 }}>
            <h3>Queue List</h3>

            {loading && <p>Loading queue...</p>}
            {error && <p style={{ color: "#fca5a5" }}>{error}</p>}
            {!loading && queue.length === 0 && <p>No queue</p>}

            <AnimatePresence>
              {queue.map((person, i) => (
                <motion.div
                  key={person.id}
                  className="queue-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <span>#{i + 1}</span>
                  <div>
                    <p>{person.name}</p>
                    <p>{person.phone}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 🔥 Activity Panel */}
          <div className="card" style={{ flex: 1 }}>
            <h3>Activity</h3>

            {activity.length === 0 && <p>No activity yet</p>}

            <AnimatePresence>
              {activity.map((item) => (
                <motion.div
                  key={item.id}
                  className="activity-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p>{item.text}</p>
                  <span>{item.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;