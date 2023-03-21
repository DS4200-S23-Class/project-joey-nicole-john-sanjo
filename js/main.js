const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

const FRAME1 = d3.select("#vis1")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr('id', 'spsvg')
                    .attr("class", "frame");


function display_rows(){
  
    // reset graph if new points are being added 
  document.getElementById("spsvg").innerHTML = '';
  d3.csv("finished_1.csv").then((data) => {

    print_len = 10

    for (let i=0; i< print_len; i++)
    {
      console.log(data[i]);
    }
  });
}

function build_scatter_plot(addpoints, newdata) {

    d3.csv("line.csv").then((data) => {

    // creates a tooltip
    let Tooltip = d3.select("#vis1")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    // mouseover activates the tooltip to be seen
    let mouseover = function(d) {
      Tooltip
          .style("opacity", 1);
    }

    // mousemove keeps the tooltip next to the mouse
    let mousemove = function(event, d) {
      console.log(d)
      Tooltip
          .html("Rating: " + d[0])
          .style("left", (d3.pointer(event)[0]) + "px")
          .style("top", (d3.pointer(event)[1]+860) + "px");
    }

    // mouseleave makes tooltip transparent when outside a bar.
    let mouseleave = function(d) {
      Tooltip
          .style("opacity", 0);
    }
    
    const grouped = d3.group(data, d => d.rating); 


  
    // Add X axis --> it is a date format
    const x_scale = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.release_year; }))
    .range([MARGINS.left, VIS_WIDTH]);
     FRAME1.append("g")
     .attr("transform", "translate(" + 0 + 
                  "," + (VIS_HEIGHT + MARGINS.bottom) + ")") 
    .call(d3.axisBottom(x_scale).ticks(5));

     // Add Y axis
     const y_scale = d3.scaleLinear()
    .domain([0, 150]) // fix this
    .range([VIS_HEIGHT+MARGINS.top, 0]);
     FRAME1.append("g").attr("transform", "translate(" + MARGINS.left + 
     "," + (0) + ")") 
    .call(d3.axisLeft(y_scale));
      
    // color palette
    const color = d3.scaleOrdinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

    // Draw the line
    FRAME1.selectAll(".line")
        .data(grouped)
        .join("path")
          .attr("fill", "none")
          .attr("stroke", function(d){ return color(d[0]) })
          .attr("stroke-width", 1.5)
          .attr("d", function(d){
            return d3.line()
              .x(function(d) { return x_scale(d.release_year); })
              .y(function(d) { return y_scale(+d.Count); })
              (d[1])})
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave);
    
    
    //Create Title 
    FRAME1.append("text")
    .attr("x", VIS_WIDTH/2)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .text("Movies Released Per Year By Rating");

    //Create X axis label   
    FRAME1.append("text")
    .attr("x", VIS_WIDTH / 2 )
    .attr("y",  y_scale(0) + 40 )
    .style("text-anchor", "middle")
    .text("Year of Release");

    //Create Y axis label
    FRAME1.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20 )
    .attr("x", -200)
    
    .style("text-anchor", "middle")
    .text("Number of Releases"); 

  
    });
  }

  build_scatter_plot()


const FRAME2 = d3.select("#vis2")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr('id', 'spsvg')
                    .attr("class", "frame");
  function plot_bar(){
    d3.csv("finished_1.csv").then((data) => { 

        const Y_MAX = d3.max(data, (d) => { return parseInt(d.duration); });
        
        const X_SCALE = d3.scaleBand()
            .range([0, VIS_WIDTH])
            .domain(data.map(function(d) {return d.genre;}));
            
        const Y_SCALE = d3.scaleLinear() 
            .domain([0, 100])
            .range([VIS_HEIGHT, MARGINS.top]);

        FRAME2.selectAll('bars')
            .data(data)
            .enter()
            .append('rect')
            .attr("x", (d) => { return X_SCALE(d.genre) + MARGINS.left; })
            .attr("y", (d) => { return Y_SCALE(d.duration) + MARGINS.bottom; })
              .attr('width', X_SCALE.bandwidth() - 10)
              .attr('height', (d) => VIS_HEIGHT - Y_SCALE(d.duration))
              .attr('fill', 'deepskyblue')
              .attr('class', 'bar');

plot_bar()