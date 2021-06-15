const ssh=require("../../ssh");
function initServer(server){
    var sh=
`neko-status -v`
    ssh.Exec(server.data.ssh,sh);
}