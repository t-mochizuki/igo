(function () {
  function removeStone(a, h, p, t) {
    var src = h + t;
    return src;
  }

  function addWhite(a, h, t) {
    var src = h + "w-" + t;
    return src;
  }

  function addBlack(a, h, t) {
    var src = h + "b-" + t;
    return src;
  }

  function startup() {
    function response(e) {
      console.log(` response id: ${e.data.id}, color: ${e.data.color} `)
      var image = document.getElementById(e.data.id);
      if (image !== null) {
        var src = image.getAttribute('src');
        if (src.indexOf('b-') !== -1 || src.indexOf('w-') !== -1) {
          image.setAttribute('src', src.replace(/^(.*\/)([bw]-)(.*\.svg)$/, removeStone));
          image.setAttribute('color', "");
        } else {
          if (e.data.color === 0) {
            image.setAttribute('src', src.replace(/^(.*\/)(.*\.svg)$/, addBlack));
            image.setAttribute('color', "0");
          } else {
            image.setAttribute('src', src.replace(/^(.*\/)(.*\.svg)$/, addWhite));
            image.setAttribute('color', "1");
          }
        }
      }
    }

    function request(e) {
      console.log(` request id: ${e.target.getAttribute('id')}, color: ${e.target.getAttribute('color')} `)
      worker.postMessage({ id: e.target.getAttribute('id'), color: e.target.getAttribute('color') });
    }

    var worker = new Worker("public/javascripts/worker.js");
    worker.addEventListener("message", response);

    var i;
    for (i = 0; i < document.images.length; ++i) {
      document.images[i].setAttribute('id', i);
      document.images[i].setAttribute('color', "");
      document.images[i].addEventListener("click", request);
    }
  }

  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      startup();
    }
  }
})();
