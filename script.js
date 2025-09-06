document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");
  const themeSwitchKnob = document.getElementById("themeSwitchKnob");
  const knobIcon = document.getElementById("knobIcon");
  const root = document.documentElement;
  function setTheme(dark) {
    if (dark) {
      root.classList.add("dark");
      themeSwitchKnob.style.transform = "translateX(20px)";
      knobIcon.className = "fa fa-moon text-xs text-dark-bg-primary";
    } else {
      root.classList.remove("dark");
      themeSwitchKnob.style.transform = "translateX(0)";
      knobIcon.className = "fa fa-sun text-xs text-white";
    }
  }
  let dark = localStorage.getItem("theme") === "dark";
  setTheme(dark);
  themeToggle.addEventListener("click", function () {
    dark = !dark;
    setTheme(dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const YEAR_ELEMENT_ID = "year";
  const MOBILE_MENU_BUTTON_ID = "mobileMenuButton";
  const MOBILE_MENU_ID = "mobile-menu";
  const CONTACT_FORM_ID = "contact-form";
  const FORM_STATUS_ID = "form-status";
  const FADE_IN_THRESHOLD = 0.15;
  const FORM_STATUS_TIMEOUT = 5000;
  const FORM_SEND_DELAY = 1500;

  function getHeaderOffset() {
    const header = document.getElementById("header");
    if (!header) return 0;
    return Math.ceil(header.getBoundingClientRect().height);
  }

  function setCurrentYear() {
    const yEl = document.getElementById(YEAR_ELEMENT_ID);
    if (yEl) yEl.textContent = new Date().getFullYear();
  }

  function toggleMobileMenu() {
    const mobileMenuButton = document.getElementById(MOBILE_MENU_BUTTON_ID);
    const mobileMenu = document.getElementById(MOBILE_MENU_ID);
    if (!mobileMenuButton || !mobileMenu) return;
    const isExpanded =
      mobileMenuButton.getAttribute("aria-expanded") === "true";
    mobileMenu.classList.toggle("hidden");
    mobileMenuButton.setAttribute("aria-expanded", String(!isExpanded));
  }

  function closeMobileMenu() {
    const mobileMenuButton = document.getElementById(MOBILE_MENU_BUTTON_ID);
    const mobileMenu = document.getElementById(MOBILE_MENU_ID);
    if (!mobileMenuButton || !mobileMenu) return;
    mobileMenu.classList.add("hidden");
    mobileMenuButton.setAttribute("aria-expanded", "false");
  }

  function setupMobileMenu() {
    const mobileMenuButton = document.getElementById(MOBILE_MENU_BUTTON_ID);
    const mobileMenu = document.getElementById(MOBILE_MENU_ID);
    if (!mobileMenuButton || !mobileMenu) return;
    mobileMenuButton.addEventListener("click", toggleMobileMenu);
    const links = mobileMenu.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
    document.addEventListener("click", (e) => {
      if (
        !mobileMenu.contains(e.target) &&
        !mobileMenuButton.contains(e.target) &&
        !mobileMenu.classList.contains("hidden")
      ) {
        closeMobileMenu();
      }
    });
  }

  function setupFadeInSections() {
    const fadeSections = document.querySelectorAll(".fade-in-section");
    if (!("IntersectionObserver" in window)) {
      fadeSections.forEach((s) => s.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: FADE_IN_THRESHOLD }
    );
    fadeSections.forEach((section) => observer.observe(section));
  }

  function validateField(field) {
    if (!field) return true;

    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = "";

    clearFieldError(field);

    switch (fieldName) {
      case "name":
        if (!value) {
          errorMessage = "Name is required";
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = "Name must be at least 2 characters long";
          isValid = false;
        }
        break;

      case "email":
        if (!value) {
          errorMessage = "Email is required";
          isValid = false;
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errorMessage = "Please enter a valid email address";
            isValid = false;
          }
        }
        break;

      case "message":
        if (!value) {
          errorMessage = "Message is required";
          isValid = false;
        } else if (value.length < 10) {
          errorMessage = "Message must be at least 10 characters long";
          isValid = false;
        }
        break;
    }

    if (!isValid) {
      showFieldError(field, errorMessage);
    }

    return isValid;
  }

  function showFieldError(field, message) {
    if (!field) return;

    field.classList.add("border-red-500", "focus:ring-red-500");
    field.classList.remove(
      "border-kemet-charcoal",
      "focus:ring-kemet-gold",
      "dark:border-dark-border",
      "dark:focus:ring-dark-accent"
    );

    const errorDiv = document.createElement("div");
    errorDiv.className = "text-red-600 text-sm mt-1 font-medium";
    errorDiv.textContent = message;
    errorDiv.id = `error-${field.id}`;

    const fieldContainer = field.parentElement;
    if (fieldContainer && !fieldContainer.querySelector(`#error-${field.id}`)) {
      fieldContainer.appendChild(errorDiv);
    }
  }

  function clearFieldError(field) {
    if (!field) return;

    field.classList.remove("border-red-500", "focus:ring-red-500");
    field.classList.add(
      "border-kemet-charcoal",
      "focus:ring-kemet-gold",
      "dark:border-dark-border",
      "dark:focus:ring-dark-accent"
    );

    const errorDiv = document.getElementById(`error-${field.id}`);
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  function setupContactForm() {
    const contactForm = document.getElementById(CONTACT_FORM_ID);
    if (!contactForm) return;

    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");

    [nameField, emailField, messageField].forEach((field) => {
      if (field) {
        field.addEventListener("blur", () => validateField(field));
        field.addEventListener("input", () => clearFieldError(field));
      }
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const isNameValid = validateField(nameField);
      const isEmailValid = validateField(emailField);
      const isMessageValid = validateField(messageField);

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        showFormStatus(
          "Please correct the errors above and try again.",
          "text-center mt-4 text-red-600 font-medium"
        );
        return;
      }

      showFormStatus(
        "Sending your message...",
        "text-center mt-4 text-kemet-blue font-medium"
      );

      const formData = new FormData(contactForm);
      fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            showFormStatus(
              "Thank you for your message! I'll get back to you soon.",
              "text-center mt-4 text-kemet-green font-medium"
            );
            contactForm.reset();
            [nameField, emailField, messageField].forEach((field) => {
              clearFieldError(field);
            });
          } else {
            showFormStatus(
              "Sorry, there was a problem sending your message. Please try again later.",
              "text-center mt-4 text-red-600 font-medium"
            );
          }
        })
        .catch(() => {
          showFormStatus(
            "Sorry, there was a problem sending your message. Please try again later.",
            "text-center mt-4 text-red-600 font-medium"
          );
        });
    });
  }

  function scrollToSection(targetId) {
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    const headerOffset = getHeaderOffset();
    const targetRect = targetElement.getBoundingClientRect();
    const desiredTop = window.scrollY + targetRect.top - headerOffset;
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const finalTop = Math.max(0, Math.min(desiredTop, maxScroll));
    window.scrollTo({ top: finalTop, behavior: "smooth" });
    targetElement.setAttribute("tabindex", "-1");
    targetElement.focus({ preventScroll: true });
  }

  function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId === "#" || !document.querySelector(targetId)) return;
        e.preventDefault();
        scrollToSection(targetId);
      });
    });
  }

  function setupResumeActions() {
    const printButton = document.getElementById("resume-print");
    if (printButton) {
      printButton.addEventListener("click", function () {
        window.print();
      });
    }
  }

  function formatCvHtml(cv) {
    function section(title, content) {
      return `<div class="mb-4"><h4 class="font-pixel text-base text-kemet-blue mb-2">${title}</h4>${content}</div>`;
    }
    let html = "";
    if (cv && cv.personal) {
      html += section(
        "Personal",
        `
              <ul>
                <li><strong>Name:</strong> ${cv.personal.name || ""}</li>
                <li><strong>Email:</strong> <a href="mailto:${
                  cv.personal.email || ""
                }" class="underline text-kemet-blue">${
          cv.personal.email || ""
        }</a></li>
                <li><strong>Location:</strong> ${
                  cv.personal.location || ""
                }</li>
                <li><strong>Website:</strong> ${
                  cv.personal.website
                    ? `<a href="${cv.personal.website}" target="_blank" class="underline text-kemet-blue">${cv.personal.website}</a>`
                    : ""
                }</li>
                <li><strong>LinkedIn:</strong> ${
                  cv.personal.linkedin
                    ? `<a href="${cv.personal.linkedin}" target="_blank" class="underline text-kemet-blue">Profile</a>`
                    : ""
                }</li>
                <li><strong>GitHub:</strong> ${
                  cv.personal.github
                    ? `<a href="${cv.personal.github}" target="_blank" class="underline text-kemet-blue">Profile</a>`
                    : ""
                }</li>
              </ul>
            `
      );
    }
    if (cv && Array.isArray(cv.education)) {
      html += section(
        "Education",
        cv.education
          .map(
            (ed) =>
              `<div class="mb-2">
                <strong>${ed.degree || ""}</strong> - ${
                ed.institution || ""
              } <span class="text-xs text-kemet-charcoal">(${
                ed.years || ""
              })</span>
                ${
                  Array.isArray(ed.details)
                    ? `<ul class="list-disc ml-6">${ed.details
                        .map((d) => `<li>${d}</li>`)
                        .join("")}</ul>`
                    : ""
                }
              </div>`
          )
          .join("")
      );
    }
    if (cv && cv.skills) {
      html += section(
        "Skills",
        `
              <div class="mb-2"><strong>Technical:</strong> ${(
                cv.skills.technical || []
              ).join(", ")}</div>
              <div><strong>Soft:</strong> ${(cv.skills.soft || []).join(
                ", "
              )}</div>
            `
      );
    }
    if (cv && Array.isArray(cv.projects)) {
      html += section(
        "Projects",
        cv.projects
          .map(
            (pr) =>
              `<div class="mb-2">
                <strong>${
                  pr.name || ""
                }</strong> <span class="text-xs text-kemet-charcoal">${(
                pr.tags || []
              ).join(", ")}</span><br>
                <span>${pr.description || ""}</span>
                ${
                  pr.url
                    ? `<br><a href="${pr.url}" target="_blank" class="underline text-kemet-blue">GitHub</a>`
                    : ""
                }
                ${
                  pr.status
                    ? `<span class="ml-2 px-2 py-1 rounded bg-kemet-gold/30 text-kemet-charcoal text-xs">${pr.status}</span>`
                    : ""
                }
              </div>`
          )
          .join("")
      );
    }
    if (cv && Array.isArray(cv.languages)) {
      html += section("Languages", cv.languages.join(", "));
    }
    return html;
  }

  function setupAstCvModal() {
    const astCvBtn = document.getElementById("view-ast-cv");
    const astCvModal = document.getElementById("ast-cv-modal");
    const astCvContent = document.getElementById("ast-cv-content");
    const closeAstCv = document.getElementById("close-ast-cv");
    if (!astCvBtn || !astCvModal || !astCvContent || !closeAstCv) return;
    astCvBtn.addEventListener("click", function () {
      fetch("Muaz_Al_Jabali_CV.json")
        .then((res) => res.json())
        .then((data) => {
          astCvContent.innerHTML = formatCvHtml(data);
          astCvModal.classList.remove("hidden");
        })
        .catch(() => {
          astCvContent.innerHTML =
            "<div class='text-red-600'>Failed to load CV JSON.</div>";
          astCvModal.classList.remove("hidden");
        });
    });
    closeAstCv.addEventListener("click", function () {
      astCvModal.classList.add("hidden");
    });
    astCvModal.addEventListener("click", function (e) {
      if (e.target === astCvModal) astCvModal.classList.add("hidden");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") astCvModal.classList.add("hidden");
    });
  }

  function setupNavStyles() {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.add(
        "text-sm",
        "font-semibold",
        "tracking-wider",
        "uppercase",
        "hover:text-kemet-gold",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-kemet-gold",
        "rounded-md",
        "transition-colors",
        "duration-300"
      );
    });
    document.querySelectorAll(".mobile-nav-link").forEach((link) => {
      link.classList.add(
        "block",
        "py-3",
        "px-6",
        "text-sm",
        "hover:bg-kemet-gold/20",
        "focus:bg-kemet-gold/20",
        "focus-visible:outline-none",
        "transition-colors",
        "duration-200"
      );
    });
  }

  function setupFieldButtons() {
    const buttons = document.querySelectorAll(".field-button");
    if (!buttons || !buttons.length) return;
    let highlightTimer = null;
    buttons.forEach((btn) => {
      btn.addEventListener("click", function () {
        buttons.forEach((b) => {
          b.setAttribute("aria-pressed", "false");
          b.classList.remove("active");
        });
        this.setAttribute("aria-pressed", "true");
        this.classList.add("active");
        const field = this.dataset.field;
        scrollToSection("#skills");
        const skillCards = document.querySelectorAll("[data-fields]");
        skillCards.forEach((card) => {
          const fields = (card.dataset.fields || "")
            .split(",")
            .map((s) => s.trim());
          if (fields.includes(field)) {
            card.classList.add("skill-highlight");
            card.classList.remove("skill-fadeout");
          } else {
            card.classList.remove("skill-highlight");
            card.classList.remove("skill-fadeout");
          }
        });
        if (highlightTimer) clearTimeout(highlightTimer);
        highlightTimer = setTimeout(() => {
          buttons.forEach((b) => {
            b.setAttribute("aria-pressed", "false");
            b.classList.remove("active");
          });
          skillCards.forEach((card) => {
            card.classList.remove("skill-highlight");
          });
        }, 1000);
      });
    });
  }

  function equalizeCardHeights() {
    const projectCards = document.querySelectorAll(".project-card");
    let maxHeight = 0;
    projectCards.forEach((card) => {
      card.style.height = "auto";
      maxHeight = Math.max(maxHeight, card.offsetHeight);
    });
    projectCards.forEach((card) => {
      card.style.height = maxHeight + "px";
    });
  }

  function adjustDividerHeight() {
    const skillsSection = document.querySelector("#skills");
    const divider = document.getElementById("skills-divider");
    if (skillsSection && divider) {
      const skillsGrid = skillsSection.querySelector(".bg-white .skills-grid");
      if (skillsGrid) {
        const skillsHeight = skillsGrid.offsetHeight * 1.35;
        divider.style.height = skillsHeight + "px";
      }
    }
  }

  function equalizeSkillHeights() {
    const allSkillCards = document.querySelectorAll(".skills-grid > div");
    let maxHeight = 0;
    allSkillCards.forEach((card) => {
      card.style.height = "auto";
      maxHeight = Math.max(maxHeight, card.offsetHeight);
    });
    allSkillCards.forEach((card) => {
      card.style.height = maxHeight + "px";
    });
    adjustDividerHeight();
  }

  setCurrentYear();
  setupMobileMenu();
  setupFadeInSections();
  setupContactForm();
  setupSmoothScrolling();
  setupResumeActions();
  setupAstCvModal();
  setupNavStyles();
  setupFieldButtons();

  const emailIcon = document.getElementById("email-icon");
  const emailTooltip = document.getElementById("email-tooltip");
  let emailTooltipTimer = null;
  if (emailIcon && emailTooltip) {
    emailIcon.addEventListener("click", function (e) {
      e.preventDefault();
      emailTooltip.style.visibility = "visible";
      emailTooltip.style.opacity = "1";
      if (emailTooltipTimer) clearTimeout(emailTooltipTimer);
      emailTooltipTimer = setTimeout(() => {
        emailTooltip.style.visibility = "";
        emailTooltip.style.opacity = "";
      }, 2000);
    });
  }

  window.addEventListener("load", function () {
    equalizeCardHeights();
    equalizeSkillHeights();
  });
  window.addEventListener("resize", function () {
    equalizeCardHeights();
    equalizeSkillHeights();
  });
});
