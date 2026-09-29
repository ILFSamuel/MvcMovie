// ===== Tema chiaro/scuro =====
(function () {
    const root = document.documentElement;
    const btn = document.getElementById("themeToggle");

    function updateLabel() {
        const dark = root.getAttribute("data-bs-theme") === "dark";
        btn.textContent = dark ? "☀️ Chiaro" : "🌙 Scuro";
    }

    btn.addEventListener("click", () => {
        const next = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-bs-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) { }
        updateLabel();
    });

    updateLabel();
})();

// ===== Pulsante "torna su" =====
(function () {
    const btn = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        btn.classList.toggle("d-none", window.scrollY < 300);
    });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
})();

// ===== Toast: showToast("messaggio", "success" | "danger" | "info" | "warning") =====
window.showToast = function (message, type = "success") {
    const container = document.getElementById("toastContainer");
    const el = document.createElement("div");
    el.className = `toast align-items-center text-bg-${type} border-0`;
    el.setAttribute("role", "alert");
    el.innerHTML = `
        <div class="d-flex">
            <div class="toast-body"></div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Chiudi"></button>
        </div>`;
    el.querySelector(".toast-body").textContent = message;
    container.appendChild(el);

    const toast = new bootstrap.Toast(el, { delay: 3000 });
    el.addEventListener("hidden.bs.toast", () => el.remove());
    toast.show();
};

// ===== Modale di conferma: confirmAction("Titolo", "Testo", () => { ... }) =====
window.confirmAction = function (title, text, onConfirm) {
    const modalEl = document.getElementById("confirmModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    document.getElementById("confirmModalTitle").textContent = title;
    document.getElementById("confirmModalBody").textContent = text;

    const okBtn = document.getElementById("confirmModalOk");
    const fresh = okBtn.cloneNode(true);          // rimuove i vecchi listener
    okBtn.replaceWith(fresh);
    fresh.addEventListener("click", () => {
        modal.hide();
        onConfirm();
    });

    modal.show();
};

// ===== Conferma automatica su form/link con data-confirm="testo" =====
document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-confirm]");
    if (!el) return;

    e.preventDefault();
    confirmAction("Conferma", el.dataset.confirm, () => {
        if (el.tagName === "A") {
            window.location.href = el.href;
        } else if (el.form) {
            el.form.submit();
        }
    });
});