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
  d3.csv("DONE.csv").then((data) => {

    print_len = 10

    for (let i=0; i< print_len; i++)
    {
      
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
      
      Tooltip
      .html("Rating: " + d[0])
      .style("left", (d3.pointer(event)[0]) + "px")
      .style("top", (d3.pointer(event)[1]+1300) + "px");
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
    .style("text-anchor", "middle");

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

// legend 
    FRAME1.append("circle").attr("cx",100).attr("cy",40).attr("r", 6).style("fill", "#e41a1c");
 FRAME1.append("text").attr("x", 120).attr("y", 40).text("PG").style("font-size", "15px").attr("alignment-baseline","middle");
  
   FRAME1.append("circle").attr("cx",100).attr("cy",60).attr("r", 6).style("fill", "#377eb8");
    FRAME1.append("text").attr("x", 120).attr("y", 60).text("PG-13").style("font-size", "15px").attr("alignment-baseline","middle")  ; 
    
    FRAME1.append("circle").attr("cx",100).attr("cy",80).attr("r", 6).style("fill", "#4daf4a");
    FRAME1.append("text").attr("x", 120).attr("y", 80).text("R").style("font-size", "15px").attr("alignment-baseline","middle");

    FRAME1.append("circle").attr("cx",100).attr("cy",100).attr("r", 6).style("fill", "#984ea3");
    FRAME1.append("text").attr("x", 120).attr("y", 100).text("TV-14").style("font-size", "15px").attr("alignment-baseline","middle")  ; 

    FRAME1.append("circle").attr("cx",100).attr("cy",120).attr("r", 6).style("fill", "#ff7f00");
 FRAME1.append("text").attr("x", 120).attr("y", 120).text("TV-MA").style("font-size", "15px").attr("alignment-baseline","middle");
  
   FRAME1.append("circle").attr("cx",100).attr("cy",140).attr("r", 6).style("fill", "#ffff33");
    FRAME1.append("text").attr("x", 120).attr("y", 140).text("TV-PG").style("font-size", "15px").attr("alignment-baseline","middle")  ; 
    

  });

}

build_line_plot();

function produce_tickets (){
  //build frame for bar chart
const FRAME2 = d3.select("#vis2") 
.append("svg") 
.attr("height", FRAME_HEIGHT)   
.attr("width", FRAME_WIDTH)
.attr("class", "frame"); 



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

d3.csv("DONE.csv").then(function(data) {

  const X_SCALE3 = d3.scaleBand()
              .domain(data.map((d) => {return d.rating}))
              .range([0, VIS_WIDTH]);

  const Y_SCALE3 = d3.scaleLinear()
              .range([VIS_HEIGHT, 0])
              .domain([0, 50]);

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
 
//replace 'mean_complexity_scores' with  dictionary of mean complexity scores
  document.getElementById("G-score").innerHTML += " " + mean_complexity_scores['G'];
  document.getElementById("PG-score").innerHTML += " " + mean_complexity_scores['PG'];
  document.getElementById("PG-13-score").innerHTML += " " + mean_complexity_scores['PG-13'];
  document.getElementById("R-score").innerHTML += " " + mean_complexity_scores['R'];
  document.getElementById("NR-score").innerHTML += " " + mean_complexity_scores['NR'];

});

}


const FRAME_8 = d3.select("#vis4") 
  .append("svg") 
  .attr("height", FRAME_HEIGHT)   
  .attr("width", FRAME_WIDTH)
  .attr("id", "spsvg")
  .attr("class", "frame");


const FRAME_9 = d3.select("#vis5") 
  .append("svg") 
  .attr("height", FRAME_HEIGHT)   
  .attr("width", FRAME_WIDTH)
  .attr("id", "spsvg")
  .attr("class", "frame");


