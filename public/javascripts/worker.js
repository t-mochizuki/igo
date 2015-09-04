var color = 0;
addEventListener("message", (e) => {
    postMessage({ id: e.data.id, color: color });
    if (e.data.color === "") {
      color += 1;
      color %= 2;
    }
});
