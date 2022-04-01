function parseK(str) {
  const regC = '0';
  const fnsC = '1'; let   fns = "+-*%!&|<>=~,^#_?@.";
  const mopC = '2'; let   mop = "/'\\";
  const namC = '4'; const nam = "⎕⍞∆⍙ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const digC = '5'; const dig = "0123456789¯∞";
  const parC = '6';
  const dfnC = '7';
  const strC = '8'; // "abc"
  const dmdC = 'D'; const dmd = ":$";
  const comC = 'C';
  if (!window.kStyle) {
    const s = document.createElement("style");
    s.id = "kStyle";
    s.innerText=`
      body.dt .k${regC} { color: #D2D2D2; }  body.lt .k${regC} { color: #000000; }
      body.dt .k${namC} { color: #D2D2D2; }  body.lt .k${namC} { color: #000000; }
      body.dt .k${comC} { color: #898989; }  body.lt .k${comC} { color: #6A737D; }
      body.dt .k${digC} { color: #FF80F4; }  body.lt .k${digC} { color: #005CC5; }
      body.dt .k${parC} { color: #89A7DC; }  body.lt .k${parC} { color: #000000; }
      body.dt .k${dmdC} { color: #FFFF00; }  body.lt .k${dmdC} { color: #0000FF; }
      body.dt .k${strC} { color: #DDAAEE; }  body.lt .k${strC} { color: #032F62; }
      body.dt .k${fnsC} { color: #32E732; }  body.lt .k${fnsC} { color: #D73A49; }
      body.dt .k${mopC} { color: #FFF455; }  body.lt .k${mopC} { color: #ED5F00; }
      body.dt .k${dfnC} { color: #E3736D; }  body.lt .k${dfnC} { color: #A906D4; }
    `;
    document.body.appendChild(s);
  }
  const res = new Array(str.length).fill();
  res[0] = regC;
  for (let i = 0; i < str.length; ) {
    const p = str[i-1]||'\0';
    const c = str[i  ];
    const n = str[i+1]||'\0';
    
    if (dig.includes(c) || c=='.'&&dig.includes(n)) {
      res[i] = digC;
      while(dig.includes(str[i]) || '.eEnNbiwW'.includes(str[i])) i++;
      continue;
    }
    else if (c==' ' && n=='/'  ||  (p=='\n'||p=='\0') && c=='/' || i==0 && str.startsWith("#!")) {
      res[i] = comC;
      if (c=='/' && n=='\n') while(str[i] && str.substring(i-1,i+2)!="\n\\\n") i++;
      else while(str[i] && str[i]!='\n') i++;
    }
    else if (fns.includes(c) || c.codePointAt(0)>=0x80) res[i] = fnsC;
    else if (mop.includes(c)) {
      res[i] = mopC;
      if (n==':') res[++i] = mopC;
    }
    else if ("{xyz}".includes(c)) res[i] = dfnC;
    else if ("([])".includes(c)) res[i] = parC;
    else if (dmd.includes(c)) res[i] = dmdC;
    else if (nam.includes(c)) {
      res[i] = namC;
      while(nam.includes(str[i]) || dig.includes(str[i])) i++;
      continue;
    }
    else if (c=="'") {
      res[i] = strC; i++;
      while(str[i] && str[i]!="'" && str[i]!='\n') i++;
    }
    else if (c=='"') {
      res[i] = strC; i++;
      while(str[i] && str[i]!='"' && str[i]!='\n') i+= str[i]=='\\'? 2 : 1;
    }
    else if (!' \n\t'.includes(c)) res[i] = regC;
    i++;
  }
  return res;
}
langs.k = () => {
  let str = main.value;
  genc.innerHTML = colorCode(str, parseK(str), 'k');
}

htmlgen.k = (str, ...lang) => colorCode(str, parseK(str, lang), 'k');