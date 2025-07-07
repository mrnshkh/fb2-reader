
let fontSize = 16;
let dark = false;
let allPages = [];
let currentPage = 0;

// Восстановление темы и шрифта при загрузке
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("reader-theme");
  if (savedTheme === "dark") {
    dark = true;
    document.body.classList.add("dark");
  }
  const savedFont = localStorage.getItem("reader-font");
  if (savedFont) {
    document.getElementById('fontFamily').value = savedFont;
    document.getElementById('content').style.fontFamily = savedFont;
  }
});

document.getElementById('fontFamily').addEventListener('change', function() {
  document.getElementById('content').style.fontFamily = this.value;
  localStorage.setItem("reader-font", this.value);
});

function increaseFont() {
  fontSize += 2;
  document.getElementById('content').style.fontSize = fontSize + 'px';
}
function decreaseFont() {
  fontSize -= 2;
  document.getElementById('content').style.fontSize = fontSize + 'px';
}
function toggleTheme() {
  dark = !dark;
  document.body.classList.toggle("dark", dark);
  localStorage.setItem("reader-theme", dark ? "dark" : "light");
}

function renderPage(index) {
  if (allPages.length > 0) {
    currentPage = index;
    document.getElementById('content').innerHTML = allPages[index];
    updatePagination();
  }
}

function updatePagination() {
  const nav = document.getElementById('pageNav');
  nav.innerHTML = "";
  for (let i = 0; i < allPages.length; i++) {
    const btn = document.createElement('button');
    btn.textContent = i + 1;
    btn.onclick = () => renderPage(i);
    if (i === currentPage) btn.style.fontWeight = "bold";
    nav.appendChild(btn);
  }
}

document.getElementById('fileInput').addEventListener('change', function(e) {
  const reader = new FileReader();
  reader.onload = function() {
    const parser = new DOMParser();
    const xml = parser.parseFromString(reader.result, "text/xml");
    const sections = xml.getElementsByTagName("section");
    let html = '';
    for (let section of sections) {
      const title = section.getElementsByTagName("title")[0];
      if (title) html += "<h2>" + title.textContent + "</h2>";
      const ps = section.getElementsByTagName("p");
      for (let p of ps) {
        html += "<p>" + p.textContent + "</p>";
      }
    }
    const perPage = 4000;
    allPages = [];
    for (let i = 0; i < html.length; i += perPage) {
      allPages.push(html.slice(i, i + perPage));
    }
    document.getElementById('pageNav').classList.remove('hidden');
    renderPage(0);
  };
  reader.readAsText(this.files[0]);
});
