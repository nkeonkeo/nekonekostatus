var KB=1024,MB=KB*1024,GB=MB*1024,TB=GB*1024;
function strB(b){
    if(b<KB)return b.toFixed(2)+'B';
    if(b<MB)return (b/KB).toFixed(2)+'KB';
    if(b<GB)return (b/MB).toFixed(2)+'MB';
    if(b<TB)return (b/GB).toFixed(2)+'GB';
    else return (b/TB).toFixed(2)+'TB';
}
var Kbps=128,Mbps=Kbps*1000,Gbps=Mbps*1000,Tbps=Gbps*1000;
function strbps(b){
    if(b<Kbps)return b.toFixed(2)+'bps';
    if(b<Mbps)return (b/Kbps).toFixed(2)+'Kbps';
    if(b<Gbps)return (b/Mbps).toFixed(2)+'Mbps';
    if(b<Tbps)return (b/Gbps).toFixed(2)+'Gbps';
    else return (b/Tbps).toFixed(2)+'Tbps';
}
var mem_tooltip=new mdui.Tooltip(`#MEM_item`,{}),
    host_tooltip=new mdui.Tooltip(`#host`,{});
async function get(){
    var node=await fetch("./data").then(res=>res.json());
    if(!node||node.stat==-1)return;
    var {cpu,mem,net,host}=node.stat;
    E(`CPU`).innerText=(cpu.multi*100).toFixed(2)+'%';
    // E(`CPU_progress`).style.width=`${cpu.multi*100}%`;
    var i=0;
    for(var usage of cpu.single){
        E(`CPU${++i}_progress`).style.width=`${usage*100}%`;
    }
    
    var {used,total}=mem.virtual,usage=used/total,content;
    E(`MEM`).innerText=(usage*100).toFixed(2)+'%';
    E(`MEM_progress`).style.width=`${usage*100}%`;
    content=`virtual: ${strB(used)}/${strB(total)}`;
    var {used,total}=mem.swap,usage=used/total;
    E(`SWAP_progress`).style.width=`${usage*100}%`;
    content+=`\nswap: ${strB(used)}/${strB(total)}`;
    mem_tooltip.$element[0].innerText=content;
    E(`NET_IN`).innerText=strbps(net.delta.in);
    E(`NET_OUT`).innerText=strbps(net.delta.out);
    E(`NET_IN_TOTAL`).innerText=strB(net.total.in);
    E(`NET_OUT_TOTAL`).innerText=strB(net.total.out);

    for(var [device,Net] of Object.entries(net.devices)){
        E(`net_${device}_delta_in`).innerText=strbps(Net.delta.in);
        E(`net_${device}_delta_out`).innerText=strbps(Net.delta.out);
        E(`net_${device}_total_in`).innerText=strB(Net.total.in);
        E(`net_${device}_total_out`).innerText=strB(Net.total.out);
    }

    var content=
`系统: ${host.os}
平台: ${host.platform}
内核版本: ${host.kernelVersion}
内核架构: ${host.kernelArch}
启动: ${new Date(host.bootTime*1000).toLocaleString()}
在线: ${(host.uptime/86400).toFixed(2)}天`;
    host_tooltip.$element[0].innerText=content;
}
get()
setInterval(get,1000);
