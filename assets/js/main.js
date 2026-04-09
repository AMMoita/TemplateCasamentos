function loadFooter(options = {}) {
  const {
    names = "Maria e José",
    date = "25 de dezembro de 2026",
    creditName = "António Moita",
    creditLink = ""
  } = options;

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-ornament" aria-hidden="true"></div>

      <div class="footer-content">
        <p class="footer-names serif">${names}</p>
        <p class="footer-date">${date}</p>
      </div>

      <div class="footer-bottom">
        <p class="footer-credit">
          Website criado por
          ${creditLink
            ? `<a href="${creditLink}" target="_blank" rel="noopener noreferrer">${creditName}</a>`
            : creditName}
        </p>
        <p class="footer-license">
          © 2026 António Moita — Template protegido por licença.<br>
          Não é permitida a revenda, redistribuição ou reutilização não autorizada.
        </p>
      </div>
    </div>
  `;

  document.body.appendChild(footer);
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('.page');
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('.scroll-progress');
  const scrollHint = document.querySelector('.scroll-hint');
  const heroBg = document.querySelector('.hero-bg');
  const revealItems = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (page) {
    page.classList.add('is-ready');
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -8% 0px'
  });

  const observer = revealObserver;
  revealItems.forEach(item => revealObserver.observe(item));

  const updateScrollUi = () => {
    const y = window.scrollY || window.pageYOffset;

    if (header) {
      header.classList.toggle('is-scrolled', y > 24);
    }

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = progress + '%';
    }

    if (heroBg) {
      const offset = Math.min(y * 0.12, 60);
      heroBg.style.setProperty('--hero-parallax', `${offset}px`);
    }

    if (scrollHint) {
      const hasScroll = document.documentElement.scrollHeight > window.innerHeight + 20;

      if (!hasScroll) {
        scrollHint.style.display = 'none';
      } else {
        scrollHint.style.display = '';
        scrollHint.classList.toggle('is-hidden', y > 60);
      }
    }
  };

  updateScrollUi();

  window.addEventListener('scroll', updateScrollUi, { passive: true });
  window.addEventListener('resize', updateScrollUi);
  window.addEventListener('load', updateScrollUi);
  window.addEventListener('pageshow', updateScrollUi);
});

function copyIBAN(button) {
  const ibanEl = button.parentElement.querySelector('.iban');
  const iban = ibanEl.dataset.iban;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(iban);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = iban;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  const originalText = button.textContent;
  button.textContent = 'Copiado';
  button.disabled = true;

  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 1800);
}

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (backToTop) {
    if (window.scrollY > 300) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}