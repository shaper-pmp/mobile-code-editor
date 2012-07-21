function enabletouchtoedit() {
  makeeditable(document.getElementsByClassName("type"));
  makeeditable(document.getElementsByClassName("args"));
  makeeditable(document.getElementsByClassName("body"));
}

function makeeditable(els) {
  for(var i=0; i < els.length; i++) {
    els[i].onclick = function(e) {
      var el = e.target;
      var temp = prompt(">", el.innerText);
      if(temp != null) {
        var elroot = el.parentNode.parentNode;
        if(elroot.className != "statement") {
          el.innerText = temp;
        }
        else {
          addstatement(elroot.parentNode.parentNode, elroot, temp); 
        }
      }
    };
  }
}

function addblock(node, insertbefore) {
  var type = prompt("Block type (if, while, for, etc)");
  if(type != null) {
    var args = prompt("Block arguments (...)");
    if (args != null) {
      var newnode = document.createElement("div");
      newnode.className = "block";
      node.getElementsByClassName("code").item(0).insertBefore(newnode, insertbefore);
      newnode.innerHTML = '\
        <div class="ops">\
          <div class="op del del-block" onclick="delblock(this.parentElement.parentElement);">-</div>\
          <div class="op move" onmousedown="togglemovecontrols(this.parentElement.parentElement);">&loz;</div>\
          <div class="move-controls">\
            <a class="move-op" onclick="moveup(this.parentElement.parentElement.parentElement);">&uarr;</a>\
            <a class="move-op" onclick="movedown(this.parentElement.parentElement.parentElement);">&darr;</a>\
            <a class="move-op" onclick="togglemovecontrols(this.parentElement.parentElement.parentElement);">Done</a>\
          </div>\
        </div>\
        <div class="code">\
          <div class="type">'+type+'</div>\
          <div class="arg-delim open-delim delim">(</div>\
          <div class="args">'+args+'</div>\
          <div class="arg-delim close-delim delim">)</div>\
          <div class="body-delim open-delim delim">{\
</div>\
        </div>\
        <div class="ops last">\
          <div class="op add add-block" onclick="addblock(this.parentElement.parentElement);">Add block</div>\
          <div class="op add add-statement" onclick="addstatement(this.parentElement.parentElement);">Add statement</div>\
        </div>\
        <div class="body-delim close-delim delim">}\
</div>';
      addstatement(newnode);
      enabletouchtoedit();
      applysettings();
    }
  }
}

function addstatement(node, insertbefore, body) {
  if(body == null) {
    body = prompt("Statement ...;");
  }
  if(body != null) {
    stats = splitnotescaped(body, ";");
    for(var i=0;i<stats.length;i++) {
      if(stats[i] != null && stats[i].trim() != "") {
        var newnode = document.createElement("div");
        newnode.className = "statement";
        nodecode = node.getElementsByClassName("code").item(0);
        nodecode.insertBefore(newnode, insertbefore);
        newnode.innerHTML = '\
          <div class="ops">\
            <div class="op del del-statement" onclick="delstatement(this.parentElement.parentElement);">-</div>\
            <div class="op move" onclick="togglemovecontrols(this.parentElement.parentElement);">&loz;</div>\
            <div class="move-controls">\
              <a class="move-op" onclick="moveup(this.parentElement.parentElement.parentElement);">&uarr;</a>\
              <a class="move-op" onclick="movedown(this.parentElement.parentElement.parentElement);">&darr;</a>\
              <a class="move-op" onclick="togglemovecontrols(this.parentElement.parentElement.parentElement);">Done</a>\
            </div>\
          </div>\
          <div class="code">\
            <div class="body">'+stats[i]+'</div>\
            <div class="stat-delim delim">;\
</div>\
          </div>';
      }
    }
    if(insertbefore) {
      nodecode.removeChild(insertbefore);
    }
    enabletouchtoedit();
    applysettings();
  }
}

function delblock(node) {
  var type = node.getElementsByClassName("type").item(0).innerText;
  var args = node.getElementsByClassName("args").item(0).innerText; 
  if(confirm("Delete node "+type+"("+args+")?")) {
    node.parentElement.removeChild(node);
  }
}

function delstatement(node) {
  var body = node.getElementsByClassName("body").item(0).innerText;
  if(confirm("Delete node "+body+"?")) {
    node.parentElement.removeChild(node);
  }
}

function togglemovecontrols(el) {
  var controls = document.getElementsByClassName("move-controls");
  var control = null;
  if(el) {
    control = el.getElementsByClassName("move-controls").item(0);
  }
  for(var i=0;i<controls.length;i++) {
    if(controls.item(i) != control) {
      controls.item(i).style.display = "none";
      controls.item(i).parentElement.parentElement.style.backgroundColor = "transparent";
    }
  }
  if(control) {
    if(control.style.display == "block") {
      control.style.display = "none";
      el.style.backgroundColor = "transparent";
    }
    else {
      control.style.display = "block";
      el.style.backgroundColor = "#c0c0ff";
    }
  }
}

