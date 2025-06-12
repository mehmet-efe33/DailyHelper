const API_TOKEN = "e4d6b09375a04bd4897de4cab6e0b9f5"; // Sign up at football-data.org and get your token

const select = document.getElementById("leagueSelect");
const container = document.getElementById("matches");
const dateLabel = document.getElementById("selectedDate");
const prevBtn = document.getElementById("prevDate");
const nextBtn = document.getElementById("nextDate");

let selectedDate = new Date();

function formatDate(d) {
  return d.toISOString().split("T")[0];
}

function updateDateLabel() {
  dateLabel.textContent = selectedDate.toLocaleDateString("tr-TR", {
    weekday:"long", year:"numeric", month:"long", day:"numeric"
  });
}

async function fetchMatches() {
  const dateStr = formatDate(selectedDate);
  console.log("Fetching fixtures for date:", dateStr);
  try {
    const res = await fetch(`https://api.football-data.org/v4/matches?dateFrom=${dateStr}&dateTo=${dateStr}`, {
      headers: { 'X-Auth-Token': API_TOKEN }
    });
    console.log("HTTP status:", res.status);
    const data = await res.json();
    console.log("Data:", data);
    
    const matches = data.matches || [];
    if (!matches.length) {
      container.innerHTML = "<p>Bu tarihte maç bulunamadı.</p>";
      return;
    }
    
    container.innerHTML = matches.map(m => {
      const home = m.homeTeam.name;
      const away = m.awayTeam.name;
      const time = new Date(m.utcDate).toLocaleTimeString("tr-TR", {hour:'2-digit',minute:'2-digit'});
      const scoreHome = m.score.fullTime.home;
      const scoreAway = m.score.fullTime.away;
      const score = scoreHome !== null ? `${scoreHome} - ${scoreAway}` : "-";
      return `
        <div class="list-group-item d-flex justify-content-between">
          <div>${home} vs ${away}</div>
          <div><strong>${time}</strong> | <span>${score}</span></div>
        </div>`;
    }).join("");
    
  } catch(err) {
    console.error("API HATASI:", err);
    container.innerHTML = "<p>Veri alınamadı.</p>";
  }
}

// Attach buttons
prevBtn.onclick = () => {
  selectedDate.setDate(selectedDate.getDate() - 1);
  updateDateLabel();
  fetchMatches();
};
nextBtn.onclick = () => {
  selectedDate.setDate(selectedDate.getDate() + 1);
  updateDateLabel();
  fetchMatches();
};
select.addEventListener("change", fetchMatches);

document.addEventListener("DOMContentLoaded", () => {
  updateDateLabel();
  fetchMatches();
});
