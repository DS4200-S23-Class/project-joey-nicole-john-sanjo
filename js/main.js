const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 

const LINEFRAME_WIDTH = 1000;

const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

const LINEVIS_WIDTH = LINEFRAME_WIDTH - MARGINS.left - MARGINS.right; 

const TICK_HEIGHT = 200;
const TICK_WIDTH = 400;


const FRAME1 = d3.select("#vis1")
.append("svg")
.attr("height", FRAME_HEIGHT)
.attr("width", LINEFRAME_WIDTH)
.attr('id', 'spsvg')
.attr("class", "frame");


function display_rows(){

    // reset graph if new points are being added 
  document.getElementById("spsvg").innerHTML = '';
  d3.csv("complete.csv").then((data) => {

    print_len = 10

    for (let i=0; i< print_len; i++)
    {
      console.log(data[i]);
    }
  });
}
display_rows();

function build_line_plot(addpoints, newdata) {

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
    .range([MARGINS.left, LINEVIS_WIDTH]);
    FRAME1.append("g")
    .attr("transform", "translate(" + 0 + 
      "," + (VIS_HEIGHT + MARGINS.bottom) + ")") 
    .call(d3.axisBottom(x_scale).ticks(10));

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
    .attr("x", LINEVIS_WIDTH/2)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .text("Movies Released Per Year By Rating");

    //Create X axis label   
    FRAME1.append("text")
    .attr("x", LINEVIS_WIDTH / 2 )
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

    // Handling Legend (incomplete)
    FRAME1.append("circle").attr("cx",100).attr("cy",130).attr("r", 6).style("fill", "#e41a1c")
    FRAME1.append("circle").attr("cx",100).attr("cy",160).attr("r", 6).style("fill", "#404080")
    FRAME1.append("text").attr("x", 120).attr("y", 130).text("variable A").style("font-size", "15px").attr("alignment-baseline","middle")
    FRAME1.append("text").attr("x", 120).attr("y", 160).text("variable B").style("font-size", "15px").attr("alignment-baseline","middle")        



  });
}

build_line_plot();

  //build frame for bar chart
const FRAME2 = d3.select("#vis2") 
.append("svg") 
.attr("height", FRAME_HEIGHT)   
.attr("width", FRAME_WIDTH)
.attr("class", "frame"); 

