function genDiff(str, largs) {
  const regC = 'D0';
  const addC = 'D1';
  const rmdC = 'D2';
  const ignC = 'D3';
  let lns = str.split('\n');
  let pS = 0;
  let pE = -1;
  let lni = 0;
  let nln = () => {
    let ln = lns[lni++];
    pS = pE+1;
    pE+= ln.length+1;
    return ln;
  }
  if (!window.DiffStyle) {
    let s = document.createElement("style");
    s.id = "DiffStyle";
    s.innerText=`
      body.dt .${regC} { color: #D2D2D2; }  body.lt .${regC} { color: #000000; }
      body.dt .${ignC} { color: #808080; }  body.lt .${ignC} { color: #808080; }
      
      body.dt .${rmdC} { width:100%; display:inline-block; background-color: #9F1E1E3B; }  body.lt .${rmdC} { width:100%; display:inline-block; background-color: #ff000033; }
      body.dt .${addC} { width:100%; display:inline-block; background-color: #469B463B; }  body.lt .${addC} { width:100%; display:inline-block; background-color: #00ff003b; }
    `;
    document.body.appendChild(s);
  }
  let res = "";
  let wrap = (str, cl) => "<span class="+cl+">"+str+"</span>";
  let pcode = main.value;
  while (lni != lns.length) {
    let ln = nln();
    switch(ln[0]) {
      case '\\': res+= wrap(html(ln), ignC)+"<br>"; break;
      case '@': res+= wrap(html(ln), ignC)+"<br>"; break;
      case '+': case '-': case ' ':
        let trln = ln.substring(1);
        // main.value=trln; lang(...largs); let cd = genc.innerHTML;
        let cd = htmlgen[largs[0]](trln, ...largs.slice(1));
        res+= wrap(ln[0]+cd, ln[0]=='+'? addC : ln[0]=='-'? rmdC : regC)+'<br>';
        break;
      default: res+= html(ln)+"<br>"; break;
    }
  }
  main.value = pcode;
  return res;
}

langs.diff = (...lang) => {
  let str = main.value;
  genc.innerHTML = genDiff(str, lang);
}

htmlgen.diff = (str, ...lang) => genDiff(str, lang);