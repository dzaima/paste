function parseAsm(str) {
  const regC = '0'; // plain text
  const insC = '1'; // instruction - add, mov, etc
  const ptrC = '2'; // QWORD PTR etc
  const barC = '3'; // vertical bar separating hex/timings and asm
  const lblC = '4'; // labels
  const digC = '5'; // numbers
  const strC = '6'; // strings
  const argC = '7'; // registers
  const rawC = '8'; // hex form of instructions
  const comC = 'C'; // comments
  if (!window.SStyle) {
    let s = document.createElement("style");
    s.id = "SStyle";
    // colors based on/stolen from godbolt.org
    s.innerText=`
      body.dt .S${regC} { color: #D2D2D2; }  body.lt .S${regC} { color: #000000; }
      body.dt .S${insC} { color: #7AAFDB; }  body.lt .S${insC} { color: #0000FF; }
      body.dt .S${ptrC} { color: #CC6666; }  body.lt .S${ptrC} { color: #6F42C1; }
      body.dt .S${argC} { color: #5B73B2; }  body.lt .S${argC} { color: #6F42C1; }
      body.dt .S${lblC} { color: #3DC9B0; }  body.lt .S${lblC} { color: #008080; }
      body.dt .S${comC} { color: #808080; }  body.lt .S${comC} { color: #6A737D; }
      body.dt .S${digC} { color: #B5CEA8; }  body.lt .S${digC} { color: #098658; }
      body.dt .S${strC} { color: #CE9178; }  body.lt .S${strC} { color: #032F62; }
      body.dt .S${rawC} { color: #C4C4C4; }  body.lt .S${rawC} { color: #474A4F; } .S${rawC} { font-size: .8em; }
      body.dt .S${barC}:after { border-color: #C4C4C4; }
      body.lt .S${barC}:after { border-color: #777B82; }
      .S${barC} { visibility: hidden; font-size:0px; } /* horrible hack, but it appears to work so */
      .S${barC}:after { font-size: 14px; visibility: visible; content: ""; border-right: 1px solid; }
    `;
    document.body.appendChild(s);
  }
  
  const num = (c) => c>='0'&c<='9';
  const hex = (c) => num(c) | c>='a'&c<='f' | c>='A'&c<='F';
  const dec = (c) => num(c) | c=='.' | c=='e';
  const al = (c) => c>='a'&c<='z' | c>='A'&c<='Z' | c=='_';
  const alnum = (c) => al(c) | num(c) | c=='.';
  const regs = /^(([re]?(ip|ax|bx|cx|dx|si|di|sp|bp))|[abcd][hl]|(si|di|sp|bp)l|r(8|9|1[0-5])[dwb]?|[cdsefg]s|[xyz]mm([12]?[0-9]|3[01])|[cdt]r[0-9]+)$/;
  
  const res = new Array(str.length).fill();
  res[0] = regC;
  let i = 0;
  let len = str.length;
  let hasAl = false;
  while (i < len) {
    if (i==0 || str[i-1]=='\n') {
      let j = i;
      let raw;
      hasAl = false;
      while (true) {
        let c = str[j];
        if (c=='/' | c=='#' | c=='"' | c=="'" | c=='[' | c=='(' | c=='|' | c=='│') { raw = c=='|'|c=='│'; break; }
        j++;
      }
      if (raw) {
        res[i] = rawC;
        res[j] = barC;
        i = j+1;
      }
    }
    let si = i;
    const c = str[i++];
    switch(c) {
      case '/':
        if (str[i]=='*') {
          res[si] = comC;
          i+= 2;
          while (i<len && !(str[i-1]=='*' && str[i]=='/')) i++;
          break;
        }
        if (str[i]!='/') break;
        // fallthrough
      case '#': // comments
        res[si] = comC;
        while (i<len && str[i]!='\n') i++;
        break;
      case '<': // refs
        res[si] = strC;
        while (i<len && str[i]!='\n' && str[i-1]!='>') i++;
        break;
      case '%':
        res[si] = argC;
        break;
      case '"': case "'": case '`': // strings
        res[si] = strC;
        while (i<len && str[i]!=c) i+= str[i]=='\\'?2:1;
        i++;
        break;
      default: // keywords
        if (al(c) || c=='.'&&al(str[i])) {
          while (alnum(str[i])) i++;
          let ty;
          if (str[i]==':') {
            i++;
            ty = lblC;
          } else {
            let w = str.substring(si,i).toLowerCase();
            let wend = w.length;
            while (wend>0 && num(w[wend-1])) wend--;
            if (wend<5 && regs.test(w)) ty = argC;
            if (!ty && ['ptr','byte','word','dword','qword','tword','mmword','xmmword','ymmword','zmmword'].includes(w)) ty = ptrC;
          }
          if (!ty) ty = hasAl? lblC : insC;
          res[si - (str[si-1]=='$'? 1 : 0)] = ty;
          hasAl = true;
        } else if (num(c) || c=='.'&&num(str[i])) {
          res[si - (str[si-1]=='$'? 1 : 0)] = digC;
          let t;
          if (str[i]=='x') {
            i++;
            while (hex(str[i])) i++;
          } else {
            if (str[i]=='b') i++;
            while (dec(str[i])) i++;
          }
          if (str[i]==':') i++;
        } else res[si] = regC;
        break;
    }
  }
  return res;
}
langs.asm = () => {
  let str = main.value;
  genc.innerHTML = colorCode(str, parseAsm(str), 'S');
}

htmlgen.asm = (str, ...lang) => colorCode(str, parseAPL(str, lang), 'S');