Date.prototype.Format=function(fmt){var o={'M+':this.getMonth()+1,'d+':this.getDate(),'H+':this.getHours(),'m+':this.getMinutes(),'s+':this.getSeconds(),'S+':this.getMilliseconds()};if(/(y+)/.test(fmt))fmt=fmt.replace(RegExp.$1,(this.getFullYear()+'').substr(4-RegExp.$1.length));for(var k in o)if(new RegExp('('+k+')').test(fmt))fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(('00'+o[k]).substr(String(o[k]).length)));return fmt;};
var load_m=JSON.parse(document.getElementById('load_m_data').value);
var cpus=[],mems=[],swaps=[],ibws=[],obws=[];
for(var {cpu,mem,swap,ibw,obw} of load_m){
    cpus.push(cpu);
    mems.push(mem);
    swaps.push(swap);
    ibws.push(ibw/128/1024);
    obws.push(obw/128/1024);
}
var labels=[];
for(var i=0,time=new Date();i<60;time.setMinutes(time.getMinutes()-1),++i)
    labels.push(time.Format('HH:mm'));
new Chart(document.getElementById('load-m').getContext('2d'),{
    type: 'line',
    data: {
        labels: labels.reverse(),
        datasets: [{
            label: 'CPU (%)',
            backgroundColor: '#66ccff4d',
            borderColor: '#0099ffbf',
            data: cpus
        },{
            label: 'Memory (%)',
            backgroundColor: '#f7a4b94d',
            borderColor: '#ff789abf',
            data: mems
        },
        {
            label: 'Swap (%)',
            backgroundColor: '#767ffd4d',
            borderColor: '#6670ffbf',
            data: swaps
        }]
    },
    options: {
        scales:{
            y:{min:0,max:100}
        }
    }
});
new Chart(document.getElementById('load-m-bw').getContext('2d'),{
    type: 'line',
    data: {
        labels: labels.reverse(),
        datasets: [{
            label: 'in (Mbps)',
            backgroundColor: '#f7a4b94d',
            borderColor: '#ff789abf',
            data: ibws
        },{
            label: 'ou (Mbps)',
            backgroundColor: '#66ccff4d',
            borderColor: '#0099ffbf',
            data: obws
        },]
    },
    options: {
        scales:{
            y:{min:0}
        }
    }
});

var load_h=JSON.parse(document.getElementById('load_h_data').value);
cpus=[],mems=[],swaps=[],ibws=[],obws=[];
for(var {cpu,mem,swap,ibw,obw} of load_h){
    cpus.push(cpu);
    mems.push(mem);
    swaps.push(swap);
    ibws.push(ibw/128/1024);
    obws.push(obw/128/1024);
}
labels=[];
for(var i=0,time=new Date();i<24;time.setHours(time.getHours()-1),++i)
    labels.push(time.Format('HH:00'));
new Chart(document.getElementById('load-h').getContext('2d'),{
    type: 'line',
    data: {
        labels: labels.reverse(),
        datasets: [{
            label: 'CPU (%)',
            backgroundColor: '#66ccff4d',
            borderColor: '#0099ffbf',
            data: cpus
        },{
            label: 'Memory (%)',
            backgroundColor: '#f7a4b94d',
            borderColor: '#ff789abf',
            data: mems
        },
        {
            label: 'Swap (%)',
            backgroundColor: '#767ffd4d',
            borderColor: '#6670ffbf',
            data: swaps
        }]
    },
    options: {
        scales:{
            y:{min:0,max:100}
        }
    }
});
new Chart(document.getElementById('load-h-bw').getContext('2d'),{
    type: 'line',
    data: {
        labels: labels.reverse(),
        datasets: [{
            label: 'in (Mbps)',
            backgroundColor: '#f7a4b94d',
            borderColor: '#ff789abf',
            data: ibws
        },{
            label: 'ou (Mbps)',
            backgroundColor: '#66ccff4d',
            borderColor: '#0099ffbf',
            data: obws
        },]
    },
    options: {
        scales:{
            y:{min:0}
        }
    }
});