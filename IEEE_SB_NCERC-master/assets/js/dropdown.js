document.addEventListener("DOMContentLoaded", function() {
    const execomLink = document.querySelector('.nav-link[href="execom.html"]');
    const dropdownContent = `
        <div class="dropdown-menu" aria-labelledby="execomDropdown">
            <a class="dropdown-item" href="present_execom.html">Present Execom</a>
            <a class="dropdown-item" href="past_execom.html">Past Execom</a>
        </div>
    `;
    execomLink.insertAdjacentHTML('afterend', dropdownContent);
    execomLink.classList.add('dropdown-toggle');
    execomLink.setAttribute('id', 'execomDropdown');
    execomLink.setAttribute('role', 'button');
    execomLink.setAttribute('data-bs-toggle', 'dropdown');
    execomLink.setAttribute('aria-expanded', 'false');
});
