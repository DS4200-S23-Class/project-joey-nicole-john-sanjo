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
  d3.csv("finished.csv").then((data) => {

    print_len = 10

    for (let i=0; i< print_len; i++)
    {
      console.log(data[i]);
    }
  });
}

function build_scatter_plot(addpoints, newdata) {

    d3.csv("data/scatter-data.csv").then((data) => {
  
      // fix new points into data if they were passed.
      if (addpoints){data=newdata;}
  
      // highlight point
      let mouseover = function(event, d) {
        d3.select(this)
            .style("fill", "orange");
      }
  
      // changes text to last point, and sets border depending on whether or not it is already present
      let mousedown = function(e, d) {
        if (e.target.getAttribute('stroke')==='black') {
          e.target
              .setAttribute("stroke", "none");
        }else {
          e.target
              .setAttribute("stroke", "black");
        }
        document.getElementById('point').textContent = `Last clicked point.. (${d['x']},${d['y']})`;
      }
  
      // resets point back to original color
      let mouseleave = function(event, d) {
        d3.select(this)
            .style("fill", "rgb(177, 41, 177)");
      }
      // find max X from the data 
      const MAX_X1 = d3.max(data, (d) => { return parseInt(d.x); });
      
      // Creates the scale function using data
      const X_SCALE1 = d3.scaleLinear() 
                        .domain([0, (MAX_X1)]) 
                        .range([0, VIS_WIDTH]); 
  
      // find max Y from the data 
      const MAX_Y1 = d3.max(data, (d) => { return parseInt(d.y); })
                        
      // Creates the scale function using data
      const Y_SCALE1 = d3.scaleLinear() 
                          .domain([0, MAX_Y1]) 
                          .range([VIS_HEIGHT, 0]); 
      
      // Plot Points using the X scale created above
      FRAME1.selectAll("points")  
          .data(data)  
          .enter()       
          .append("circle")  
            .attr("cx", (d) => { return (X_SCALE1(d.x) + MARGINS.left); }) 
            .attr("cy", (d) => { return (Y_SCALE1(d.y) + MARGINS.left); }) 
            .attr("r", 8)
            .attr("class", "point")
            .on("mouseover", mouseover)
            .on("mousedown", mousedown)
            .on("mouseleave", mouseleave);
  
      // Adds an X axis to the scatter plot
      FRAME1.append("g") 
            .attr("transform", "translate(" + MARGINS.left + 
                  "," + (VIS_HEIGHT + MARGINS.top) + ")") 
            .call(d3.axisBottom(X_SCALE1).ticks(10)) 
              .attr("font-size", '20px'); 
  
      // Adds a Y axis to the scatter plot
      FRAME1.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
              "," + (MARGINS.bottom) + ")") 
          .call(d3.axisLeft(Y_SCALE1).ticks(10)) 
              .attr("font-size", '20px'); 
  
  
    });
  }