function build_interactive_barchart() {
  //build bar plot inside of .then
  d3.csv("complete.csv").then((data) => {
      //find max X by returning "rating"
    const MAX_X_BAR = d3.max(data, (d) => {return (d.rating)});
      //find max Y by returning "duration" as an int
    const MAX_Y_BAR = d3.max(data, (d) => {return parseInt(d.duration)});

    //domain and range

    //use scaleBand() because ratings is nominal  
    const X_SCALE_BAR = d3.scaleBand()
    //domain are "rating" variables
    .domain(data.map(function(d) {return d.rating}))
    .range([0, VIS_WIDTH]).padding(0.25);

    //use scaleLinear() because duration is quantitative and bar length should be proportional to value
    const Y_SCALE_BAR = d3.scaleLinear()
    .domain([0, MAX_Y_BAR + 10])
    //take height as first parameter as coordinates start from top left
    .range([VIS_HEIGHT,0]);

    // Bar styling using d3 textures library
    const texture = textures.lines().size(4).orientation("vertical").stroke('red');
    FRAME2.call(texture);
    let bar_chart = FRAME2.selectAll("bars")
    //this is passed from .then()
    .data(data)
    .enter()
    .append("rect") //appending attributes below to rect
            .attr("class", "rect") //add class
            .attr("x", (d) => { return X_SCALE_BAR(d.rating) + MARGINS.left }) // use d.category for x
            .attr("y", (d) =>{ return Y_SCALE_BAR(d.duration) + MARGINS.top }) // use d.amount for y
            .attr("width", X_SCALE_BAR.bandwidth())//width
            .attr("height", (d) => { return VIS_HEIGHT - Y_SCALE_BAR(d.duration) })//height
            .attr('fill', texture.url());

          // Add an x axis to the vis.
            FRAME2.append("g") 
            .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
            .call(d3.axisBottom(X_SCALE_BAR).ticks(14)) 
            .attr("font-size", '10px'); 

          //Create X axis label
            FRAME2.append("text")
            .attr("x", VIS_WIDTH / 2 )
            .attr("y",  Y_SCALE_BAR(0) + 90 )
            .style("text-anchor", "middle")
            .text("Rating"); 

          //Create Y axis label
            FRAME2.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 20 )
            .attr("x", -300)
            .text("Duration (Minutes)"); 

          // add a y axis to the vis
            FRAME2.append("g") 
            .attr("transform", "translate(" + MARGINS.top + "," + MARGINS.left + ")") 
            .call(d3.axisLeft(Y_SCALE_BAR).ticks(10)) 
            .attr("font-size", '10px');

          //tooltip
            const TOOLTIP = d3.select("#vis2")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0); 

          //define event handler functions for tooltips
            function handleMouseover(event, d) {
          //on mouseover, make opaque 
              TOOLTIP.style("opacity", 1);

            }

          //moving the mouse
            function handleMousemove(event, d) {
          //position the tooltip and fill in information 
              TOOLTIP.html("Category: " + d.rating + "<br>Amount: " + d.duration)
              .style("left", (event.pageX + 10) + "px") //add offset from mouse
              .style("top", (event.pageY - 50) + "px")
            }



          //on mouseleave, make transparent again 
            function handleMouseleave(event, d) { 
              TOOLTIP.style("opacity", 0)

            } 

          //add event listeners
            FRAME2.selectAll(".rect")
            .on("mouseover", handleMouseover) 
            .on("mousemove", handleMousemove)
            .on("mouseleave", handleMouseleave);   



          });
}
build_interactive_barchart();

const FRAME3 = d3.select("#G") 
.append("svg") 
.attr("height", TICK_HEIGHT)   
.attr("width", TICK_WIDTH)
.attr("class", "frame"); 

const FRAME4= d3.select("#PG") 
.append("svg") 
.attr("height", TICK_HEIGHT)   
.attr("width", TICK_WIDTH)
.attr("class", "frame"); 

const FRAME5= d3.select("#PG-13") 
.append("svg") 
.attr("height", TICK_HEIGHT)   
.attr("width", TICK_WIDTH)
.attr("class", "frame");

const FRAME6= d3.select("#R") 
.append("svg") 
.attr("height", TICK_HEIGHT)   
.attr("width", TICK_WIDTH)
.attr("class", "frame");

const FRAME7= d3.select("#NR") 
.append("svg") 
.attr("height", TICK_HEIGHT)   
.attr("width", TICK_WIDTH)
.attr("class", "frame");

console.log("test")
d3.csv("complete.csv").then(function(data) {

  // filter the data based on the ratings 
  const filtered_data = data.filter(d => ["G", "PG", "PG-13", "R", "NR"].includes(d.rating));

  // group the data by rating
  const grouped_ratings = d3.group(filtered_data, d => d.rating);

  // iterate over each group and calculate the mean complexity score
  const mean_complexity_scores = {};
  grouped_ratings.forEach((value, key) => {
    const mean_complexity_score = d3.mean(value.map(d => parseInt(d.complexity)));
    mean_complexity_scores[key] = (mean_complexity_score).toFixed(2);
  });

  console.log(mean_complexity_scores); 
//replace 'mean_complexity_scores' with  dictionary of mean complexity scores
  document.getElementById("G-score").innerHTML += " " + mean_complexity_scores['G'];
  document.getElementById("PG-score").innerHTML += " " + mean_complexity_scores['PG'];
  document.getElementById("PG-13-score").innerHTML += " " + mean_complexity_scores['PG-13'];
  document.getElementById("R-score").innerHTML += " " + mean_complexity_scores['R'];
  document.getElementById("NR-score").innerHTML += " " + mean_complexity_scores['NR'];

});

