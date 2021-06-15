async function login(){
    startloading();
    var res=await postjson("/login",{
        password: md5(V('password')),
    });
    endloading();
    if(res.status)redirect('/');
    else notice(res.data);
}
E('login').onclick=login;
document.onkeyup=function(e){
    var event=e||window.event;
    var key=event.which||event.keyCode||event.charCode;
    if(key == 13)login();
};