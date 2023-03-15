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


function build_vis(){
  
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

build_vis();