d3.csv("DONE.csv").then((data) => {



  const MAX_Y_BAR = 500;

  const X_SCALE3 = d3.scaleBand()
              .domain(data.map((d) => {return d.rating}))
              .range([0, VIS_WIDTH]);


  const Y_SCALE3 = d3.scaleLinear()
               .domain([0, MAX_Y_BAR + 10])
    //take height as first parameter as coordinates start from top left
              .range([VIS_HEIGHT,0]);

  // get max x and y values
  const MAX_X = d3.max(data, d => {return parseInt(d.duration)});
  const MAX_Y = d3.max(data, d => {return parseInt(d.complexity)});
  // scaling functions
  const X_SCALE = d3.scaleLinear()
            .domain([0, (MAX_X + 1.0)])
              .range([0, VIS_WIDTH]);

  // range has to go from big to small so that 
  // the data is flipped along the y-axis (how a user would be 
  //  used to seeing a plot)
  const Y_SCALE = d3.scaleLinear()
            .domain([0, (MAX_Y + 1.0)])
              .range([(VIS_HEIGHT),0]);


  // creates a tooltip
  let Tooltip_bar = d3.select("#vis5")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px");

  // mouseover activates the tooltip to be seen
  let mouseover_bar = function(d) {
    Tooltip_bar
    .style("opacity", 1);
  }

  // mousemove keeps the tooltip next to the mouse
  let mousemove_bar = function(event, d) {
  
    Tooltip_bar
    .html("Genres: " + d.listed_in)
    .style("left", (d3.pointer(event)[0] + 500) + "px")
    .style("top", (d3.pointer(event)[1]+1800) + "px");
  }

  // mouseleave makes tooltip transparent when outside a bar.
  let mouseleave_bar = function(d) {
    Tooltip_bar
    .style("opacity", 0);
  }

  // plot vis 1
  let mycirc1 = FRAME_8.selectAll(".point")
          .data(data)
          .enter()
          .append("circle")
                  .attr("cx", d => {
                      return X_SCALE(parseFloat(d.duration)) + MARGINS.left
                    })
                  .attr("cy", d => {
                      return Y_SCALE(parseFloat(d.complexity)) + MARGINS.top
                  })
                  .attr("r", 5)
                  .attr("class", "point")
                  .attr("opacity", .75)
                   .attr("fill", function (d) {
                      if(d.rating === "G") {
                        return "pink"
                      } else if (d.rating === "PG") {
                        return "lightblue"
                      } else if (d.rating=== "PG-13"){
                        return "lightgreen"
                      }
                        else if (d.rating === "R"){
                          return "gold"
                        }
                        else {
                          return "black"
                        }
                      

                    })

                  .attr("id", d => {return d.rating}); 

  d3.selectAll(".bar")
    .remove();
  console.log(data)

  // want an array of 5 elements with that information
  // do data process outside render function
    // right after datalist, get new array for bar data 
    // combine w/ average first
    // d3 average function (d3.mean())
    // create array for each category that contains durations for each movie as just numbers, then use 
    //d3.mean() for average on each category
      //js mapping function so for every element in the array has a function applied to it and replaces element wi
      // with output of funciton
    // map: https://www.w3schools.com/jsref/jsref_map.asp
    // filter: https://www.w3schools.com/jsref/jsref_filter.asp
    // use filter function to filter out for different categories
      // if this function is true: keep 
          //(item) => return item.rating === 'pg-13'
          // then use the mapping function 
            // (item) => return item.duration
            //avgDuration = d3.mean(), then create a new array with those means and associated ratings

                //[
 //  {
   //    rating: 'pg-13',
 //      duration: avgDuration
   // },
//    {
  //     rating: 'pg',
    //   duration: avgDuration
   // },
//]


  // plot vis 2
  let mybar = FRAME_9.selectAll(".bar")
         .data(data)
            .enter().append("rect")
                  .attr("class", "bar")
                  .attr("x", d => {
                      return (X_SCALE3(d.rating) + MARGINS.left)})
                  .attr("y", (d) =>{ return Y_SCALE3(d.duration) + MARGINS.top })
                  .attr("width", X_SCALE3.bandwidth() - 5)
                  .attr("height", (d) => { return VIS_HEIGHT - Y_SCALE3(d.duration) })
                  .attr("id", d => {return d.rating})
                  .on("mouseover", mouseover_bar)
                  .on("mousemove", mousemove_bar)
                  .on("mouseleave", mouseleave_bar)
                  .on("click", mouseClickEvent)
                                     .attr("fill", function (d) {
                      if(d.rating === "G") {
                        return "pink"
                      } else if (d.rating === "PG") {
                        return "lightblue"
                      } else if (d.rating=== "PG-13"){
                        return "lightgreen"
                      }
                        else if (d.rating === "R"){
                          return "gold"
                        }
                        else {
                          return "black"
                        }
                      

                    });


    FRAME_8.append("g")
          .attr("transform", "translate(" + 
            MARGINS.left + "," + (MARGINS.top + VIS_HEIGHT) + ")")
            .call(d3.axisBottom(X_SCALE).ticks(8));
  
  FRAME_8.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 20 )
            .attr("x", -300)
            .style("fill", "black")
            .text("Complexity"); 


  FRAME_8.append("text")
            .attr("x", VIS_WIDTH / 2 )
            .attr("y",  X_SCALE(0) + 490 )
            .style("text-anchor", "middle")
            .style("fill", "black")
            .text("Duration (Minutes)");
  
  // create y-axis
  FRAME_8.append("g")
          .attr("transform", "translate(" + 
            MARGINS.left + "," + (MARGINS.top) + ")")
          .call(d3.axisLeft(Y_SCALE).ticks(15));
  
  FRAME_8.append("text")
    .attr("x", LINEVIS_WIDTH/3)
    .attr("y", 30)
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("Complexity and Duration for All Movies");
    

    FRAME_8.call( d3.brush()                 
            .extent([[0,0],[FRAME_WIDTH, FRAME_HEIGHT]]) 
            .on("start brush", updateChart) 
    )
  // create x-axis




 
  FRAME_9.append("g")
          .attr("transform", "translate(" + 
            MARGINS.left+ "," + (MARGINS.top + VIS_HEIGHT) + ")")
          .call(d3.axisBottom(X_SCALE3).ticks(10));

  //Create Y axis label
  FRAME_9.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 20 )
            .attr("x", -300)
            .text("Duration (Minutes)"); 

  // create y-axis
  FRAME_9.append("g")
          .attr("transform", "translate(" + 
            MARGINS.left + "," + (MARGINS.top) + ")")
          .call(d3.axisLeft(Y_SCALE3));

  FRAME_9.append("text")
            .attr("x", VIS_WIDTH / 2 )
            .attr("y",  Y_SCALE3(0) + 90 )
            .style("text-anchor", "middle")
            .text("Rating");

        FRAME_9.append("text")
    .attr("x", LINEVIS_WIDTH/3)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .text("Average Duration for Each Genre");



    // brushing function
    function updateChart(event) {
        const extent = event.selection;
        // change the class of each point or bar if corresponding was brushed
        mycirc1.classed("selected", function(d){
                        return isBrushed(extent, 
                        (X_SCALE(d.duration) + MARGINS.left), (Y_SCALE(d.complexity) + MARGINS.top))})                                                      
        mybar.classed("selected", function(d){
                        return isBrushed(extent, 
                        (X_SCALE(d.duration) + MARGINS.left), (Y_SCALE(d.complexity) + MARGINS.top))})                                                           


  // brushing function, returns true or false if point is in selection area
  function isBrushed(brush_coords, cx, cy) {

       var x0 = brush_coords[0][0],
           x1 = brush_coords[1][0],
           y0 = brush_coords[0][1],
           y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1}; // returns TRUE or FALSE


};});

