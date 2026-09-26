import{evaluateWatchdog}from'./watchdog';
const idle=evaluateWatchdog({workRemains:true,humanGate:false,dependencyWait:false,activeJob:false});if(idle.state!=='IDLE_UNEXPECTED'||!idle.recover)throw new Error('unexpected idle must trigger recovery');
const stalled=evaluateWatchdog({workRemains:true,humanGate:false,dependencyWait:false,activeJob:true,lastActivityAt:0,now:600001,stallAfterMs:600000});if(stalled.state!=='STALLED'||!stalled.recover)throw new Error('stalled job must trigger recovery');
const human=evaluateWatchdog({workRemains:true,humanGate:true,dependencyWait:false,activeJob:false});if(human.state!=='WAITING_HUMAN'||human.recover)throw new Error('human gate must be a legitimate wait');
console.log('watchdog checks passed');
