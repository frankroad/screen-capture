module.exports = (() => {

  const ratio = window.devicePixelRatio;

  function scrollTop() {
    return document.body.parentElement.scrollTop;
  }

  function scrollTo(offset) {
    document.body.parentElement.scrollTo({ top: offset, behavior: 'auto', block: 'nearest', inline: 'start' });
  }

  function scrollStart(callback) {
    scrollTo(0);
    let ratio = window.devicePixelRatio;
    let visibleHeight = window.innerHeight;
    let visibleWidth = window.innerWidth;
    let scrollHeight = document.body.parentElement.scrollHeight;
    let finishScrollHeight = scrollHeight - visibleHeight;
    let currentScrollTop = scrollTop();
    let data = {"currentScrollTop": currentScrollTop, "visibleHeight": visibleHeight, "finishScrollHeight": finishScrollHeight, "visibleWidth": visibleWidth, "ratio": ratio};
    callback({"data": data});
  }

  function scroll(callback) {
    let visibleHeight = window.innerHeight;
    let ratio = window.devicePixelRatio;
    let visibleWidth = window.innerWidth;
    let scrollHeight = document.body.parentElement.scrollHeight;
    let finishScrollHeight = scrollHeight - visibleHeight;
    scrollTo(scrollTop() + visibleHeight);
    let currentScrollTop = scrollTop();
    let data = {"currentScrollTop": currentScrollTop, "visibleHeight": visibleHeight, "finishScrollHeight": finishScrollHeight, "visibleWidth": visibleWidth, "ratio": ratio};
    callback({"data": data});
  }

  return {
    scroll: scroll,
    scrollStart: scrollStart
  }
})();
