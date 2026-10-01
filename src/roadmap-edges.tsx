import { BaseEdge, type EdgeProps } from '@xyflow/react';
import { topics, clusters, type Topic, type TopicCluster } from './topics';

const coreTopics = topics.filter(topic => topic.core);
// One dotted branch per cluster keeps the canvas readable. Individual topic
// prerequisites remain in each drawer.
export const learningConnections: {source:Topic;target:Topic|TopicCluster;branch:boolean}[] = [
 ...coreTopics.slice(1).map((target,index)=>({source:coreTopics[index],target,branch:false})),
 ...clusters.map(target=>({source:topics.find(t=>t.id===target.hub)!,target,branch:true})),
];
export function connectionHandles(source:Topic,target:Topic|TopicCluster,branch:boolean){
 if(!branch)return {sourceHandle:'bottom',targetHandle:'top'};
 return {sourceHandle:target.x<source.x?'left':'right',targetHandle:'branch'};
}

type Point = [number, number];
function roundedPath(points: Point[], radius = 8) {
  let path = `M ${points[0].join(' ')}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [a, b, c] = [points[i - 1], points[i], points[i + 1]];
    const before = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const after = Math.hypot(c[0] - b[0], c[1] - b[1]);
    if (!before || !after) continue;
    const r = Math.min(radius, before / 2, after / 2);
    const entry = b.map((v, axis) => v + (a[axis] - v) * r / before);
    const exit = b.map((v, axis) => v + (c[axis] - v) * r / after);
    path += ` L ${entry.join(' ')} Q ${b.join(' ')} ${exit.join(' ')}`;
  }
  return `${path} L ${points.at(-1)!.join(' ')}`;
}

export function RoadmapEdge({ id, data, sourceX, sourceY, targetX, targetY, style }: EdgeProps) {
  let points: Point[];
  if (!data?.branch) {
    // Core concepts share the same centerline. Section headings occupy the
    // left side of each territory, leaving the spine uninterrupted.
    points = [[sourceX, sourceY], [targetX, targetY]];
  } else {
    // Each branch turns in its own clear gutter between the spine and leaf.
    const gutterX = (sourceX + targetX) / 2;
    points = [[sourceX, sourceY], [gutterX, sourceY], [gutterX, targetY], [targetX, targetY]];
  }
  return <BaseEdge id={id} path={roundedPath(points)} style={style} interactionWidth={12} />;
}

export const edgeTypes = { roadmap: RoadmapEdge };
