import Caver from "caver-js";
import {Spinner} from "spin.js";

const config={
  rpcURL: 'https://api.baobab.klaytn.net:8651'
}
const cav = new Caver(config.rpcURL);
const mdContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const App = {
  start: async function () {
    const walletFromSession = sessionStorage.getItem('walletInstance');
    if(walletFromSession){
      try{
        cav.klay.accounts.wallet.add(JSON.parse(walletFromSession));
        this.changeUI(JSON.parse(walletFromSession));
      }catch(e){
        sessionStorage.removeItem('walletInstance');
      }
    }
  },

  reading: async function(num){
    var spinner = this.showSpinner();
    mdContract.methods.reading(num).send({
      from: JSON.parse(sessionStorage.getItem('walletInstance')).address ,
      gas: '250000'
    }).then(function(receipt){
      if(receipt.status){
        spinner.stop();
        alert(JSON.parse(sessionStorage.getItem('walletInstance')).address + "계정 "+num+"개 열람");
        location.reload();
      }
    })
  },

  callOwner: async function () {
    return await mdContract.methods.owner().call();
  },

  callContractBalance: async function () {
    return await mdContract.methods.getBalance().call();
  },

  callUserCount: async function(){
    return await mdContract.methods.getCount(this.getWallet().address).call();
  },

  callLoginCount: async function(){
    return await mdContract.methods.getLoginCount(this.getWallet().address).call();
  },

  callCompnayName: async function(){
    return await mdContract.methods.getCompany(this.getWallet().address).call();
  },
  
  getWallet: function () {
    return JSON.parse(sessionStorage.getItem('walletInstance'));
  },

  TestLogin: async function (id,privateKey) {
    var spinner = this.showSpinner();
    try{
      this.integrateWallet(id,privateKey);
      document.getElementById("company").textContent=await this.callCompnayName();
      document.getElementById("look_cnt").textContent= "내 열람 횟수: " + await this.callUserCount()+"회";
      document.getElementById("login_cnt").textContent="내 접속 횟수: " + await this.callLoginCount()+"회";
    }catch(e){
      document.getElementById("look_cnt").textContent= "";
      document.getElementById("login_cnt").textContent="";
     }
      mdContract.methods.login(id).send({
        from: JSON.parse(sessionStorage.getItem('walletInstance')).address ,
        gas: '250000'
      }).then(function(receipt){
        if(receipt.status){
          spinner.stop();
          location.reload();
          alert(JSON.parse(sessionStorage.getItem('walletInstance')).address + "로그인 성공");
        }
      })
  },

  integrateWallet: function (id,privateKey) {
    console.log('로그인 오류');    
    const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
    cav.klay.accounts.wallet.add(walletInstance);
    sessionStorage.setItem('walletInstance',JSON.stringify(walletInstance));
    document.getElementById("myAddress").textContent="내 주소: "+walletInstance.address;
    this.changeUI(walletInstance);
  },

  findUsers: async function(add){
    var a = await mdContract.methods.findUsers(add).call({from: this.getWallet().address});
    a=JSON.stringify(a);
    document.getElementById("finduser").textContent= "회사명: "+JSON.parse(a).company +"  열람횟수: "+JSON.parse(a).look +"  접속횟수: "+JSON.parse(a).connect;
  },

  changeUI: async function (walletInstance) {
    document.getElementById("myAddress").textContent="내 주소: "+walletInstance.address;
    document.getElementById("look_cnt").textContent= "내 열람 횟수: " +await this.callUserCount()+"회";
    document.getElementById("login_cnt").textContent= "내 접속 횟수: " +await this.callLoginCount()+"회";
    document.getElementById("company").textContent=await this.callCompnayName();

    if(await this.callOwner() === walletInstance.address){
      document.getElementById("test1").style.visibility='visible';
      document.getElementById("test2").style.visibility='visible';
      document.getElementById("mode").textContent="관리자 모드";
    }
    else{
      document.getElementById("test1").style.visibility='hidden';
      document.getElementById("test2").style.visibility='hidden';
      document.getElementById("mode").textContent="유저 모드";
    }
  },

  showSpinner: function () {
    var target = document.getElementById("spin");
    return new Spinner(opts).spin(target);
  },

};

window.App = App;

window.addEventListener("load", function () {
  App.start();
});

var opts = {
  lines: 10, // The number of lines to draw
  length: 30, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: '#5bc0de', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  position: 'absolute' // Element positioning
};