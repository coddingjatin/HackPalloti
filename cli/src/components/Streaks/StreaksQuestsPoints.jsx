import React, { useState, useEffect } from "react";

const StreaksQuestsPoints = () => {
  const today = new Date().getDay();

  const [quests, setQuests] = useState([
    { id: 1, title: "Complete Python Basics", completed: false },
    { id: 2, title: "Finish Machine Learning starting Module", completed: false },
    { id: 3, title: "Solve 5 Coding Problems", completed: false },
    { id: 4, title: "Watch tutorials from DSA Playlist", completed: true },
  ]);

  const [newQuest, setNewQuest] = useState("");
  const initialStreaks = Array(7).fill(false).map((_, idx) => idx < today);
  const [streakDays, setStreakDays] = useState(initialStreaks);
  const [badges, setBadges] = useState(["7-Day Streak", "Quest Starter"]);

  const DAILY_GOAL = 500;
  const [unlockedToday, setUnlockedToday] = useState(false);

  const toggleQuest = (id) => {
    const updated = quests.map((q) =>
      q.id === id ? { ...q, completed: !q.completed } : q
    );
    setQuests(updated);
  };

  useEffect(() => {
    const allDone = quests.every((q) => q.completed);
    if (allDone && !streakDays[today]) {
      const updated = [...streakDays];
      updated[today] = true;
      setStreakDays(updated);
      if (!badges.includes("Daily Master")) {
        setBadges((prev) => [...prev, "Daily Master"]);
        setUnlockedToday(true);
      }
    }
  }, [quests]);

  const addQuest = () => {
    if (!newQuest.trim()) return;
    const newQ = {
      id: Date.now(),
      title: newQuest.trim(),
      completed: false,
    };
    setQuests([...quests, newQ]);
    setNewQuest("");
  };

  const points =
    quests.filter((q) => q.completed).length * 100 +
    streakDays.filter(Boolean).length * 10;
  const progressPercent = Math.min((points / DAILY_GOAL) * 100, 100);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "2rem", borderRadius: "20px", backgroundColor: "#ffffff", boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)", fontFamily: "Segoe UI, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#1e3a8a" }}>Your Learning Journey</h2>

      {/* Weekly Streak */}
      <section style={{ marginBottom: "2rem" }}>
        <h4 style={{ color: "#1d4ed8", marginBottom: "0.8rem" }}>🔥 Weekly Streak</h4>
        <div style={{ display: "flex", justifyContent: "center", gap: "18px" }}>
          {dayNames.map((day, idx) => (
            <div key={idx} style={{ backgroundColor: streakDays[idx] ? "#60a5fa" : "#e0f2fe", color: streakDays[idx] ? "#ffffff" : "#1e3a8a", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "0.9rem", boxShadow: streakDays[idx] ? "0 0 10px #3b82f6" : "inset 0 0 2px #93c5fd", transition: "all 0.3s" }} title={day}>{day[0]}</div>
          ))}
        </div>
      </section>

      {/* Daily Goal Progress */}
      <section style={{ marginBottom: "2rem" }}>
        <h4 style={{ color: "#1d4ed8", marginBottom: "0.5rem" }}>🎯 Daily XP Goal</h4>
        <div style={{ backgroundColor: "#e0f2fe", borderRadius: "10px", height: "16px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progressPercent}%`, backgroundColor: "#3b82f6", transition: "width 0.3s ease" }}></div>
        </div>
        <p style={{ marginTop: "0.5rem", color: "#1e3a8a", fontWeight: "500" }}>{progressPercent.toFixed(0)}% of {DAILY_GOAL} XP</p>
      </section>

      {/* Quests */}
      <section style={{ marginBottom: "2rem" }}>
        <h4 style={{ color: "#1d4ed8", marginBottom: "1rem" }}>🗺️ Current Quests</h4>
        <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
          <input type="text" placeholder="Add a new quest..." value={newQuest} onChange={(e) => setNewQuest(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addQuest()} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #dbeafe", backgroundColor: "#f0f9ff", color: "black", outline: "none" }} />
          <button onClick={addQuest} style={{ backgroundColor: "#3b82f6", color: "#fff", padding: "10px 16px", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Add</button>
        </div>
        {quests.map((q) => (
          <div key={q.id} onClick={() => toggleQuest(q.id)} style={{ backgroundColor: q.completed ? "#bfdbfe" : "#e0f2fe", padding: "10px 14px", borderRadius: "10px", marginBottom: "0.7rem", cursor: "pointer", display: "flex", justifyContent: "space-between", fontWeight: "500", color: "#1e3a8a", transition: "all 0.3s" }}>
            <span>{q.title}</span>
            <span>{q.completed ? "✔️" : "⌛"}</span>
          </div>
        ))}
      </section>

      {/* Points */}
      <section style={{ backgroundColor: "#e0f2fe", padding: "1rem", borderRadius: "12px", textAlign: "center", fontWeight: "700", color: "#1e3a8a", fontSize: "1.3rem", marginBottom: "2rem" }}>
        ⭐ Points Earned: <span style={{ color: "#065f46", fontSize: "1.8rem" }}>{points}</span>
      </section>

      {/* Monthly Goal */}
      <section style={{ backgroundColor: "#f0f9ff", padding: "1rem", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "600", marginBottom: "2rem", border: "1px dashed #3b82f6", textAlign: "center", color: "#1e3a8a" }}>
        🎯 Monthly Goal: Earn 3000 points — Keep the streak alive!
      </section>

      {/* Badges */}
      <section>
        <h4 style={{ color: "#1d4ed8", marginBottom: "1rem" }}>🏅 Badges</h4>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {badges.map((badge, i) => (
            <div key={i} style={{ backgroundColor: "#dbeafe", padding: "8px 14px", borderRadius: "18px", fontWeight: "600", color: "#1e3a8a", fontSize: "0.95rem", boxShadow: "0 0 4px #3b82f6" }}>{badge}</div>
          ))}
          {unlockedToday && (
            <div style={{ backgroundColor: "#a7f3d0", padding: "8px 14px", borderRadius: "18px", fontWeight: "600", color: "#064e3b", fontSize: "0.95rem", boxShadow: "0 0 6px #10b981" }}>🎉 Daily Master Unlocked!</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StreaksQuestsPoints;