import './css/editor.css';
import './css/master-content.css';
import './css/animate.css';
import './css/style.css';

let styleMsg = [0, 1, 2].map(function(i) {
  return require('raw-loader!./src/txt/style' + i + '.txt');
});
import mastercontent from 'raw-loader!./src/txt/master-content.txt';
import styleeditor from 'raw-loader!./src/txt/styleEditor.txt';
import mastereditor from 'raw-loader!./src/txt/masterEditor.txt';
import trickeditor from 'raw-loader!./src/txt/trickEditor.txt';
import itemMsg from 'raw-loader!./src/txt/item.txt';

import { sleep } from './lib/sleep';
import {
  default as writeChar,
  writeSimpleChar,
  handleChar,
} from './lib/writeChar';
import { addClickListener, changeEditor } from './lib/click';
import { createItem, addSVGmousemoveListener } from './lib/item';

import 'jquery';
import 'jquery-ui-bundle';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { itemsmsg } from './src/item.json';
const style = document.createElement('style');
let interval = 16;
document.head.appendChild(style);

let animationSkipped = false;

let skipButton = document.querySelector('#skipButton');
skipButton.addEventListener('click', e => {
  e.preventDefault();
  animationSkipped = true;
  document
    .querySelector('body')
    .removeChild(document.getElementById('skipButton'));
});

async function start() {
  try {
    await createEditor('desktop', styleeditor);
    createEditor('desktop', mastereditor);
    createEditor('desktop', trickeditor);
    let styleText = document.getElementById('style-text');
    await writeTo(
      styleText,
      styleMsg[0].replace(/[\n]/gi, ''),
      true,
      interval,
      0,
      1,
    );
    let styleBox = document.getElementById('style-box'),
      masterBox = document.getElementById('master-box'),
      gameBox = document.getElementById('game-box'),
      trickBox = document.getElementById('trick-box');
    let Boxs = [masterBox, styleBox, gameBox, trickBox];
    changeEditor(masterBox, styleBox);
    addmasterContent();
    await changeEditor(styleBox, masterBox);
    await writeTo(
      styleText,
      styleMsg[1].replace(/[\n]/gi, ''),
      true,
      interval,
      0,
      1,
    );
    await await createItem(itemsmsg, itemMsg);
    await sleep(1000);
    showGameAndTrick();
    await writeTo(
      styleText,
      styleMsg[2].replace(/[\n]/gi, ''),
      true,
      interval,
      0,
      1,
    );
    await clearTransition();
    addDraggable(Boxs);
    addSVGmousemoveListener();
    addClickListener(Boxs);
    styleText.addEventListener('input', function() {
      style.textContent = styleText.textContent;
    });
    document.querySelector('.inner-container').style.display = 'block';
    await document
      .getElementById('skipButton')
      .classList.add('animated', 'slideOutLeft');
    document
      .querySelector('body')
      .removeChild(document.getElementById('skipButton'));
    console.log('实时Coding参考了http://strml.net/的源代码');
    console.log('谢谢浏览！！');
  } catch (err) {
    if (err.message === 'SKIP IT') {
      skipAnimation();
    } else {
      console.log(err);
      throw err;
    }
  }
}
start();

async function skipAnimation() {
  let styleText = document.getElementById('style-text');
  style.textContent = styleMsg[0].replace(/[\n]/gi, '');
  let styleBox = document.getElementById('style-box'),
    masterBox = document.getElementById('master-box'),
    gameBox = document.getElementById('game-box'),
    trickBox = document.getElementById('trick-box');
  let styleHtml = '';
  for (let i = 0; i < styleMsg.length; i++) {
    styleMsg[i] = styleMsg[i].replace(/[\n]/gi, '');
  }
  let stylemsgAll = styleMsg.join('\n');
  for (let i = 0; i < stylemsgAll.length; i++) {
    styleHtml = handleChar(styleHtml, stylemsgAll[i]);
  }
  styleText.innerHTML = styleHtml;
  let Boxs = [masterBox, styleBox, gameBox, trickBox];
  changeEditor(masterBox, styleBox);
  addmasterContent();
  await changeEditor(styleBox, masterBox);
  style.textContent += styleMsg[1].replace(/[\n]/gi, '');
  await await createItem(itemsmsg, itemMsg);
  await sleep(1000);
  showGameAndTrick();
  style.textContent += styleMsg[2].replace(/[\n]/gi, '');
  await clearTransition();
  addDraggable(Boxs);
  addSVGmousemoveListener();
  addClickListener(Boxs);
  styleText.addEventListener('input', function() {
    style.textContent = styleText.textContent;
  });
  document.querySelector('.inner-container').style.display = 'block';
  styleText.scrollTop = styleText.scrollHeight;
  console.log('实时Coding参考了http://strml.net/的源代码');
  console.log('谢谢浏览！！');
}

NProgress.configure({
  minimum: 0.2,
});
(function() {
  document.onreadystatechange = function() {
    NProgress.start();
    if (document.readyState == 'Uninitialized') {
      NProgress.set(1);
    }
    if (document.readyState == 'Interactive') {
      NProgress.set(0.6);
    }
    if (document.readyState == 'complete') {
      (async function() {
        await sleep(700);
        NProgress.done();
      })();
    }
  };
})();

const endOfSentence = /[\.\?\!]\s$/;
const comma = /\D[\,]\s$/;
const endOfBlock = /[^\/]\n\n$/;

async function writeTo(
  el,
  msg,
  mirrortostyle,
  interval,
  index,
  charsPerInterval,
) {
  if (animationSkipped) {
    throw new Error('SKIP IT');
  }
  let chars = msg.slice(index, index + charsPerInterval);
  index += charsPerInterval;
  el.scrollTop = el.scrollHeight;

  if (mirrortostyle) {
    writeChar(el, chars, style);
  } else {
    writeSimpleChar(el, chars);
  }

  if (index < msg.length) {
    let thisInterval = interval;
    let thisSlice = msg.slice(index - 2, index + 1);
    if (comma.test(thisSlice)) thisInterval = interval * 30;
    if (endOfBlock.test(thisSlice)) thisInterval = interval * 50;
    if (endOfSentence.test(thisSlice)) thisInterval = interval * 70;

    try {
      await sleep(thisInterval);
    } catch (err) {
      console.log(err);
    }
    return writeTo(el, msg, mirrortostyle, interval, index, charsPerInterval);
  }
}

function createEditor(elid, htmlmsg) {
  let el = document.getElementById('desktop');
  el.innerHTML += htmlmsg;
}

function clearTransition() {
  $('*').css('transition', 'all 0s');
}

function showGameAndTrick() {
  document.getElementById('sprite').src = './src/image/resource.png';
  document.getElementById('catgif').src = './src/image/cat.gif';
  document.getElementById('game-title').innerHTML =
    'Run as far as you can by using ↑ & ↓';
  document.getElementById('trick-title').innerHTML = 'Thanks!';
  document.getElementById('game-box').style.display = 'block';
  document.getElementById('trick-box').style.display = 'block';
}

function addDraggable(els) {
  let length = els.length;
  for (let i = 0; i < length; i++) {
    $(els[i]).draggable({
      handle: $(els[i])
        .children('.header')
        .first(),
    });
  }
}

function addmasterContent() {
  let masterText = document.getElementById('master-text');
  masterText.innerHTML = mastercontent;
}
