// ports
import nmap from 'node-nmap'

import { Future } from 'fluture'
import siteMap from 'sitemap-crawler';

export const checknmap = path =>  Future((rej, res) => {
    nmap.nmapLocation = "nmap"; //default
    const quickscan = new nmap.OsAndPortScan(path, '-sV', '-sn', '-p');
    quickscan.on('complete', function(data){
        res(data);
      });
       
      quickscan.on('error', function(error){
        rej(error);
      });
       
      quickscan.startScan();
    return ()=> { console.log('STOP') }
})


export const getsitemap = origin => Future((rej, res)=> {
    siteMap(origin, {isProgress : false, isLog : false}, (err, data) => err ? rej(console.err) : res(data));
    return ()=> { console.log('STOP') }
});