// Legends for linked bar chart and scatter plot 
    FRAME_8.append("circle").attr("cx",80).attr("cy",40).attr("r", 6).style("fill", "pink");
 FRAME_8.append("text").attr("x", 100).attr("y", 40).text("G").style("font-size", "15px").attr("alignment-baseline","middle").attr("fill", "black");
  
   FRAME_8.append("circle").attr("cx",80).attr("cy",60).attr("r", 6).style("fill", "lightblue");
    FRAME_8.append("text").attr("x", 100).attr("y", 60).text("PG").style("font-size", "15px").attr("alignment-baseline","middle").attr("fill", "black")  ; 
    
    FRAME_8.append("circle").attr("cx",80).attr("cy",80).attr("r", 6).style("fill", "lightgreen");
    FRAME_8.append("text").attr("x", 100).attr("y", 80).text("PG-13").style("font-size", "15px").attr("alignment-baseline","middle").attr("fill", "black");

    FRAME_8.append("circle").attr("cx",80).attr("cy",100).attr("r", 6).style("fill", "gold");
    FRAME_8.append("text").attr("x", 100).attr("y", 100).text("R").style("font-size", "15px").attr("alignment-baseline","middle").attr("fill", "black")  ; 

    FRAME_8.append("circle").attr("cx",80).attr("cy",120).attr("r", 6).style("fill", "black");
 FRAME_8.append("text").attr("x", 100).attr("y", 120).text("NR").style("font-size", "15px").attr("alignment-baseline","middle").attr("fill", "black");
  
       FRAME_9.append("circle").attr("cx",80).attr("cy",40).attr("r", 6).style("fill", "pink");
 FRAME_9.append("text").attr("x", 100).attr("y", 40).text("G").style("font-size", "15px").attr("alignment-baseline","middle").attr("fill", "black");
  
   FRAME_9.append("circle").attr("cx",80).attr("cy",60).attr("r", 6).style("fill", "lightblue");
    FRAME_9.append("text").attr("x", 100).attr("y", 60).text("PG").style("font-size", "15px").attr("alignment-baseline","middle").attr("fill", "black")  ; 
    
    FRAME_9.append("circle").attr("cx",80).attr("cy",80).attr("r", 6).style("fill", "lightgreen");
    FRAME_9.append("text").attr("x", 100).attr("y", 80).text("PG-13").style("font-size", "15px").attr("alignment-baseline","middle").attr("fill", "black");

    FRAME_9.append("circle").attr("cx",80).attr("cy",100).attr("r", 6).style("fill", "gold");
    FRAME_9.append("text").attr("x", 100).attr("y", 100).text("R").style("font-size", "15px").attr("alignment-baseline","middle").attr("fill", "black")  ; 

    FRAME_9.append("circle").attr("cx",80).attr("cy",120).attr("r", 6).style("fill", "black");
 FRAME_9.append("text").attr("x", 100).attr("y", 120).text("NR").style("font-size", "15px").attr("alignment-baseline","middle").attr("fill", "black");


function mouseClickEvent(event, d) {
  
    
    produce_tickets(d.rating)
}

  