function moveup(el) {
  var prevsibling = el.previousSibling;
  var newparent = el.parentElement;
  
  // if moving element past the beginning of a block
  if(!prevsibling || (prevsibling.className != "block" && prevsibling.className != "statement")) {
    var parentblock = el.parentElement.parentElement;
    if(parentblock && parentblock.className == "block") {
      prevsibling = parentblock;
      newparent = prevsibling.parentElement;
    }
  }
  
  if(prevsibling) {
    // if previous element is a block at the same level as the selected element, move the selected element into the bottom of it instead of swapping places with it
    if(prevsibling.parentElement == el.parentElement && prevsibling.className == "block") {
      newparent = prevsibling.getElementsByClassName("code").item(0);
      prevsibling = null;
    }
    el.parentNode.removeChild(el);
    newparent.insertBefore(el, prevsibling);
  }
}

function movedown(el) {
  var nextsibling = el.nextElementSibling;
  var newparent = el.parentElement;
  
  // if moving element past the end of a block
  if(!nextsibling || (nextsibling.className != "block" && nextsibling.className != "statement")) {
    var parentblock = el.parentElement.parentElement;
    if(parentblock && parentblock.className == "block") {
      nextsibling = parentblock;
      newparent = nextsibling.parentElement;
    }
  }
  if(nextsibling) {
    // if next element is a block at the same level as the selected element, move the selected element into the top of it instead of swapping places with it
    if(nextsibling.parentElement == el.parentElement && nextsibling.className == "block") {
      newparent = nextsibling.getElementsByClassName("code").item(0);
      el.parentNode.removeChild(el);
      newparent.insertBefore(el, newparent.getElementsByClassName("body-delim open-delim").item(0).nextElementSibling);
    }
    else {
      //alert(nextsibling.nextElementSibling);
      el.parentElement.removeChild(el);
      newparent.insertBefore(el, nextsibling.nextElementSibling);
    }
  }
}

function togglesetting(option, forcevalue) {
  if(forcevalue != null) {
    window[option] = forcevalue;
  }
  else if(window[option] != null) {
    window[option] = !window[option];
  }
  else {
    window[option] = true;
  }
  
  switch(option) {
    case "showboilerplate":
      delims = document.getElementsByClassName("delim");
      for(var i=0;i<delims.length;i++) {
        delims[i].style.display = window.showboilerplate? 'inline': 'none';
      }
      break;
    case 'showops':
      togglemovecontrols();
      delims = document.getElementsByClassName("ops");
      for(var i=0;i<delims.length;i++) {
        delims[i].style.display = window.showops? 'block': 'none';
      }
      break;
  }
}

function applysettings() {
  togglesetting('showboilerplate', window['showboilerplate']);
  togglesetting('showops', window['showops']);
}

function getsourcecode(rootelement, callback) {
  var showops = window.showops;
  var showboilerplate = window.showboilerplate;
  togglesetting('showops', false);
  togglesetting('showboilerplate', true);
  var sets = document.getElementById('settings');
  sets.style.display = 'none';
  var code = rootelement.innerText;
  callback(code);
  sets.style.display = 'block';
  togglesetting('showops', showops);
  togglesetting('showboilerplate', showboilerplate);
}

function run() {
  getsourcecode(document.getElementsByTagName('body').item(0), function(code) {
    //alert(code);
    eval(code);
  });
}

function save() {
  getsourcecode(document.getElementsByTagName('body').item(0), function(code) {
    var savewin = window.open('data:text/javascript;charset=UTF-8;base64,'+window.btoa(code), 'savewin');
  });
}

function indexofnotescaped ( str, delim, start) {

  if ( delim == null || delim == "" ) {
    return -1;
  }
  var i = start? start: 0;
  var strdelim="";

  while ( i<str.length ) {
    if ( str[i] == "\\" ) {
      i = i+2;
      continue;
    }
    if ( str[i]=='"' || str[i]=="'" ) {
      if ( strdelim == "" ) {
        strdelim = str[i];
      }
      else if (str[i] == strdelim) {
        strdelim = "";
      }
    }
    else if (strdelim == "") {
      if ( str[i] == delim ) {
        return i;
      } 
    }
    i++;
  }
  return -1;
}

function splitnotescaped(str, delim) {
  if(indexofnotescaped(str, delim) == -1) {
    return [str];
  }
  var stats = [];
  var start = 0;
  var pos=0;
  do {
    start = pos;
    result = indexofnotescaped(str, delim, pos);
    if(result != -1) {
      var token = str.substring(start, result);
      stats.push(token);
      pos = result+1;
    }
  }
  while(result != -1);
  var laststat = str.substr(pos);
  if(laststat) {
    stats.push(laststat);
  }
  return stats;
}

window.showboilerplate = false;
window.showops = true;















