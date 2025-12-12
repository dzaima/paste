let ansiColsBase   = ["2e3436","cf4545","5ab214","c4a000","3465a4","75507b","06989a","d3d7cf"];
let ansiColsBright = ["555753","ff6060","8ae234","fce94f","729fcf","ad7fa8","34e2e2","eeeeec"];

function hexCol(r,g,b) {
  return [r,g,b].map(c => c.toString(16).padStart(2,'0')).join('');
}

function parseANSI(str) {
  const cReg = 'r';
  const cEsc = '0';
  const cBold = 'B';
  const cUnder = 'U';
  const cItal = 'I';
  if (!window.ANSIStyle) {
    const s = document.createElement("style");
    s.id = "ANSIStyle";
    let css = `
      .T0 { display: none; }
      .TB { font-weight: bold }
      .TU { text-decoration: underline }
      .TI { font-style: italic }
    `;
    // b+= '.T0 { display: unset; color: #777 }';
    for (let i = 0; i < 8; i++) {
      let x = ansiColsBase[i];
      let y = ansiColsBright[i];
      css += `
        .TF${i}{color:           #${x}} .TFb${i}{color:           #${y}}
        .TB${i}{background-color:#${x}} .TBb${i}{background-color:#${y}}
      `;
    }
    s.innerText=css;
    document.body.appendChild(s);
  }
  
  const res = new Array(str.length).fill();
  let curr = 'r';
  let bold, under, ital;
  let bg, fg; // undefined: default; 0-7: regular colors; 8-15: bright; string: full color hex
  let reset = () => { bold=under=ital=false; bg=fg=undefined; }
  for (let i = 0; i < str.length; ) {
    let i0 = i;
    const c = str[i++];
    let now = curr;
    if (c == '\x1B') {
      if (str[i] == '[') {
        i++;
        let i1 = i;
        while (/[0-9;]/.test(str[i])) i++;
        let ns = str.slice(i1, i).split(';').map(c => +c);
        
        if (str[i] == 'm') {
          if (ns.length==0) {
            reset();
          }
          let j = 0;
          function color(n) {
            if (n<8) return n;
            if (n==9) return undefined;
            // n==8
            let k = ns[j++];
            if (k == 5) {
              let n = ns[j++];
              if (n < 16) return n;
              if (n <= 231) {
                let c = (n - 16).toString(6).padStart(3,'0');
                let exp = (v) => v==0? 0 : 55+v*40;
                return hexCol(exp(c[0]), exp(c[1]), exp(c[2]));
              }
              // n >= 232
              let c = (1+n-232) * 255 / 25 |0;
              return hexCol(c,c,c);
            } else if (k == 2) {
              return hexCol(ns[j++],ns[j++],ns[j++]);
            } else console.log("bad color");
          }
          while (j < ns.length) {
            let n = ns[j++];
            if      (n==0) reset();
            else if (n==1) bold = true;
            else if (n==3) ital = true;
            else if (n==4) under = true;
            else if (n==22) bold = false;
            else if (n==23) ital = false;
            else if (n>=30 && n<=39) fg = color(n-30);
            else if (n>=40 && n<=49) bg = color(n-40);
          }
          curr = '';
          if (bold)  curr+= " "+cBold;
          if (ital)  curr+= " "+cItal;
          if (under) curr+= " "+cUnder;
          for (let [ty,css,c] of [['F','color',fg], ['B','background-color',bg]]) {
            if (c === undefined) continue;
            if (typeof c === 'number') {
              curr += ' ' + ty + (bold||c>=8?'b':'') + (c%8);
            } else {
              curr += ' ' + css+':#'+c;
            }
          }
          
          if (curr[0] === ' ') curr = curr.slice(1);
          if (curr.length == 0) curr = cReg;
        }
        i++;
        now = cEsc;
      }
    }
    res[i0] = now;
  }
  return res;
}
langs.ansi = () => {
  let str = main.value;
  genc.innerHTML = colorCode(str, parseANSI(str), 'T');
}
htmlgen.ansi = (str) => colorCode(str, parseANSI(str), 'T');
