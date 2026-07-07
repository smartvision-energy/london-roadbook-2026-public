const pageIds = [
  "home",
  "programme",
  "restaurants",
  "wed-pm",
  "thu-am",
  "thu-pm",
  "fri-am",
  "fri-pm",
  "sat-options",
  "reservations",
  "actions",
  "conseils"
];

function resolveHash() {
  const raw = window.location.hash.replace("#", "");
  if (pageIds.includes(raw)) {
    return { page: raw, anchor: null };
  }

  const anchor = raw ? document.getElementById(raw) : null;
  const parentPage = anchor ? anchor.closest(".page") : null;
  return {
    page: parentPage && pageIds.includes(parentPage.id) ? parentPage.id : "home",
    anchor
  };
}

function setActivePage() {
  const { page: active, anchor } = resolveHash();
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle("active", page.id === active);
  });

  document.querySelectorAll(".nav-link, .bottom-nav a").forEach((link) => {
    const target = link.getAttribute("href").replace("#", "");
    const isProgramChild = ["wed-pm", "thu-am", "thu-pm", "fri-am", "fri-pm", "sat-options"].includes(active);
    const isActive = target === active || (target === "programme" && isProgramChild);
    link.classList.toggle("active", isActive);
  });

  if (anchor) {
    requestAnimationFrame(() => {
      const headerOffset = 118;
      const top = anchor.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
    });
  } else {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }
}

window.addEventListener("hashchange", setActivePage);
window.addEventListener("load", setActivePage);
setActivePage();

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
      const original = button.textContent;
      button.textContent = "Copie";
      setTimeout(() => {
        button.textContent = original;
      }, 1000);
    } catch {
      window.prompt("Reference a copier", text);
    }
  });
});

document.querySelectorAll("[data-check]").forEach((input) => {
  const key = `london-roadbook:${input.dataset.check}`;
  input.checked = localStorage.getItem(key) === "1";
  input.addEventListener("change", () => {
    localStorage.setItem(key, input.checked ? "1" : "0");
  });
});

if (window.location.search.includes("debug")) {
  window.addEventListener("load", () => {
    const metrics = {
      innerWidth: window.innerWidth,
      docClientWidth: document.documentElement.clientWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth
    };
    document.documentElement.dataset.metrics = JSON.stringify(metrics);
  });
}
