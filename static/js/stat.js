function strB(b){
    if(b<1000)return b.toString()+'B';
    if(b<1000000)return (b/1000).toFixed(2)+'KB';
    if(b<1000000000)return (b/1000000).toFixed(2)+'MB';
    if(b<1000000000000)return (b/1000000000).toFixed(2)+'GB';
    else return (b/1000000000000).toFixed(2)+'TB';
}
var mem_tooltip=new mdui.Tooltip(`#MEM_item`,{}),
    host_tooltip=new mdui.Tooltip(`#host`,{});
setInterval(async()=>{
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
    E(`NET_IN`).innerText=strB(net.delta.in);
    E(`NET_OUT`).innerText=strB(net.delta.out);
    E(`NET_IN_TOTAL`).innerText=strB(net.total.in);
    E(`NET_OUT_TOTAL`).innerText=strB(net.total.out);

    for(var [device,Net] of Object.entries(net.devices)){
        E(`net_${device}_delta_in`).innerText=strB(Net.delta.in)+'/s';
        E(`net_${device}_delta_out`).innerText=strB(Net.delta.out)+'/s';
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
},1000);
