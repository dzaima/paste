function genMixed(str) {
  let val = str;
  let res = "";
  let [start, ...lns0] = str.split('\n');
  return ("\n"+lns0.join('\n')).split('\n'+start).slice(1).map(c => {
    let [argStr, ...lns1] = c.split('\n');
    let [lang, ...args] = eval(argStr);
    return htmlgen[lang](lns1.join('\n'), args);
  }).join("<br>")
}

langs.mixed = () => genc.innerHTML = genMixed(main.value);
htmlgen.mixed = (str) => genMixed(str);