const FRAME_8 = d3.select("#vis4") 
  .append("svg") 
  .attr("height", FRAME_HEIGHT)   
  .attr("width", FRAME_WIDTH)
  .attr("class", "frame");

function build_scatter() {


  d3.csv("complete.csv").then((data) => {

    const MAX_X_LENGTH = d3.max(data, (d) => { return parseInt(d.duration); });
    const MAX_Y_LENGTH = d3.max(data, (d) => { return parseInt(d.complexity); });

// creates scale for data 
    const X_SCALE_WIDTH = d3.scaleLinear() 
    .domain([0, (MAX_X_LENGTH + 1)]) 
    .range([0, VIS_WIDTH]); 


    const Y_SCALE_LENGTH = d3.scaleLinear() 
    .domain([0, (MAX_Y_LENGTH + 1)])  
    .range([VIS_HEIGHT, 0]); 

    const color = d3.scaleOrdinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

    
    FRAME_8.selectAll("points") 
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "scatter")
    .attr("cx", (d) => { return (X_SCALE_WIDTH(d.duration) + MARGINS.left) })
    .attr("cy", (d) => { return (Y_SCALE_LENGTH(d.complexity) + MARGINS.bottom) })
    .attr("r", 4)
    .attr("stroke", function(d){ return color(d[0]); })
    .attr("rating", (d) => { return (d.rating) })

            //Create Title 
    FRAME_8.append("text")
    .attr("x", LINEVIS_WIDTH/2)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .text("TITLE");

         // Add an x axis to the vis.
    FRAME_8.append("g") 
    .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
    .call(d3.axisBottom(X_SCALE_WIDTH).ticks(14)) 
    .attr("font-size", '10px'); 

          //Create X axis label
    FRAME_8.append("text")
      .attr("x", VIS_WIDTH / 2 )
      .attr("y",  Y_SCALE_LENGTH(0) + 90 )
      .style("text-anchor", "middle")
      .text("Duration (Minutes)"); 

          //Create Y axis label
    FRAME_8.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 20 )
      .attr("x", -300)
      .text("Complexity"); 

          // add a y axis to the vis
    FRAME_8.append("g") 
    .attr("transform", "translate(" + MARGINS.top + "," + MARGINS.left + ")") 
    .call(d3.axisLeft(Y_SCALE_LENGTH).ticks(10)) 
    .attr("font-size", '10px');

      // calls brush to vis2
    FRAME_8.call(d3.brush()                 
      .extent([[0,0], [FRAME_WIDTH, FRAME_HEIGHT]])
      .on("start brush", brush_selection)
      );


         //tooltip
  const TOOLTIP = d3.select("#vis4")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0); 

          //define event handler functions for tooltips
  function handleMouseover(event, d) {
          //on mouseover, make opaque 
    TOOLTIP.style("opacity", 1);

  }
          //moving the mouse
  function handleMousemove(event, d) {
          //position the tooltip and fill in information 
    TOOLTIP.html("Duration: " + d.duration + "<br>Complexity: " + d.complexity)
              .style("left", (event.pageX + 10) + "px") //add offset from mouse
              .style("top", (event.pageY - 50) + "px");
            }



          //on mouseleave, make transparent again 
            function handleMouseleave(event, d) { 
              TOOLTIP.style("opacity", 0)

            } 

            function brush_selection(event) {
              let extent = event.selection;


    // checks that the brushed functions are highlighted

              FRAME_8.classed("selected", function(d){return highlight(extent, (X_SCALE_WIDTH(d.duration)+MARGINS.left), (Y_SCALE_WIDTH(d.complexity)+MARGINS.bottom)) });
              //FRAME2.classed("selected", function(d){return highlight(coords, (X_SCALE_WIDTH(d.rating)+MARGINS.left), (Y_SCALE_WIDTH(d.duration)+MARGINS.bottom)) });

            };

  // check whether a point is in the selection or not
            function highlight(coords, cx, cy) {
              let x0 = coords[0][0],
              x1 = coords[1][0],
              y0 = coords[0][1],
              y1 = coords[1][1];
             return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;

            };
          }
)};
          build_scatter();




