function strB(b){
    if(b<1000)return b.toString()+'B';
    if(b<1000000)return (b/1000).toFixed(2)+'KB';
    if(b<1000000000)return (b/1000000).toFixed(2)+'MB';
    if(b<1000000000000)return (b/1000000000).toFixed(2)+'GB';
    else return (b/1000000000000).toFixed(2)+'TB';
}
var mem_tooltips={},host_tooltips={};
setInterval(async()=>{
    var stats=await fetch("/stats/data").then(res=>res.json());
    for(var [sid,node] of Object.entries(stats))if(node.stat&&node.stat!=-1){
        var {cpu,mem,net,host}=node.stat;
        E(`${sid}_CPU`).innerText=(cpu.multi*100).toFixed(2)+'%';
        E(`${sid}_CPU_progress`).style.width=`${cpu.multi*100}%`;
        
        var {used,total}=mem.virtual,usage=used/total;
        E(`${sid}_MEM`).innerText=(usage*100).toFixed(2)+'%';
        E(`${sid}_MEM_progress`).style.width=`${usage*100}%`;
	    var content=`${strB(used)}/${strB(total)}`;
        if(mem_tooltips[sid])mem_tooltips[sid].$element[0].innerText=content;
	    else mem_tooltips[sid]=new mdui.Tooltip(`#${sid}_MEM_item`,{content});

        E(`${sid}_NET_IN`).innerText=strB(net.delta.in);
        E(`${sid}_NET_OUT`).innerText=strB(net.delta.out);
        E(`${sid}_NET_IN_TOTAL`).innerText=strB(net.total.in);
        E(`${sid}_NET_OUT_TOTAL`).innerText=strB(net.total.out);

        var content=
`系统: ${host.os}
平台: ${host.platform}
内核版本: ${host.kernelVersion}
内核架构: ${host.kernelArch}
启动: ${new Date(host.bootTime*1000).toLocaleString()}
在线: ${(host.uptime/86400).toFixed(2)}天`;
        if(!host_tooltips[sid])host_tooltips[sid]=new mdui.Tooltip(`#${sid}_host`,{});
        host_tooltips[sid].$element[0].innerText=content;
    }
    mdui.mutation();
},3000);
