export type Domain = 'green' | 'roast' | 'sensory' | 'practice';
export type Topic = { id: string; title: string; domain: Domain; level: 'Foundation' | 'Intermediate'; core: boolean; summary: string; body: string; prerequisites: string[]; x: number; y: number; width: number; height: number; };
export const domains: Record<Domain, {title:string; subtitle:string; code:string}> = {
 green:{title:'Green potential',subtitle:'Know what you’re starting with',code:'G'},
 roast:{title:'Roast transformation',subtitle:'Turn potential into expression',code:'R'},
 sensory:{title:'Sensory expression',subtitle:'Let the cup guide the next roast',code:'S'},
 practice:{title:'Experiment & repeat',subtitle:'Build a process you can trust',code:'E'},
};
// Editorial text comes from content/*.md; this module owns map geometry and routes.
import topicMap from './topic-map.json';
import cardContent from 'virtual:atlas-content';
const rows=topicMap.map(entry=>({...entry,domain:entry.domain as Domain,...cardContent[entry.id]}));
export const originExamples=['ethiopia','kenya','panama','colombia'];
const roastOrder=["roaster","phases","heat-transfer","baseline","cooling"];

export const nestedTopicRows:Record<string,string[][]>={
 origins:[['ethiopia','kenya'],['panama','colombia']],
 maillard:[['browning-chemistry'],['sugar-breakdown'],['chlorogenic-acids'],['organic-acids'],['aroma-formation']],
 endpoint:[['roast-color','weight-loss']],
};

export type TopicCluster = {id:string;title:string;domain:Domain;hub:string;side:'left'|'right';offset:number;rows:string[][];x:number;y:number;width:number;height:number};
const clusterSpecs: Omit<TopicCluster,'x'|'y'|'width'|'height'>[] = [
 {id:'plant-origin',title:'The plant & its place',domain:'green',hub:'seed-to-cup',side:'left',offset:150,rows:[['origins'],['ethiopia','kenya'],['panama','colombia'],['varieties'],['harvest']]},
 {id:'post-harvest',title:'Post-harvest processing',domain:'green',hub:'processing',side:'right',offset:295,rows:[['washed'],['honey'],['natural'],['fermentation'],['drying'],['experimental-processing']]},
 {id:'physical',title:'Read the green',domain:'green',hub:'physical-attributes',side:'left',offset:540,rows:[['moisture'],['water-activity'],['density'],['green-defects']]},
 {id:'buying',title:'From sample to inventory',domain:'green',hub:'green-evaluation',side:'right',offset:850,rows:[['sample-roasting'],['green-storage']]},
 {id:'equipment',title:'Roaster architecture',domain:'roast',hub:'roaster',side:'left',offset:155,rows:[['machines'],['drum','fluid-bed'],['air-roasters','hybrid-roasters']]},
 {id:'phase-overview',title:'What happens during a roast',domain:'roast',hub:'phases',side:'right',offset:420,rows:[['roast-drying'],['maillard'],...nestedTopicRows.maillard,['first-crack'],['development']]},
 {id:'thermal',title:'How heat reaches the bean',domain:'roast',hub:'heat-transfer',side:'right',offset:1090,rows:[['conduction','convection'],['radiation'],['sensors']]},
 {id:'bean-interior',title:'Heat inside the bean',domain:'roast',hub:'heat-transfer',side:'left',offset:1000,rows:[['internal-conduction'],['bean-geometry'],['thermal-properties'],['thermal-time']]},
 {id:'controls',title:'Build a reusable profile',domain:'roast',hub:'baseline',side:'left',offset:1450,rows:[['target'],['batch-mass'],['warm-up'],['profile-template'],['profile-matrix']]},
 {id:'outcomes',title:'Controls & endpoints',domain:'roast',hub:'baseline',side:'right',offset:1450,rows:[['airflow'],['ror'],['endpoint'],...nestedTopicRows.endpoint]},
 {id:'resting',title:'From roast to drinking window',domain:'roast',hub:'cooling',side:'right',offset:1990,rows:[['co2'],['oxidation'],['resting-window']]},
 {id:'mapping',title:'A profile is not a flavor',domain:'sensory',hub:'cupping',side:'right',offset:145,rows:[['mapping-roast'],['mapping-brew'],['mapping-target']]},
 {id:'preparation',title:'A consistent measurement',domain:'sensory',hub:'cupping',side:'left',offset:420,rows:[['water'],['grind','brew-ratio']]},
 {id:'brew-methods',title:'Choose a comparison method',domain:'sensory',hub:'cupping',side:'right',offset:440,rows:[['immersion'],['customer-recipe']]},
 {id:'language',title:'Build your sensory coordinates',domain:'sensory',hub:'sensory-language',side:'left',offset:780,rows:[['sensory-axes'],['relative-coordinates'],['target-region'],['calibration','texture']]},
 {id:'interpretation',title:'Read the whole comparison',domain:'sensory',hub:'blind-tasting',side:'right',offset:1130,rows:[['comparison-matrix'],['temperature-flight'],['attribution']]},
 {id:'validation',title:'Choose, validate & revisit',domain:'sensory',hub:'evaluate',side:'left',offset:1460,rows:[['shortlist'],['blind-validation'],['rest-validation']]},
 {id:'method',title:'Keep the evidence connected',domain:'practice',hub:'experiment',side:'left',offset:145,rows:[['logging'],['one-variable'],['replication','triangle']]},
 {id:'search-strategies',title:'Two ways to find your profile',domain:'practice',hub:'experiment',side:'right',offset:145,rows:[['broad-exploration'],['guided-iteration'],['search-limits']]},
 {id:'production',title:'Make it repeatable at scale',domain:'practice',hub:'qc',side:'right',offset:660,rows:[['scale-up'],['traceability','release']]},
];
const coreOffsets:Record<string,number>={
 'seed-to-cup':240,processing:420,'physical-attributes':650,'green-evaluation':920,
 roaster:230,phases:650,'heat-transfer':1140,baseline:1620,cooling:2080,
 cupping:480,'sensory-language':890,'blind-tasting':1220,evaluate:1580,
 experiment:265,qc:720,
};
export const MAP_WIDTH=1080;
export const regionLayout: Record<Domain, { y: number; height: number; center: number }> = {} as Record<Domain, { y: number; height: number; center: number }>;
let regionY=20;
for(const domain of Object.keys(domains) as Domain[]){
 const coreBottom=Math.max(...rows.filter(r=>r.domain===domain&&r.core).map(r=>coreOffsets[r.id]+80));
 const clusterBottom=Math.max(...clusterSpecs.filter(c=>c.domain===domain).map(c=>c.offset+64+c.rows.length*60));
 const height=Math.max(coreBottom,clusterBottom)+65;
 regionLayout[domain]={y:regionY,height,center:regionY+height/2};regionY+=height+70;
}
export const clusters:TopicCluster[]=clusterSpecs.map(c=>({...c,x:c.side==='left'?35:715,y:regionLayout[c.domain].y+c.offset,width:330,height:64+c.rows.length*60}));
export const topics:Topic[]=rows.map(({id,title,domain,core,summary,body,prerequisites})=>{
 const major=['seed-to-cup','roaster','cupping','experiment'].includes(id);
 let width=major?270:240,height=major?80:66,x=540-width/2,y=regionLayout[domain].y+coreOffsets[id];
 if(!core){const c=clusters.find(c=>c.rows.flat().includes(id))!;const row=c.rows.findIndex(r=>r.includes(id));const cells=c.rows[row];const parent=Object.keys(nestedTopicRows).find(parent=>nestedTopicRows[parent].flat().includes(id));const nested=!!parent;const inset=nested?9:0;width=(306-inset*2-(cells.length-1)*8)/cells.length;height=52;x=c.x+12+inset+cells.indexOf(id)*(width+8);y=nested?c.y+103+(row-1)*60:c.y+52+row*60;}
 return {id,title,domain,core,summary,body,prerequisites,level:core?'Foundation':'Intermediate',x,y,width,height};
});
// Curated essentials follow each central concept before continuing down the spine.
const beginnerBranches:Record<string,string[]>={
 'seed-to-cup':['origins','ethiopia','kenya'],
 processing:['washed','natural','honey'],
 'physical-attributes':['moisture'],
 roaster:['drum','air-roasters'],
 phases:['maillard'],
 'heat-transfer':['conduction','convection','radiation'],
 baseline:['airflow','ror','endpoint','roast-color','weight-loss'],
 cooling:['co2'],
 cupping:['immersion','customer-recipe'],
 'sensory-language':['sensory-axes','relative-coordinates'],
 'blind-tasting':['temperature-flight'],
 evaluate:['blind-validation'],
 experiment:['logging'],
 qc:['scale-up'],
};
export const beginner=topics.filter(t=>t.core).flatMap(t=>[t.id,...(beginnerBranches[t.id]??[])]);

