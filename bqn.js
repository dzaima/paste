function parseBQN(str) {
  str = str;
  const regC = '0';
  const fnsC = '1'; let   fns = "!+-×÷⋆*√⌊⌈∧∨¬|=≠≤<>≥≡≢⊣⊢⥊∾≍⋈↑↓↕⌽⍉/⍋⍒⊏⊑⊐⊒∊⍷⊔«»⍎⍕";
  const mopC = '2'; let   mop = "`˜˘¨⁼⌜´˝˙";
  const dopC = '3'; const dop = "∘⊸⟜○⌾⎉⚇⍟⊘◶⎊";
  const namC = '4'; const nam = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_";
  const digC = '5'; const dig = "0123456789π∞"; const digS = dig+"¯."; const digM = "eEiI";
  const arrC = '6'; const arr = "·⍬‿⦃⦄⟨⟩@";
  const dfnC = '7'; const dfn = [..."𝕨𝕩𝔽𝔾𝕎𝕏𝕗𝕘𝕣ℝ𝕤𝕊{}:"]; // double-strucks are 2-byters
  const strC = '8'; // '' ""
  const dmdC = 'D'; const dmd = "←↩,⋄→⇐";
  const comC = 'C'; // #
  if (!window.BQNStyle) {
    const s = document.createElement("style");
    s.id = "BQNStyle";
    s.innerText=`
      body.dt .B${regC} { color: #D2D2D2; }  body.lt .B${regC} { color: #000000; }
      body.dt .B${namC} { color: #D2D2D2; }  body.lt .B${namC} { color: #000000; }
      body.dt .B${comC} { color: #898989; }  body.lt .B${comC} { color: #6A737D; }
      body.dt .B${digC} { color: #ff6E6E; }  body.lt .B${digC} { color: #005CC5; }
      body.dt .B${arrC} { color: #DD99FF; }  body.lt .B${arrC} { color: #005CC5; }
      body.dt .B${dmdC} { color: #FFFF00; }  body.lt .B${dmdC} { color: #0000FF; }
      body.dt .B${strC} { color: #6A9FFB; }  body.lt .B${strC} { color: #032F62; }
      body.dt .B${fnsC} { color: #57d657; }  body.lt .B${fnsC} { color: #D73A49; }
      body.dt .B${mopC} { color: #EB60DB; }  body.lt .B${mopC} { color: #ED5F00; }
      body.dt .B${dopC} { color: #FFDD66; }  body.lt .B${dopC} { color: #C82C00; }
      body.dt .B${dfnC} { color: #AA77BB; }  body.lt .B${dfnC} { color: #A906D4; }
    `;
    document.body.appendChild(s);
  }
  const res = new Array(str.length).fill();
  res[0] = regC;
  for (let i = 0; i < str.length; ) {
    const p = str[i-1]||'\0';
    const c = str[i  ];
    const n = str[i+1]||'\0';
    
    if (digS.includes(c)) {
      res[i] = digC; i++;
      while(dig.includes(str[i]) || str[i]=='.' || digM.includes(str[i])&&digS.includes(str[i+1])) i++;
      continue;
    }
    else if (fns.includes(c)) res[i] = fnsC;
    else if (mop.includes(c)) res[i] = mopC;
    else if (dop.includes(c)) res[i] = dopC;
    else if (dfn.includes(c)) res[i] = dfnC;
    else if (arr.includes(c)) res[i] = arrC;
    else if (dmd.includes(c)) res[i] = dmdC;
    else if (nam.includes(c) || c=='•') {
      let fst = i;
      if (str[i] == '•') i++;
      let cs = str[i];
      while(nam.includes(str[i]) || dig.includes(str[i])) i++;
      let ce = str[i-1];
      res[fst] = cs=='_'? (ce=='_'? dopC : mopC) : (cs>='A'&&cs<='Z'?fnsC : namC);
      continue;
    }
    else if (c=="'" || c=='"') {
      res[i] = strC; i++;
      let q = c;
      while(str[i] && str[i]!=q && str[i]!='\n') i++;
    }
    else if (c=='#') {
      res[i] = comC;
      while(str[i] && str[i]!='\n') i++;
    }
    else if (!' \n\t'.includes(c)) res[i] = regC;
    i++;
  }
  return res;
}
langs.BQN = () => {
  let str = [...main.value]; // damn UTF16
  genc.innerHTML = colorCode(str, parseBQN(str), 'B');
}

htmlgen.BQN = (str, ...lang) => colorCode(str=[...str], parseBQN(str, lang), 'B');