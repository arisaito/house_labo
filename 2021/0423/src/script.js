const initWave3 = () => {
  const wave3 = document.getElementsByClassName("wave03")[0];
  const wave3ChileArray = wave3.childNodes;
  console.log(wave3ChileArray);
  for(let i = 0; i < wave3ChileArray.length; i ++) {
    let node = wave3ChileArray[i]
    console.log(node)
    wave3ChileArray[i].setAttribute("scrolldelay", 200);
  }
}

window.onload = () => {
  initWave3()
}