// Green Potential uses route-relative references; stable IDs still back saved progress.
const greenCodes:Record<string,string>={};
const greenCore=topics.filter(t=>t.domain==='green'&&t.core);
for(const [index,topic] of greenCore.entries()){
 const prefix=`G${String(index+1).padStart(2,'0')}`;greenCodes[topic.id]=prefix;
 const cluster=clusters.find(c=>c.hub===topic.id)!;
 const children=cluster.rows.flat().filter(id=>!originExamples.includes(id));
 children.forEach((id,i)=>greenCodes[id]=`${prefix}.${i+1}`);
}
originExamples.forEach((id,i)=>greenCodes[id]=`${greenCodes.origins}.${i+1}`);
export function topicCode(topic:Topic){
 return greenCodes[topic.id]??roastCodes[topic.id]??laterCodes[topic.id]??`${domains[topic.domain].code}.${String(topics.filter(t=>t.domain===topic.domain).findIndex(t=>t.id===topic.id)+1).padStart(2,'0')}`;
}

const roastCodes:Record<string,string>={};
for(const [i,id] of roastOrder.entries()){
 const prefix=`R${String(i+1).padStart(2,'0')}`;roastCodes[id]=prefix;
 const children=clusters.filter(c=>c.hub===id).flatMap(c=>c.rows.flat()).filter(id=>!Object.values(nestedTopicRows).flat(2).includes(id));
 children.forEach((child,j)=>{roastCodes[child]=`${prefix}.${j+1}`;
 nestedTopicRows[child]?.flat().forEach((nested,k)=>roastCodes[nested]=`${roastCodes[child]}.${k+1}`);
 });
}

const laterCodes:Record<string,string>={};
for(const domain of ['sensory','practice'] as Domain[]){
 topics.filter(t=>t.domain===domain&&t.core).forEach((topic,i)=>{
  const prefix=`${domains[domain].code}${String(i+1).padStart(2,'0')}`;laterCodes[topic.id]=prefix;
  clusters.filter(c=>c.hub===topic.id).flatMap(c=>c.rows.flat()).forEach((id,j)=>laterCodes[id]=`${prefix}.${j+1}`);
 });
}
