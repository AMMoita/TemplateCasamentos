(function () {
  const existingIcons = document.querySelectorAll(
    'link[rel="icon"], link[rel="apple-touch-icon"]'
  );
  existingIcons.forEach(el => el.remove());

  const icons = [
    {
      rel: "icon",
      href: "../assets/favicon/favicon-32x32.ico",
      type: "image/png",
      sizes: "32x32"
    },
    {
      rel: "apple-touch-icon",
      href: "../assets/favicon/apple-touch-icon.png"
    }
  ];

  const isHomePage =
    window.location.pathname.endsWith("/index.html") ||
    window.location.pathname.endsWith("/") ||
    !window.location.pathname.includes("/pages/");

  icons.forEach(icon => {
    const link = document.createElement("link");
    link.rel = icon.rel;
    link.href = isHomePage
      ? icon.href.replace("../assets/", "assets/")
      : icon.href;
    if (icon.type) link.type = icon.type;
    if (icon.sizes) link.sizes = icon.sizes;
    document.head.appendChild(link);
  });
})();