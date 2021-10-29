/**
 * This is a minimal example of sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */


import Graph from "graphology";
import { SerializedGraph } from "graphology-types";
import Sigma from "sigma";
import iwanthue from "iwanthue";
import noverlap from "graphology-layout-noverlap";
import { circular } from "graphology-layout";

import forceAtlas2 from "graphology-layout-forceatlas2";

import $ from "jquery";

// const graph = Graph.from(data as unknown as SerializedGraph);

// let websocket = new WebSocket("ws://127.0.0.1:4321");

// websocket.onopen = (_event) => {
//     console.log("ready!");
//     websocket.send("update");
// };

// websocket.onerror = (event) => {
//     console.log("WebSocket error: ", event);
// };

function updateGraph(): void {
    $.get("http://71.207.151.214:4321", (data, status) => {
        console.log("got data! ", data);
        let msg = JSON.parse(data) as SerializedGraph;
        renderGraph(msg);
    });
}

setInterval(() => updateGraph(), 10000);

// websocket.onmessage = (event) => {
//     let msg = JSON.parse(event.data) as SerializedGraph;
//     renderGraph(msg);
// };

// renderGraph(data as unknown as SerializedGraph);
let graph = new Graph();
const container = document.getElementById("sigma-container") as HTMLElement;
const renderer = new Sigma(graph, container);

updateGraph();

function renderGraph(data: SerializedGraph): void {
    graph.clear();
    graph.import(data);
    
    circular.assign(graph);
    
    // initialize clusters from graph data
    // create and assign one color by cluster
    const palette = iwanthue(graph.order, { seed: "eurSISCountryClusters" });
    
    // change node appearance
    graph.forEachNode((node, atts) => {
        // node color depends on the cluster it belongs to
        atts.color = palette.pop();
        // node size depends on its degree
        atts.size = graph.degree(node);
    });
    
    renderer.refresh();

    forceAtlas2.assign(graph, 2000);

    noverlap.assign(graph);
};

// // calculate the cluster's nodes barycenter to use this as cluster label position
// for (const country in countryClusters) {
//     countryClusters[country].x =
//         countryClusters[country].positions.reduce((acc, p) => acc + p.x, 0) / countryClusters[country].positions.length;
//     countryClusters[country].y =
//         countryClusters[country].positions.reduce((acc, p) => acc + p.y, 0) / countryClusters[country].positions.length;
// }

// initiate sigma

// create the clustersLabel layer
// const clustersLayer = document.createElement("div");
// clustersLayer.id = "clustersLayer";
// let clusterLabelsDoms = "";
// for (const country in countryClusters) {
//     // for each cluster create a div label
//     const cluster = countryClusters[country];
//     // adapt the position to viewport coordinates
//     const viewportPos = renderer.graphToViewport(cluster as Coordinates);
//     clusterLabelsDoms += `<div id='${cluster.label}' class="clusterLabel" style="top:${viewportPos.y}px;left:${viewportPos.x}px;color:${cluster.color}">${cluster.label}</div>`;
// }
// clustersLayer.innerHTML = clusterLabelsDoms;
// // insert the layer underneath the hovers layer
// container.insertBefore(clustersLayer, document.getElementsByClassName("sigma-hovers")[0]);

// Clusters labels position needs to be updated on each render

// renderer.on("afterRender", () => {
//     for (const country in countryClusters) {
//         const cluster = countryClusters[country];
//         const clusterLabel = document.getElementById(cluster.label);
//         // update position from the viewport
//         const viewportPos = renderer.graphToViewport(cluster as Coordinates);
//         clusterLabel.style.top = `${viewportPos.y}px`;
//         clusterLabel.style.left = `${viewportPos.x}px`;
//     }
// });
