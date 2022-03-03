function parsePython(str) {
  const regC = '0';
  const namC = '1'; const nam = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$";
  const opsC = '3'; const ops = "=+-*/<>&|%!~@";
  const keyC = '4';
  const digC = '5'; const dig = "0123456789";
  const strC = '6';
  const funC = '7';
  const comC = 'C';
  const keyw = ['and','as','assert','break','class','continue','def','del','elif','else','except','False','finally','for','from','global','if','import','in','is','lambda','None','nonlocal','not','or','pass','raise','return','True','try','while','with','yield'];
  if (!window.PStyle) {
    let s = document.createElement("style");
    s.id = "PStyle";
    s.innerText=`
      body.dt .P${regC} { color: #D2D2D2; }  body.lt .P${regC} { color: #000000; }
      body.dt .P${namC} { color: #D2D2D2; }  body.lt .P${namC} { color: #000000; }
      body.dt .P${funC} { color: #AC885B; }  body.lt .P${funC} { color: #6F42C1; }
      body.dt .P${keyC} { color: #CF6A4C; }  body.lt .P${keyC} { color: #D73A49; }
      body.dt .P${comC} { color: #808080; }  body.lt .P${comC} { color: #6A737D; }
      body.dt .P${opsC} { color: #CC7832; }  body.lt .P${opsC} { color: #D73A49; }
      body.dt .P${digC} { color: #6897BB; }  body.lt .P${digC} { color: #005CC5; }
      body.dt .P${strC} { color: #F9EE98; }  body.lt .P${strC} { color: #032F62; }
    `;
    document.body.appendChild(s);
  }
  const res = new Array(str.length).fill();
  res[0] = regC;
  
  for (let i = 0; i < str.length; ) {
    const p = str[i-1]||'\0';
    const c = str[i  ];
    const n = str[i+1]||'\0';
    
    if (c=='"'||c=="'"  ||  (c=='r'||c=='u') && (n=='"'||n=="'")) {
      res[i] = strC;
      if (n==c && str[i+2]==c) {
        i+= 3;
        while(str[i] && !(str[i]==c&str[i+1]==c&str[i+2]==c)) i+= str[i]=='\\'? 2 : 1;
        
      } else {
        i++;
        while(str[i] && str[i]!=c && (str[i]!='\n')) i+= str[i]=='\\'? 2 : 1;
      }
    }
    else if (c=='#') {
      res[i] = comC;
      while(str[i] && str[i]!='\n') i++;
    }
    else if (dig.includes(c) || c=='.'&&dig.includes(n)) {
      res[i] = digC;
           if (str[i]=='0' && str[i+1]=='x') { i+= 2; while('0123456789abcdefABCDEF'.includes(str[i])) i++; }
      else if (str[i]=='0' && str[i+1]=='b') { i+= 2; while(str[i]=='0'||str[i]=='1') i++; }
      else while(dig.includes(str[i]) || str[i]=='e' || str[i]=='E' || str[i]=='.') i++;
      continue;
    }
    else if (nam.includes(c)) {
      let si = i; i++;
      while(nam.includes(str[i]) || dig.includes(str[i])) i++;
      let cstr = str.substring(si, i);
      if (keyw.includes(cstr)) res[si] = keyC;
      else {
        res[si] = namC;
        let j = i;
        while (str[j] && str[j]==' ') j++;
        if (str[j]=='(') { res[si] = funC; continue; }
      }
      continue;
    }
    else if (ops.includes(c)) res[i] = opsC;
    else if (!' \n\t'.includes(c)) res[i] = regC;
    i++;
  }
  return res;
}
langs.python = () => {
  let str = main.value;
  genc.innerHTML = colorCode(str, parsePython(str), 'P');
}
htmlgen.python = (str) => colorCode(str, parsePython(str), 'P');