function copy(text){
    var x=document.createElement("textarea");
    x.textContent=text;document.body.appendChild(x);
    x.select();document.execCommand('copy');
    x.remove();
    mdui.snackbar({message: "复制成功",position: "top"});
}
function notmail(email){return !/^\S+@\S+\.\S{2,}$/.test(email);}
function hascn(str){return /.*[\u4e00-\u9fa5]+.*$/.test(str);}

function E(id){return document.getElementById(id);}
function V(id){return E(id).value;}

var Loading=E("loading");
function startloading(){Loading.hidden=0;}
function endloading(){Loading.hidden=1;}
async function postjson(url,data){
    var res=await fetch(url,{
        method: "POST",
        body:JSON.stringify(data),
        headers: {'content-type': 'application/json'},
    }).then(res=>res.json());
    return res;
}
function notice(message,timeout=2000,position="top"){
    mdui.snackbar({message,timeout,position});
}
function open(url){
    var x=document.createElement('a');
    x.href=url;
    x.click();x.remove();
}
function sleep(ti){return new Promise((resolve)=>setTimeout(resolve,ti));}
function refreshPage(ti=600){sleep(ti).then(()=>{window.location.reload()});}
function redirect(url,ti=600){sleep(ti).then(()=>{window.location=url});}

function setQuery(key,val){
    var x=new URLSearchParams(window.location.search);
    x.set(key,val);
    window.location.search=x.toString();
}
function delQuery(key){
    var x=new URLSearchParams(window.location.search);
    x.delete(key);
    window.location.search=x.toString();
}
window.onload=()=>{
    document.querySelectorAll("[href]").forEach(x=>{
        if(x.tagName!='A'&&x.tagName!='LINK')
            x.onclick=()=>{open(x.getAttribute("href"));};
    });
    document.querySelectorAll(".ccp").forEach(x=>{
        x.onclick=(x)=>{copy(x.target.innerText);};
        x.setAttribute("mdui-tooltip","{content:'点击复制'}");
    });
};