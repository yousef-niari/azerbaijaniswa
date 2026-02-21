const NEWS_KEY = "awsa-news-posts";
const CONTACT_EMAIL = "info@azerbaijaniswa.org";

const form = document.querySelector("#news-form");
const titleInput = document.querySelector("#title");
const detailsInput = document.querySelector("#details");
const newsList = document.querySelector("#news-list");
const contactForm = document.querySelector("#contact-form");
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

function loadPosts() {
  try {
    const raw = localStorage.getItem(NEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(NEWS_KEY, JSON.stringify(posts));
}

function renderPosts(posts) {
  if (!newsList) {
    return;
  }

  newsList.innerHTML = "";

  if (!posts.length) {
    newsList.innerHTML = '<article class="card">No updates yet. Please check back soon.</article>';
    return;
  }

  posts.forEach((post) => {
    const item = document.createElement("article");
    item.className = "card news-item";
    item.innerHTML = `
      <h3>${post.title}</h3>
      <span class="news-date">${new Date(post.createdAt).toLocaleString()}</span>
      <p>${post.details}</p>
    `;
    newsList.appendChild(item);
  });
}

if (form && titleInput && detailsInput) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const details = detailsInput.value.trim();

    if (!title || !details) {
      return;
    }

    const posts = loadPosts();
    posts.unshift({
      title,
      details,
      createdAt: Date.now(),
    });

    savePosts(posts);
    renderPosts(posts);
    form.reset();
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#sender-name").value.trim();
    const email = document.querySelector("#sender-email").value.trim();
    const subject = document.querySelector("#contact-subject").value.trim();
    const message = document.querySelector("#contact-message").value.trim();

    if (!name || !email || !subject || !message) {
      return;
    }

    const mailSubject = encodeURIComponent(`[AWSA Website] ${subject}`);
    const mailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${mailSubject}&body=${mailBody}`;
  });
}

renderPosts(loadPosts());
