function back() {
  const mainView = u(".main-view");
  const userView = mainView.find(".wrapper[view=users]");
  const wrappers = mainView.find(".wrapper");
  const nav = u(".nav-btn");
  const backArrow = u(".back-arrow");

  wrappers.removeClass("active");
  userView.addClass("active");
  nav.removeClass("active");
  backArrow.addClass("hidden");
}
export default back;