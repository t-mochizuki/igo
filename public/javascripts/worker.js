(function () {
  var color = 0;
  var state = [];
  var i, row, column;
  i = 0;
  for (row = 0; row < 19; ++row) {
    state[row] = [];
    for (column = 0; column < 19; ++column, ++i) {
      state[row][column] = { id: i, color: 2, row: row, column: column };
    }
  }

  function id2coordinate(id) {
    return { row: Math.trunc(id / 19), column: id % 19 };
  }

  function sendResponse(arr) {
    postMessage(arr);
  }

  function safe(s, color, checklist, removelist) {
    removelist.push(s.id);

    if (s.row === 0) {
    } else {
      var u = state[s.row - 1][s.column];
      if (checklist.indexOf(u.id) == -1) {
        checklist.push(u.id);
        if (u.color == 2) {
          return true;
        } else if (u.color != color) {
        } else {
          if (safe(u, color, checklist, removelist)) return true;
        }
      }
    }
    if (s.column === 18) {
    } else {
      var r = state[s.row][s.column + 1];
      if (checklist.indexOf(r.id) == -1) {
        checklist.push(r.id);
        if (r.color == 2) {
          return true;
        } else if (r.color != color) {
        } else {
          if (safe(r, color, checklist, removelist)) return true;
        }
      }
    }
    if (s.row === 18) {
    } else {
      var d = state[s.row + 1][s.column];
      if (checklist.indexOf(d.id) == -1) {
        checklist.push(d.id);
        if (d.color == 2) {
          return true;
        } else if (d.color != color) {
        } else {
          if (safe(d, color, checklist, removelist)) return true;
        }
      }
    }
    if (s.column === 0) {
    } else {
      var l = state[s.row][s.column - 1];
      if (checklist.indexOf(l.id) == -1) {
        checklist.push(l.id);
        if (l.color == 2) {
          return true;
        } else if (l.color != color) {
        } else {
          if (safe(l, color, checklist, removelist)) return true;
        }
      }
    }
    return false;
  }

  function attack(s, yourcolor, xs) {
    var checklist = [];
    var removelist = [];
    if (s.row === 0) {
    } else {
      var u = state[s.row - 1][s.column];
      if (u.color != color) {
        checklist = [];
        removelist = [];
        if (safe(u, yourcolor, checklist, removelist)) {
          "safe";
        } else {
          "unsafe";
          for (i in removelist) {
            if (xs.indexOf(removelist[i]) == -1) {
              xs.push(removelist[i]);
            }
          }
        }
      }
    }
    if (s.column === 18) {
    } else {
      var r = state[s.row][s.column + 1];
      if (r.color != color) {
        checklist = [];
        removelist = [];
        if (safe(r, yourcolor, checklist, removelist)) {
          "safe";
        } else {
          "unsafe";
          for (i in removelist) {
            if (xs.indexOf(removelist[i]) == -1) {
              xs.push(removelist[i]);
            }
          }
        }
      }
    }
    if (s.row === 18) {
    } else {
      var d = state[s.row + 1][s.column];
      if (d.color != color) {
        checklist = [];
        removelist = [];
        if (safe(d, yourcolor, checklist, removelist)) {
          "safe";
        } else {
          "unsafe";
          for (i in removelist) {
            if (xs.indexOf(removelist[i]) == -1) {
              xs.push(removelist[i]);
            }
          }
        }
      }
    }
    if (s.column === 0) {
    } else {
      var l = state[s.row][s.column - 1];
      if (l.color != color) {
        checklist = [];
        removelist = [];
        if (safe(l, yourcolor, checklist, removelist)) {
          "safe";
        } else {
          "unsafe";
          for (i in removelist) {
            if (xs.indexOf(removelist[i]) == -1) {
              xs.push(removelist[i]);
            }
          }
        }
      }
    }
  }

  function receiveRequest(e) {
    e.stopPropagation();
    var c = id2coordinate(e.data.id);
    var s = state[c.row][c.column];
    var id = s.id;
    var xs = [];
    var checklist = [];
    var dummylist = [];

    if (s.color != 2) return;

    // convenient
    if (color == 0) {
      s.color = 1;
    } else {
      s.color = 0;
    }

    var yourcolor = s.color;
    if (safe(s, color, checklist, dummylist)) {
      s.color = color;
      attack(s, yourcolor, xs);
    } else {
      s.color = color;
      attack(s, yourcolor, xs);
      if (xs.length == 0) {
        s.color = 2;
        return;
      }
    }

    xs.map((x) => {
      var _c = id2coordinate(x);
      var _s = state[_c.row][_c.column];
      _s.color = 2;
    });

    var ys = xs.map((y) => { return { id: y, color: -1 } });
    ys.push({ id: id, color: color });
    sendResponse(ys);

    color += 1;
    color %= 2;
  }

  addEventListener("message", receiveRequest, false);
})();
