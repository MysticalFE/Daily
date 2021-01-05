document.addEventListener("mousedown", (event) => {
  const target = event.target;
  const body = document.body;
  const html = document.documentElement;
  const { left, top } = target.getBoundingClientRect();

  // 设置自定义属性值
  // body.style.setProperty("--pagex", event.pageX);
  // body.style.setProperty("--pagey", event.pageY);

  // html.style.setProperty("--clientx", event.clientX);
  // html.style.setProperty("--clienty", event.clientY);
  // html.style.setProperty("--scrolly", window.pageYOffset);

  target.style.setProperty("--offsetx", event.offsetX);
  target.style.setProperty("--offsety", event.offsetY);

  target.style.setProperty("--x", event.clientX - left + "px");
  target.style.setProperty("--y", event.clientY - top + "px");
  // target.parentElement.style.setProperty("--target-width", target.clientWidth);
  // target.parentElement.style.setProperty(
  //   "--target-height",
  //   target.clientHeight
  // );
  // target.parentElement.style.setProperty("--target-left", target.offsetLeft);
  // target.parentElement.style.setProperty("--target-top", target.offsetTop);
});
