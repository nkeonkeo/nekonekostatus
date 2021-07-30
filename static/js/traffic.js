var G=1000000000;
var traffic=JSON.parse(document.getElementById('traffic_data').value),hs_tot=0,ds_tot=0,ms_tot=0;
var idata=[],odata=[];
for(var [i,o] of traffic.hs){
    hs_tot+=i+o;
    idata.push((i/G).toFixed(3));
    odata.push((o/G).toFixed(3));
}
Date.prototype.Format=function(fmt){var o={'M+':this.getMonth()+1,'d+':this.getDate(),'H+':this.getHours(),'m+':this.getMinutes(),'s+':this.getSeconds(),'S+':this.getMilliseconds()};if(/(y+)/.test(fmt))fmt=fmt.replace(RegExp.$1,(this.getFullYear()+'').substr(4-RegExp.$1.length));for(var k in o)if(new RegExp('('+k+')').test(fmt))fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(('00'+o[k]).substr(String(o[k]).length)));return fmt;};
var labels=[];
for(var i=0,time=new Date();i<24;time.setHours(time.getHours()-1),time.setMinutes(59),++i)
    labels.push(time.Format('HH:mm'));
var hsChart=new Chart(document.getElementById('hs').getContext('2d'),{
    type: 'line',// The type of chart we want to create
    data: {// The data for our dataset
        // labels: ['23h','22h','21h','20h','19h','18h','17h','16h','15h','14h','13h','12h','11h','10h','9h','8h','7h','6h','5h','4h','3h','2h','1h','现在'],
        labels: labels.reverse(),
        datasets: [{
            label: 'in (GB)',
            backgroundColor: '#f7a4b980',
            borderColor: '#f15079',            
            data:idata
        },{
            label: 'out (GB)',
            backgroundColor: '#66ccff80',
            borderColor: '#0099ff',
            data:odata
        }]
    },
    options: {}// Configuration options go here
});
idata=[],odata=[];
for(var [i,o] of traffic.ds){
    ds_tot+=i+o;
    idata.push((i/G).toFixed(3));
    odata.push((o/G).toFixed(3));
}
labels=[];
for(var i=0,time=new Date();i<31;time.setDate(time.getDate()-1),++i)
    labels.push(time.getDate());
var dsChart=new Chart(document.getElementById('ds').getContext('2d'),{
    type: 'line',// The type of chart we want to create
    data: {// The data for our dataset
        // labels: ['30d','29d','28d','27d','26d','25d','24d','23d','22d','21d','20d','19d','18d','17d','16d','15d','14d','13d','12d','11d','10d','9d','8d','7d','6d','5d','4d','3d','2d','1d','今天'],
        labels:labels.reverse(),
        datasets: [{
            label: 'in (GB)',
            backgroundColor: '#f7a4b980',
            borderColor: '#f15079',            
            data:idata
        },{
            label: 'out (GB)',
            backgroundColor: '#66ccff80',
            borderColor: '#0099ff',
            data:odata
        }]
    },
    options: {}// Configuration options go here
});
idata=[],odata=[];
for(var [i,o] of traffic.ms){
    ms_tot+=i+o;
    idata.push((i/G).toFixed(3));
    odata.push((o/G).toFixed(3));
}
labels=[];
for(var i=0,time=new Date();i<12;time.setMonth(time.getMonth()-1),++i)
    labels.push(time.getUTCMonth()+1);
var msChart=new Chart(document.getElementById('ms').getContext('2d'),{
    type: 'line',// The type of chart we want to create
    data: {// The data for our dataset
        // labels: ['11','10','9','8','7','6','5','4','3','2','1','本月'],
        labels:labels.reverse(),
        datasets: [{
            label: 'in (GB)',
            backgroundColor: '#f7a4b980',
            borderColor: '#f15079',            
            data:idata
        },{
            label: 'out (GB)',
            backgroundColor: '#66ccff80',
            borderColor: '#0099ff',
            data:odata
        }]
    },
    options: {}// Configuration options go here
});
document.getElementById('hs_tot').innerText=`${(hs_tot/G).toFixed(2)}G(24小时)`;
document.getElementById('ds_tot').innerText=`${(ds_tot/G).toFixed(2)}G(31天)`;
document.getElementById('ms_tot').innerText=`${(ms_tot/G).toFixed(2)}G(12个月)`;