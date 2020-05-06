function parseC(str, mode) {
  const regC = '0';
  const namC = '1'; const nam = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$";
  const clsC = '2'; // ^ but starting with uppercase
  const opsC = '3'; const ops = "=+-*/<>&|%!~";
  const keyC = '4';
  const digC = '5'; const dig = "0123456789¯∞";
  const strC = '6';
  const funC = '7';
  const rgxC = '8';
  const comC = 'C';
  const keyw = 
    mode == 'Java'?
    ['abstract','assert','boolean','break','byte','case','catch','char','class','const','continue','default',
    'do','double','else','enum','extends','final','finally','float','for','goto','if','implements','import','instanceof',
    'int','interface','long','native','new','package','private','protected','public','return','short','static','strictfp',
    'super','switch','synchronized','this','throw','throws','transient','try','void','volatile','while']
  : mode == 'JS'?
    ['abstract','arguments','await','boolean','break','byte','case','catch','char','class','const','continue','debugger',
    'default','delete','do','double','else','enum','eval','export','extends','false','final','finally','float','for','function',
    'goto','if','implements','import','in','instanceof','int','interface','let','long','native','new','null','package','private',
    'protected','public','return','short','static','super','switch','synchronized','this','throw','throws','transient','true',
    'try','typeof','var','void','volatile','while','with','yield']
  :
    ['auto','break','case','char','const','continue','default','do','double','else','enum',
    'extern','float','for','goto','if','int','long','register','return','short','signed','sizeof',
    'static','struct','switch','typedef','union','unsigned','void','volatile','while'];
  if (!window.CStyle) {
    let s = document.createElement("style");
    s.id = "CStyle";
    s.innerText=`
      .C${opsC} { color: #CC7832; }
      
      .C${digC} { color: #6897BB; }
      .C${regC} { color: #D2D2D2; }
      .C${namC} { color: #D2D2D2; }
      .C${clsC} { color: #81A2BE; }
      .C${funC} { color: #AC885B; }
      .C${strC} { color: #F9EE98; }
      .C${rgxC} { color: #F9EE98; }
      .C${comC} { color: #808080; }
      .C${keyC} { color: #cf6a4c; }
    `;
    document.body.appendChild(s);
  }
  const res = new Array(str.length).fill();
  res[0] = regC;
  
  for (let i = 0; i < str.length; ) {
    const p = str[i-1]||'\0';
    const c = str[i  ];
    const n = str[i+1]||'\0';
    
    if (mode=='JS' && c=='/' && n!='*' && n!='/') {
      let j = i-1;
      while(str[j] && /\s/.test(str[j])) j--;
      if ((ops+"({[").includes(str[j])) {
        res[i] = rgxC;
        let si = i;
        i++;
        while(str[i] && str[i]!='/' && str[i]!='\n') i+= str[i]=='\\'? 2 : 1;
        if (str[i]=='\n') {
          res[si] = regC;
          i = si;
        } else {
          i++;
          while(str[i]>='a' && str[i]<='z')i++;
          continue;
        }
      }
    }
    
    if (c=='/' && n=='*') {
      res[i] = comC;
      i+= 2;
      while(str[i] && !(str[i]=='*' && str[i+1]=='/')) i++;
      i+= 2;
      continue;
    }
    else if (c=='"' || c=="'" || ((mode=='JS'||mode=='Java') && c=="`")) {
      res[i] = strC;
      i++;
      while(str[i] && str[i]!=c && (str[i]!='\n' || c=="`")) i+= str[i]=='\\'? 2 : 1;
    }
    else if (c=='/' && n=='/') {
      res[i] = comC;
      while(str[i] && str[i]!='\n') i++;
    }
    else if (dig.includes(c) || c=='.'&&dig.includes(n)) {
      res[i] = digC;
           if (str[i]=='0' && str[i+1]=='x') { i+= 2; while('0123456789abcdefABCDEF'.includes(str[i])) i++; }
      else if (str[i]=='0' && str[i+1]=='b') { i+= 2; while(str[i]=='0'||str[i]=='1') i++; }
      else while(dig.includes(str[i]) || str[i]=='e' || str[i]=='E' || str[i]=='.') i++;
      if (mode!='JS') while('fFlLdDuU'.includes(str[i])) i++;
      continue;
    }
    else if (nam.includes(c)) {
      let si = i;
      while(nam.includes(str[i]) || dig.includes(str[i])) i++;
      if (keyw.includes(str.substring(si, i))) res[si] = keyC;
      else {
        res[si] = str[si].toLowerCase()!=str[si]? clsC : namC;
        if (mode!='JS' && res[si] == clsC) continue;
        let j = i;
        while (str[j] && str[j]==' ') j++;
        if (str[j]=='(') { res[si] = funC; continue; }
        if (mode=='JS') {
          if (str[j]!='=') continue;
          j++;
          while (str[j] && str[j]==' ') j++;
          if (str[j]=='f' && str.substring(j, j+8)=='function') { res[si] = funC; continue; }
          if (str[j]=='(') {
            let d = 1;
            while(str[j] && d) { j++; if(str[j]=='(')d++; else if (str[j]==')')d--; }
            j++;
          } else while(nam.includes(str[j]) || dig.includes(str[j])) j++;
          while (str[j] && str[j]==' ') j++;
          if (str[j]=='=' && str[j+1]=='>') res[si] = funC;
        }
      }
      continue;
    }
    else if (ops.includes(c)) res[i] = opsC;
    else if (!' \n\t'.includes(c)) res[i] = regC;
    i++;
  }
  return res;
}
langs.C = mode => {
  let str = main.value;
  colorCode(str, parseC(str, mode), 'C');
}
langs.JS = () => langs.C('JS');
langs.Java = () => langs.C('Java');