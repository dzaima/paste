function parseC(str, mode='C') {
  const regC = '0';
  const namC = '1'; const nam = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$";
  const clsC = '2'; // ^ but starting with uppercase
  const opsC = '3'; const ops = "=+-*/<>&|%!~^?:" + ((mode=='C' || mode=='C++')? "#" : "");
  const keyC = '4';
  const digC = '5'; const dig = "0123456789";
  const strC = '6';
  const funC = '7';
  const rgxC = '8';
  const comC = 'C';
  const keyw = 
    mode == 'Java'?
    ['_','abstract','assert','boolean','break','byte','case','catch','char','class','const','continue','default',
    'do','double','else','enum','extends','false','final','finally','float','for','goto','if','implements','import','instanceof',
    'int','interface','long','native','new','null','package','private','protected','public','return','short','static','strictfp',
    'super','switch','synchronized','this','throw','throws','transient','true','try','var','void','volatile','while']
  : mode == 'JS'?
    ['arguments','async','await','break','case','catch','class','const','constructor','continue','debugger','default','delete',
    'do','else','enum','eval','export','extends','false','finally','for','function','if','implements','import','in','instanceof',
    'interface','let','new','null','of','package','private','protected','public','return','static','super','switch','this','throw',
    'true','try','typeof','undefined','var','void','while','with','yield']
    // 'abstract','boolean','byte','char','double','final','float','goto','int','long','native','short','synchronized','throws','transient','volatile'
  : mode == 'singeli'?
    ['_','and','config','def','do','else','extend','fn','from','if','if_inline','in','include','local','match','not','oper','or','over','return','to','while']
  : mode == 'C++'?
    ['alignas','alignof','and','and_eq','asm','atomic_cancel','atomic_commit','atomic_noexcept','auto','bitand','bitor','bool',
    'break','case','catch','char','char16_t','char32_t','char8_t','class','co_await','co_return','co_yield','compl','concept',
    'const','const_cast','consteval','constexpr','constinit','continue','decltype','default','delete','do','double','dynamic_cast',
    'else','enum','explicit','export','extern','false','float','for','friend','goto','if','inline','int','long','mutable',
    'namespace','new','noexcept','not','not_eq','nullptr','operator','or','or_eq','private','protected','public','reflexpr',
    'register','reinterpret_cast','requires','return','short','signed','sizeof','static','static_assert','static_cast','struct',
    'switch','synchronized','template','this','thread_local','throw','true','try','typedef','typeid','typename','union','unsigned',
    'using','virtual','void','volatile','wchar_t','while','xor','xor_eq']
  :
    ['auto','break','case','char','const','continue','default','do','double','else','enum',
    'extern','float','for','goto','if','int','long','register','return','short','signed','sizeof',
    'static','struct','switch','typedef','union','unsigned','void','volatile','while'];
  if (!window.CStyle) {
    let s = document.createElement("style");
    s.id = "CStyle";
    s.innerText=`
      body.dt .C${regC} { color: #D2D2D2; }  body.lt .C${regC} { color: #000000; }
      body.dt .C${namC} { color: #D2D2D2; }  body.lt .C${namC} { color: #000000; }
      body.dt .C${clsC} { color: #81A2BE; }  body.lt .C${clsC} { color: #6F42C1; }
      body.dt .C${funC} { color: #AC885B; }  body.lt .C${funC} { color: #6F42C1; }
      body.dt .C${keyC} { color: #CF6A4C; }  body.lt .C${keyC} { color: #D73A49; }
      body.dt .C${comC} { color: #808080; }  body.lt .C${comC} { color: #6A737D; }
      body.dt .C${opsC} { color: #CC7832; }  body.lt .C${opsC} { color: #D73A49; }
      body.dt .C${digC} { color: #6897BB; }  body.lt .C${digC} { color: #005CC5; }
      body.dt .C${strC} { color: #F9EE98; }  body.lt .C${strC} { color: #032F62; }
      body.dt .C${rgxC} { color: #F9EE98; }  body.lt .C${rgxC} { color: #032F62; }
    `;
    document.body.appendChild(s);
  }
  
  const res = new Array(str.length).fill();
  res[0] = regC;
  
  for (let i = 0; i < str.length; ) {
    const p = str[i-1]||'\0';
    const c = str[i  ];
    const n = str[i+1]||'\0';
    
    if ((mode=='C' || mode=='C++')  && (p==='\0' || p==='\n')) {
      let j = i;
      while (' \n\t'.includes(str[j])) j++;
      if (str[j]=='#') {
        i = j;
        res[i++] = opsC;
        while ('_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(str[i])) i++;
        continue;
      }
    }
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
    else if (mode=='singeli'? c=='#' : c=='/' && n=='/') {
      res[i] = comC;
      while(str[i] && str[i]!='\n') i++;
    }
    else if (dig.includes(c) || c=='.'&&dig.includes(n)) {
      res[i] = digC;
           if (mode=='singeli' && dig.includes(str[i])) while('_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(str[i])) i++;
      else if (str[i]=='0' && str[i+1]=='x') { i+= 2; while('0123456789abcdefABCDEF'.includes(str[i])) i++; }
      else if (str[i]=='0' && str[i+1]=='b') { i+= 2; while(str[i]=='0'||str[i]=='1') i++; }
      else while(dig.includes(str[i]) || str[i]=='e' || str[i]=='E' || str[i]=='.') i++;
      if (mode!='JS') while('fFlLdDuU'.includes(str[i])) i++;
      continue;
    }
    else if (nam.includes(c) || c=='@') {
      let si = i; i++;
      while(nam.includes(str[i]) || dig.includes(str[i])) i++;
      if (keyw.includes(str.substring(si, i))) res[si] = keyC;
      else if (mode=='singeli' && ["void", "u1", "u8", "u16", "u32", "u64", "i8", "i16", "i32", "i64", "f32", "f64"].includes(str.substring(si,i))) res[si] = clsC;
      else {
        res[si] = mode=='singeli'&&c=='@'? keyC : str[si].toUpperCase()==str[si]? clsC : namC;
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
  genc.innerHTML = colorCode(str, parseC(str, mode), 'C');
}
langs.cpp = () => langs.C('C++');
langs.JS = () => langs.C('JS');
langs.Java = () => langs.C('Java');
langs.singeli = () => langs.C('singeli');

htmlgen.C       = (str, ...lang) => colorCode(str, parseC(str, lang     ), 'C');
htmlgen.cpp     = (str         ) => colorCode(str, parseC(str, 'C++'    ), 'C');
htmlgen.JS      = (str         ) => colorCode(str, parseC(str, 'JS'     ), 'C');
htmlgen.Java    = (str         ) => colorCode(str, parseC(str, 'Java'   ), 'C');
htmlgen.singeli = (str         ) => colorCode(str, parseC(str, 'singeli'), 'C');
