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

    d3.csv("finished.csv").then((data) => {
    
    const grouped = d3.group(data, d => d.rating); 
    console.log(grouped)

  
    // Add X axis --> it is a date format
    const x_scale = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.release_year; }))
    .range([ 0, VIS_WIDTH]);
     FRAME1.append("g")
    .attr("transform", `translate(0, ${VIS_HEIGHT})`)
    .call(d3.axisBottom(x_scale).ticks(5));

     // Add Y axis
     const y_scale = d3.scaleLinear()
    .domain([0, 600]) // fix this
    .range([VIS_HEIGHT, 0]);
     FRAME1.append("g")
    .call(d3.axisLeft(y_scale));
      
    // Draw the line
    FRAME1.selectAll(".line")
        .data(grouped)
        .join("path")
          .attr("fill", "none")
          .attr("stroke-width", 1.5)
          .attr("d", function(d){
            return d3.line()
              .x(function(d) { return x_scale(d.release_year); })
              .y(function(d) { return x_scale(d.n); })
              (d[1])})
  
      // // Adds an X axis to the scatter plot
      // FRAME1.append("g") 
      //       .attr("transform", "translate(" + MARGINS.left + 
      //             "," + (VIS_HEIGHT + MARGINS.top) + ")") 
      //       .call(d3.axisBottom(X_SCALE1).ticks(10)) 
      //         .attr("font-size", '20px'); 
  
      // // Adds a Y axis to the scatter plot
      // FRAME1.append("g") 
      //     .attr("transform", "translate(" + MARGINS.left + 
      //         "," + (MARGINS.bottom) + ")") 
      //     .call(d3.axisLeft(Y_SCALE1).ticks(10)) 
      //         .attr("font-size", '20px'); 
  
  
    });
  }

  build_scatter_plot()