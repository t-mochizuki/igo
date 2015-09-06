(function () {
  function change(id, pattern, prefix, f) {
    var image = document.getElementById(id);
    var src = image.getAttribute('src');
    image.setAttribute('src', src.replace(pattern, f));
    image.setAttribute('prefix', prefix);
  }

  function removePrefix(a, h, p, t) {
    if (a.indexOf('b-') === -1 && a.indexOf('w-') === -1) { return a; }
    var src = h + t;
    return src;
  }

  function removeStone(id) {
    change(id, /^(.*\/)([bw]-)(.*\.svg)$/, "", removePrefix);
  }

  function addWhitePrefix(a, h, t) {
    if (a.indexOf('b-') !== -1 || a.indexOf('w-') !== -1) { return a; }
    var src = h + "w-" + t;
    return src;
  }

  function addWhiteStone(id) {
    change(id, /^(.*\/)(.*\.svg)$/, "w-", addWhitePrefix);
  }

  function addBlackPrefix(a, h, t) {
    if (a.indexOf('b-') !== -1 || a.indexOf('w-') !== -1) { return a; }
    var src = h + "b-" + t;
    return src;
  }

  function addBlackStone(id) {
    change(id, /^(.*\/)(.*\.svg)$/, "b-", addBlackPrefix);
  }

  function receiveResponse(e) {
    for (obj of e.data) {
      // console.log(` receiveResponse id: ${obj.id}, color: ${obj.color} `);
      if (obj.color === -1) {
        removeStone(obj.id);
      } else if (obj.color === 0) {
        addBlackStone(obj.id);
      } else if (obj.color === 1) {
        addWhiteStone(obj.id);
      } else {
        // console.log("should not reache");
      }
    }
  }

  function startup() {
    var worker = new Worker("public/javascripts/worker.js");
    worker.addEventListener("message", receiveResponse, false);
    function sendRequest(e) {
      e.stopPropagation();
      // console.log(` sendRequest id: ${e.target.getAttribute('id')} `);
      if (e.target.tagName === "IMG") {
        worker.postMessage({ id: e.target.getAttribute('id') });
      }
    }
    var i;
    for (i = 0; i < document.images.length; ++i) {
      document.images[i].setAttribute('id', i);
    }
    var board = document.getElementsByTagName("table")[0];
    board.addEventListener("click", sendRequest, false);
  }

  document.onreadystatechange = function () {
    if (document.readyState === "complete") {
      startup();
    }
  }
}());
