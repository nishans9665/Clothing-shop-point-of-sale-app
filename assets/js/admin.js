
document.querySelectorAll(".admin-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".admin-tab")
        .forEach(t => t.classList.remove("admin-tab-active"));

        document.querySelectorAll(".admin-section")
            .forEach(s => s.classList.remove("admin-section-active"));

        tab.classList.add("admin-tab-active");
        document.getElementById(tab.dataset.admin)
        .classList.add("admin-section-active");
    });
});