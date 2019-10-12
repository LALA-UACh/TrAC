import * as d3 from "d3";

var originalConfig = require("../config/timeline.json");
var config;

var x;
var y;

var nodeElement;

var PGA;
var PSP;
var ProgramPGA;
var prediction_data;
var showPrediction;
// window.addEventListener("resize", function(event) {
//   updateWindow();
// });

function createGraphic(
  node,
  PGA_val,
  PSP_val,
  ProgramPGA_val,
  prediction_data_val
) {
  function allnull(element) {
    return element === null;
  }
  showPrediction = false;
  config = Object.assign({}, originalConfig);
  config.terms = config.terms > PGA_val.length ? config.terms : PGA_val.length;
  config.width = config.terms * config.spacingBetweenTermsPoints;
  nodeElement = node;

  PGA = PGA_val.every(allnull) ? [] : PGA_val;
  PSP = PSP_val.every(allnull) ? [] : PSP_val;
  ProgramPGA = ProgramPGA_val.every(allnull) ? [] : ProgramPGA_val;

  prediction_data = prediction_data_val;

  if (config.autoResize) {
    autoResize(node);
  }

  let radius = config.radius;

  //x = d3.scaleLinear().domain(config.termsRange).range([0,config.width]);
  //config.width = 14*70;
  x = d3
    .scaleLinear()
    .domain([0.8, config.terms + 0.5])
    .range([0, config.width]);
  y = d3
    .scaleLinear()
    .domain(config.notasRange)
    .range([config.height, 0]);

  const div = d3
    .select(node)
    .append("div")
    .attr("class", "tooltipPSP")
    .style("opacity", 0)
    .style("background", config.PSP_color);
  const div2 = d3
    .select(node)
    .append("div")
    .attr("class", "tooltipPGA")
    .style("opacity", 0)
    .style("background", config.PGA_color);
  const div3 = d3
    .select(node)
    .append("div")
    .attr("class", "tooltipProgramPGA")
    .style("opacity", 0)
    .style("background", config.ProgramPGA_color);

  let PSP_Array_Circle = [];
  PSP.forEach((e, i) => {
    if (e != 0 && e != null) PSP_Array_Circle.push({ value: e, index: i });
  });
  let PSP_Array_Line = [];
  PSP_Array_Circle.forEach((e, i) => {
    if (i + 1 <= PSP_Array_Circle.length - 1)
      PSP_Array_Line.push({
        values: [e.value, PSP_Array_Circle[i + 1].value],
        index: [e.index, PSP_Array_Circle[i + 1].index],
      });
  });

  let PGA_Array_Circle = [];
  PGA.forEach((e, i) => {
    if (e != 0 && e != null) PGA_Array_Circle.push({ value: e, index: i });
  });
  let PGA_Array_Line = [];
  PGA_Array_Circle.forEach((e, i) => {
    if (i + 1 <= PGA_Array_Circle.length - 1)
      PGA_Array_Line.push({
        values: [e.value, PGA_Array_Circle[i + 1].value],
        index: [e.index, PGA_Array_Circle[i + 1].index],
      });
  });

  let ProgramPGA_Array_Circle = [];
  ProgramPGA.forEach((e, i) => {
    if (e != 0 && e != null)
      ProgramPGA_Array_Circle.push({ value: e, index: i });
  });
  let ProgramPGA_Array_Line = [];
  ProgramPGA_Array_Circle.forEach((e, i) => {
    if (i + 1 <= ProgramPGA_Array_Circle.length - 1)
      ProgramPGA_Array_Line.push({
        values: [e.value, ProgramPGA_Array_Circle[i + 1].value],
        index: [e.index, ProgramPGA_Array_Circle[i + 1].index],
      });
  });

  // Create SVG.
  //+ node.getBoundingClientRect().width / 8
  let svg = d3
    .select(node)
    .append("svg")
    .attr("id", "TimeLineSVG")
    //.attr("width", node.getBoundingClientRect().width)
    .attr("width", config.width)
    .attr(
      "height",
      config.height + config.paddingHeight * 1.5 + config.marginTop
    );
  //  .attr("transform",`translate(${config.marginLeft},${config.marginTop})`);

  let g = svg
    .append("g")
    .attr("transform", `translate(${config.marginLeft},${config.marginTop})`);
  //SIMBOLOGIA DE LOS PUNTOS
  g.append("circle")
    .attr("fill", config.PSP_color)
    .attr("r", radius)
    .attr("cx", config.width / 5.5)
    .attr("cy", radius);
  g.append("text")
    .classed("unselectable", true)
    .text("PSP")
    .attr(
      "transform",
      `translate(${config.width / 5.5 + radius * 2},${config.fontSize})`
    )
    .attr("font-size", config.fontSize);
  g.append("circle")
    .attr("fill", config.PGA_color)
    .attr("r", radius)
    .attr("cx", config.width / 3.3)
    .attr("cy", radius);
  g.append("text")
    .classed("unselectable", true)

    .text("PGA")
    .attr(
      "transform",
      `translate(${config.width / 3.3 + radius * 2},${config.fontSize})`
    )
    .attr("font-size", config.fontSize);

  g.append("text")
    .classed("unselectable", true)

    .text("PGA de carrera")
    .attr(
      "transform",
      `translate(${config.width / 2.5 + radius * 2},${config.fontSize})`
    )
    .attr("font-size", config.fontSize);
  g.append("circle")
    .attr("fill", config.ProgramPGA_color)
    .attr("r", radius)
    .attr("cx", config.width / 2.5)
    .attr("cy", radius);

  g.append("text")
    .classed("unselectable", true)

    .text("Escala de notas")
    .attr("transform", `translate(5,${config.fontSize})`)
    .attr("font-size", config.fontSize)
    .attr("font-weight", "bold");
  g.append("text")
    .classed("unselectable", true)

    .text("Semestre")
    .attr(
      "transform",
      `translate(${config.width + config.paddingWidth * 2.5},${config.height +
        config.paddingHeight})`
    )
    .attr("font-size", config.fontSize)
    .attr("font-weight", "bold");

  g = g.append("g").attr("id", "ContenedorGrafica");

  g.attr(
    "transform",
    `translate(${config.paddingWidth},${config.paddingHeight})`
  );

  let xAxis = d3
    .axisBottom()
    .scale(x)
    .ticks("")
    .tickSizeOuter(0);
  let yAxis = d3
    .axisLeft()
    .scale(y)
    .ticks(config.notasRange[1]);

  //console.log(x());
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(${config.paddingWidth},${config.height})`)
    .call(xAxis);

  g.append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${config.paddingWidth},0)`)
    .call(yAxis);

  g.selectAll(".axis")
    .selectAll("path")
    .style("stroke", config.axis_color)
    .style("stroke-width", config.axis_width);
  g.selectAll(".axis")
    .selectAll(".tick")
    .selectAll("text")
    .classed("unselectable", true)

    .attr("font-size", config.fontSize);

  g.selectAll(".x")
    .append("line")
    .attr("x1", 0)
    .attr("y1", -y(3) + 1)
    .attr("x2", config.width)
    .attr("y2", -y(3) + 1)
    .attr("stroke", "black")
    .attr("stroke-width", "0.8")
    .attr("stroke-dasharray", "5,5");
  //console.log([{index:[1,2],points:[3,4]},{}]);
  //LINEA QUE UNE LOS PUNTOS DEL PGA
  g.selectAll(".pga-line")
    .data(PGA_Array_Line)
    .enter()
    .append("line")
    .attr("class", "pga-line")
    .attr("x1", function(d, i) {
      return x(d.index[0] + 1) + config.paddingAxes;
    })
    .attr("y1", function(d, i) {
      return y(d.values[0]);
    })
    .attr("x2", function(d, i) {
      return x(d.index[1] + 1) + config.paddingAxes;
    })
    .attr("y2", function(d, i) {
      return y(d.values[1]);
    })
    .attr("stroke-width", config.strokeWidth)
    .attr("stroke", config.PGA_color);

  //LINEA QUE UNE LOS PUNTOS DEL PSP
  g.selectAll(".psp-line")
    .data(PSP_Array_Line)
    .enter()
    .append("line")
    .attr("class", "psp-line")
    .attr("x1", function(d, i) {
      return x(d.index[0] + 1) + config.paddingAxes;
    })
    .attr("y1", function(d, i) {
      return y(d.values[0]);
    })
    .attr("x2", function(d, i) {
      return x(d.index[1] + 1) + config.paddingAxes;
    })
    .attr("y2", function(d, i) {
      return y(d.values[1]);
    })
    .attr("stroke-width", config.strokeWidth)
    .attr("stroke", config.PSP_color);

  //LINEA QUE UNE LOS PUNTOS DEL ProgramPGA
  g.selectAll(".programPga-line")
    .data(ProgramPGA_Array_Line)
    .enter()
    .append("line")
    .attr("class", "programPga-line")
    .attr("x1", function(d, i) {
      return x(d.index[0] + 1) + config.paddingAxes;
    })
    .attr("y1", function(d, i) {
      return y(d.values[0]);
    })
    .attr("x2", function(d, i) {
      return x(d.index[1] + 1) + config.paddingAxes;
    })
    .attr("y2", function(d, i) {
      return y(d.values[1]);
    })
    .attr("stroke-width", config.strokeWidth)
    .attr("stroke", config.ProgramPGA_color);

  //CIRCULOS PARA EL PGA
  g.selectAll(".pga-circle")
    .data(PGA_Array_Circle)
    .enter()
    .append("circle")
    .attr("class", "pga-circle")
    .attr("fill", config.PGA_color)
    .attr("r", radius)
    .attr("cx", function(d, i) {
      return x(d.index + 1) + config.paddingAxes;
    })
    .attr("cy", function(d, i) {
      return y(d.value);
    })
    .on("mouseover", function(d, i) {
      div2
        .transition()
        .duration(200)
        .style("opacity", 0.9);
      div2
        .html(d.value)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function(d, i) {
      div2
        .transition()
        .duration(500)
        .style("opacity", 0);
    });

  g.selectAll(".programPga-circle")
    .data(ProgramPGA_Array_Circle)
    .enter()
    .append("circle")
    .attr("class", "programPga-circle")
    .attr("fill", config.ProgramPGA_color)
    .attr("r", radius)
    .attr("cx", function(d, i) {
      return x(d.index + 1) + config.paddingAxes;
    })
    .attr("cy", function(d, i) {
      return y(d.value);
    })
    .on("mouseover", function(d, i) {
      div3
        .transition()
        .duration(200)
        .style("opacity", 0.9);
      div3
        .html(d.value)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function(d, i) {
      div3
        .transition()
        .duration(500)
        .style("opacity", 0);
    });

  //CIRCULOS PARA EL PGp
  g.selectAll(".psp-circle")
    .data(PSP_Array_Circle)
    .enter()
    .append("circle")
    .attr("class", "psp-circle")
    .attr("fill", config.PSP_color)
    .attr("originalColor", config.PSP_color)
    .attr("id", function(d, i) {
      return "PSP_" + d.index;
    })
    .attr("r", radius)
    .attr("cx", function(d, i) {
      return x(d.index + 1) + config.paddingAxes;
    })
    .attr("cy", function(d, i) {
      return y(d.value);
    })
    .on("mouseover", function(d, i) {
      div
        .transition()
        .duration(200)
        .style("opacity", 0.9);
      div
        .html(d.value)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function(d, i) {
      div
        .transition()
        .duration(500)
        .style("opacity", 0);
    });

  //SIMBOLOGIA DE LOS PUNTOS
  /*g.append("ellipse")
  .attr("fill",config.PSP_color)
  .attr("rx",5)
  .attr("ry",5)
  .attr("cx",200)
  .attr("cy",-20);
  g.append("text").text("PSP").attr("transform","translate(210,0)");
  g.append("ellipse")
  .attr("fill",config.PGA_color)
  .attr("rx",5)
  .attr("ry",5)
  .attr("cx",330)
  .attr("cy",-20);
  g.append("text").text("PGA").attr("transform","translate(340,0)");*/

  function autoResize(node) {
    let newspacingBetweenTermsPoints = parseInt(
      node.getBoundingClientRect().width / 27.81
    );
    config.spacingBetweenTermsPoints = newspacingBetweenTermsPoints;
    config.width = config.terms * config.spacingBetweenTermsPoints;
    let factor = parseInt(node.getBoundingClientRect().width / 2.27);
    let newheight = parseInt(factor / (1100 / config.height));
    let newpaddingWidth = parseInt(factor / (1100 / config.paddingWidth));
    let newpaddingHeight = parseInt(factor / (1100 / config.paddingHeight));
    let newmarginTop = parseInt(factor / (1100 / config.marginTop));
    let newmarginLeft = parseInt(factor / (1100 / config.marginLeft));
    let newpaddingAxes = parseInt(factor / (1100 / config.paddingAxes));
    let fontSize = parseInt(
      (factor + newheight) / ((1100 + config.height) / config.fontSize)
    );
    //config.width = factor;
    config.height = newheight;
    config.paddingWidth = newpaddingWidth;
    config.paddingHeight = newpaddingHeight;
    config.paddingAxes = newpaddingAxes;
    config.fontSize = fontSize;
    config.marginLeft = newmarginLeft;
    config.marginTop = newmarginTop;
  }
}

function updateWindow() {
  if (config && config.autoResize) {
    d3.select("#TimeLineSVG").remove();
    d3.select(".tooltipPGA").remove();
    d3.select(".tooltipPSP").remove();
    createGraphic(nodeElement, PGA, PSP, ProgramPGA, prediction_data);
  }
}

function updateGraphic(node, PGA, PSP) {
  let radius = config.width / 180;
  d3.selectAll(".rectangulo")
    .transition()
    .duration(1050)
    .attr("transform", "scale(1.2,2)");

  d3.select("#Term")
    .selectAll(".hiddenElements")
    .transition()
    .duration(0)
    .attr("visibility", "hidden");

  d3.select("#Term")
    .select("rect")
    .transition()
    .duration(1050)
    .attr("transform", "scale(1.2,2)")
    .attr("fill", "white");
  /*.attr("height",()=>{
      //console.log("ff",this.attr("height"));
      return 200;
    })*/

  /*d3.selectAll(".example").each(function(d,i) {
      //console.log("The x position of the rect #" + i + " is " + d3.select(this).attr("transform"))
      let x = d3.select(this).attr("x");
      let y = d3.select(this).attr("y");
      let newX = parseInt(x) +100;
      let newY = parseInt(y) +50;
      d3.select(this).transition()
      .duration(1050)
      .attr("x",newX).attr("y",newY)
      .attr("transform",()=>{
        return "translate("+newX+","+newY+")";
      })
    })*/

  const div = d3
    .select(node)
    .append("div")
    .attr("class", "tooltipPSP")
    .style("opacity", 0);
  const div2 = d3
    .select(node)
    .append("div")
    .attr("class", "tooltipPGA")
    .style("opacity", 0);

  let PGA_Array = [];
  PGA.forEach((e, i) => {
    if (i + 1 <= PGA.length - 1) PGA_Array.push([e, PGA[i + 1]]);
  });
  let PSP_Array = [];
  PSP.forEach((e, i) => {
    if (i + 1 <= PSP.length - 1) PSP_Array.push([e, PSP[i + 1]]);
  });

  let g = d3.select(node).select("g");

  // If it is necesary to remove elements
  g.selectAll(".pga-line")
    .data(PGA_Array)
    .exit()
    .remove();
  g.selectAll(".psp-line")
    .data(PSP_Array)
    .exit()
    .remove();
  g.selectAll(".pga-circle")
    .data(PGA)
    .exit()
    .remove();
  g.selectAll(".psp-circle")
    .data(PSP)
    .exit()
    .remove();

  // If it is necesary to add new elements
  g.selectAll(".pga-line")
    .data(PGA_Array)
    .enter()
    .append("line")
    .attr("class", "pga-line")
    .attr("stroke-width", 0)
    .attr("stroke", config.PGA_color);

  g.selectAll(".psp-line")
    .data(PSP_Array)
    .enter()
    .append("line")
    .attr("class", "psp-line")
    .attr("stroke-width", 0)
    .attr("stroke", config.PSP_color);

  g.selectAll(".pga-circle")
    .data(PGA)
    .enter()
    .append("circle")
    .attr("class", "pga-circle")
    .attr("fill", config.PGA_color)
    .attr("r", 0)
    .on("mouseover", function(d, i) {
      div2
        .transition()
        .duration(200)
        .style("opacity", 0.9);
      div2
        .html(d)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function(d, i) {
      div2
        .transition()
        .duration(500)
        .style("opacity", 0);
    });

  g.selectAll(".psp-circle")
    .data(PGA)
    .enter()
    .append("circle")
    .attr("class", "psp-circle")
    .attr("fill", config.PSP_color)
    .attr("r", 0)
    .on("mouseover", function(d, i) {
      div
        .transition()
        .duration(200)
        .style("opacity", 0.9);
      div
        .html(d)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function(d, i) {
      div
        .transition()
        .duration(500)
        .style("opacity", 0);
    });

  // All the elements move to the new positions
  g.selectAll(".pga-line")
    .data(PGA_Array)
    .transition()
    .duration(1050)
    .attr("stroke-width", config.strokeWidth)
    .attr("x1", function(d, i) {
      return x(i + 1) + config.paddingAxes;
    })
    .attr("y1", function(d, i) {
      return y(d[0]);
    })
    .attr("x2", function(d, i) {
      return x(i + 2) + config.paddingAxes;
    })
    .attr("y2", function(d, i) {
      return y(d[1]);
    });

  g.selectAll(".psp-line")
    .data(PSP_Array)
    .transition()
    .duration(1050)
    .attr("stroke-width", config.strokeWidth)
    .attr("x1", function(d, i) {
      return x(i + 1) + config.paddingAxes;
    })
    .attr("y1", function(d, i) {
      return y(d[0]);
    })
    .attr("x2", function(d, i) {
      return x(i + 2) + config.paddingAxes;
    })
    .attr("y2", function(d, i) {
      return y(d[1]);
    });

  g.selectAll(".pga-circle")
    .data(PGA)
    .transition()
    .duration(1050)
    .attr("r", radius)
    .attr("cx", function(d, i) {
      return x(i + 1) + config.paddingAxes;
    })
    .attr("cy", function(d, i) {
      return y(d);
    });

  g.selectAll(".psp-circle")
    .data(PSP)
    .transition()
    .duration(1050)
    .attr("r", radius)
    .attr("cx", function(d, i) {
      return x(i + 1) + config.paddingAxes;
    })
    .attr("cy", function(d, i) {
      return y(d);
    });
}

export default {
  createGraphic: createGraphic,
  updateGraphic: updateGraphic,
};
