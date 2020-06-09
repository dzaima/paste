function parseBQN(str) {
  str = str;
  const regC = '0';
  const fnsC = '1'; let   fns = "+-×÷⋆√⌊⌈∧∨¬|=≠≤<>≥≡≢⊣⊢⥊∾≍↑↓↕⌽⍉/⍋⍒⊏⊑⊐⊒∊⍷⊔";
  const mopC = '2'; let   mop = "˜˘¨⌜⁼´`";
  const dopC = '3'; const dop = "∘⊸⟜○⌾⎉⚇⍟";
  const namC = '4'; const nam = "•ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_"; // ∆⍙
  const digC = '5'; const dig = "0123456789π∞"; const digS = dig+"¯."; const digM = "eEiI";
  const arrC = '6'; const arr = "⍬‿⦃⦄⟨⟩";
  const dfnC = '7'; const dfn = [..."𝕨𝕩𝔽𝔾𝕎𝕏𝕗𝕘∇{}:"]; // double-strucks are 2-byters
  const strC = '8'; // '' ""
  const dmdC = 'D'; const dmd = "←↩,⋄→";
  const comC = 'C'; // ⍝
  if (!window.APLStyle) {
    const s = document.createElement("style");
    s.id = "APLStyle";
    s.innerText=`
      body.dt .A${regC} { color: #D2D2D2; }  body.lt .A${regC} { color: #000000; }
      body.dt .A${namC} { color: #D2D2D2; }  body.lt .A${namC} { color: #000000; }
      body.dt .A${comC} { color: #BBBBBB; }  body.lt .A${comC} { color: #6A737D; }
      body.dt .A${digC} { color: #AA88BB; }  body.lt .A${digC} { color: #005CC5; }
      body.dt .A${arrC} { color: #DD99FF; }  body.lt .A${arrC} { color: #005CC5; }
      body.dt .A${dmdC} { color: #FFFF00; }  body.lt .A${dmdC} { color: #0000FF; }
      body.dt .A${strC} { color: #DDAAEE; }  body.lt .A${strC} { color: #032F62; }
      body.dt .A${fnsC} { color: #00FF00; }  body.lt .A${fnsC} { color: #D73A49; }
      body.dt .A${mopC} { color: #FF9955; }  body.lt .A${mopC} { color: #ED5F00; }
      body.dt .A${dopC} { color: #FFDD66; }  body.lt .A${dopC} { color: #C82C00; }
      body.dt .A${dfnC} { color: #AA77BB; }  body.lt .A${dfnC} { color: #A906D4; }
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
    else if (nam.includes(c)) {
      res[i] = namC;
      while(nam.includes(str[i]) || dig.includes(str[i])) i++;
      continue;
    }
    else if (c=="'" || c=='"') {
      res[i] = strC; i++;
      let q = c;
      while(str[i] && str[i]!=q && str[i]!='\n') i++;
    }
    else if (c=='⍝') {
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
  colorCode(str, parseBQN(str), 'A');
}