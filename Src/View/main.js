const { ipcRenderer } = require('electron');
const _ = require('lodash');
function TestPath(str) {
  const input = _.replace(str, `\\\\`, '\\');
  const reg = /^[a-z]:(\\[^\\\/:*?"<>|]+)*\\?$/gi;
  return reg.test(input);
}

const vm = new Vue({
  el: '#app',
  data: {
    test: 'success',
    sourcePath: '',
    targetPath: '',
    type: 1,
    mark: 'Fourier'
  },
  methods: {
    minimize: function(event) {
      ipcRenderer.send('minimizeWindow');
    },
    close: function(event) {
      ipcRenderer.send('closeWindow');
    },
    selectFile: function() {
      const path = ipcRenderer.sendSync('openSelectFolderDialog');
      this.sourcePath = path[0];
    },
    openPath: function() {
      const path = ipcRenderer.sendSync('openSelectFolderDialog');
      this.targetPath = path[0];
    },
    start: function() {
      if (!TestPath(this.sourcePath)) {
        ipcRenderer.send('errorDialog', '1');
        return;
      }

      if (this.type === 1) {
        if (!TestPath(this.targetPath)) {
          ipcRenderer.send('errorDialog', '2');
          return;
        }
      }
      const arg = { type: this.type, source: this.sourcePath, target: this.targetPath, text: this.mark };
      ipcRenderer.send('startWatermark', arg);
    }
  }
});

const btn1 = document.querySelector('#openSource');
btn1.onmousemove = function(e) {
  var x = e.pageX - btn1.offsetLeft;
  var y = e.pageY - btn1.offsetTop;
  btn1.style.setProperty('--x', x + 'px');
  btn1.style.setProperty('--y', y + 'px');
};
const btn2 = document.querySelector('#openTarget');
btn2.onmousemove = function(e) {
  var x = e.pageX - btn2.offsetLeft;
  var y = e.pageY - btn2.offsetTop;
  btn2.style.setProperty('--x', x + 'px');
  btn2.style.setProperty('--y', y + 'px');
};
const btn3 = document.querySelector('#start');
btn3.onmousemove = function(e) {
  var x = e.pageX - btn3.offsetLeft;
  var y = e.pageY - btn3.offsetTop;
  btn3.style.setProperty('--x', x + 'px');
  btn3.style.setProperty('--y', y + 'px');
};
$(".pay_list_c1").on("click",function(){
  $(this).addClass("on").siblings().removeClass("on");
})
