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

        E(`${sid}_NET_IN`).innerText=strbps(net.delta.in);
        E(`${sid}_NET_OUT`).innerText=strbps(net.delta.out);
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
},1000);
