// set frames and dimensions
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;

const LINEFRAME_WIDTH = 1000;

const MARGINS = {
  left: 50,
  right: 50,
  top: 50,
  bottom: 50
};

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

const filters = document.getElementById("filterTable");

function display_rows() {

  // reset graph if new points are being added
  document.getElementById("spsvg").innerHTML = '';
  d3.csv("DONE.csv").then((data) => {

    print_len = 10

    for (let i = 0; i < print_len; i++) {

    }
  });
}
display_rows();

let selectedPG = false;
let selectedPG13 = false;
let selectedR = false;
let selectedTV14 = false;
let selectedTVMA = false;
let selectedTVPG = false;

function togglePG() {
  selectedPG = !selectedPG;
  build_line_plot();
}

function togglePG13() {
  selectedPG13 = !selectedPG13;
  build_line_plot();
}

function toggleR() {
  selectedR = !selectedR;
  build_line_plot();
}

function toggleTV14() {
  selectedTV14 = !selectedTV14;
  build_line_plot();
}

function toggleTVMA() {
  selectedTVMA = !selectedTVMA;
  build_line_plot();
}

function toggleTVPG() {
  selectedTVPG = !selectedTVPG;
  build_line_plot();
}

function build_line_plot(addpoints, newdata) {

  d3.csv("line.csv").then((data) => {
    // Filter data to include only user-selected ratings
    let selected_ratings = [];
    if (selectedPG) {
      selected_ratings.push('PG');
    }
    if (selectedPG13) {
      selected_ratings.push('PG-13');
    }
    if (selectedR) {
      selected_ratings.push('R');
    }
    if (selectedTV14) {
      selected_ratings.push('TV-14');
    }
    if (selectedTVMA) {
      selected_ratings.push('TV-MA');
    }
    if (selectedTVPG) {
      selected_ratings.push('TV-PG');
    }

    // filter the data based on the selected ratings
    const filtered_data = data.filter(d => selected_ratings.includes(d.rating));

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
        .style("top", (d3.pointer(event)[1] + 1300) + "px");
    }

    // mouseleave makes tooltip transparent when outside a bar.
    let mouseleave = function(d) {
      Tooltip
        .style("opacity", 0);
    }

    const grouped = d3.group(filtered_data, d => d.rating);

    // Add X axis --> it is a date format
    const x_scale = d3.scaleLinear()
      .domain(d3.extent(filtered_data, function(d) {
        return d.release_year;
      }))
      .range([MARGINS.left, LINEVIS_WIDTH]);
    FRAME1.append("g")
      .attr("transform", "translate(" + 0 +
        "," + (VIS_HEIGHT + MARGINS.bottom) + ")")
      .call(d3.axisBottom(x_scale).ticks(10))
      .call(d3.axisBottom(x_scale).ticks(10).tickFormat(d3.format("d"))); /// CHANGE

    // Add Y axis
    const y_scale = d3.scaleLinear()
      .domain([0, 150]) // fix this
      .range([VIS_HEIGHT + MARGINS.top, 0]);
    FRAME1.append("g").attr("transform", "translate(" + MARGINS.left +
        "," + (0) + ")")
      .call(d3.axisLeft(y_scale));

    const range = [];
    const domain = [];
    if (selectedPG) {
      range.push('#e41a1c');
      domain.push('PG');
    }
    if (selectedPG13) {
      range.push('#377eb8');
      domain.push('PG-13');
    }
    if (selectedR) {
      range.push('#4daf4a');
      domain.push('R');
    }
    if (selectedTV14) {
      range.push('#984ea3');
      domain.push('TV-14');
    }
    if (selectedTVMA) {
      range.push('#ff7f00');
      domain.push('TV-MA');
    }
    if (selectedTVPG) {
      range.push('grey');
      domain.push('TV-PG');
    }

    // color palette
    const color = d3.scaleOrdinal()
      .range(range)
      .domain(domain);

    // Draw the line
    let scatter = FRAME1.selectAll(".line")
      .data(grouped)
      .join("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", function(d) {
        return color(d[0])
      })
      .attr("stroke-width", 1.5)
      .attr("d", function(d) {
        return d3.line()
          .x(function(d) {
            return x_scale(d.release_year);
          })
          .y(function(d) {
            return y_scale(+d.Count);
          })
          (d[1])
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);


    //Create Title
    FRAME1.append("text")
      .attr("x", LINEVIS_WIDTH / 2)
      .attr("y", 20)
      .style("text-anchor", "middle");

    //Create X axis label
    let xAxis = FRAME1.append("text")
      .attr("x", LINEVIS_WIDTH / 2)
      .attr("y", y_scale(0) + 40)
      .style("text-anchor", "middle")
      .text("Year of Release");

    //Create Y axis label
    let yAxis = FRAME1.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 20)
      .attr("x", -200)
      .style("text-anchor", "middle")
      .text("Number of Releases");

    // legend
    FRAME1.append("circle").attr("cx", 100).attr("cy", 40).attr("r", 6).style("fill", "#e41a1c");
    FRAME1.append("text").attr("x", 120).attr("y", 40).text("PG").style("font-size", "15px").attr("alignment-baseline", "middle");

    FRAME1.append("circle").attr("cx", 100).attr("cy", 60).attr("r", 6).style("fill", "#377eb8");
    FRAME1.append("text").attr("x", 120).attr("y", 60).text("PG-13").style("font-size", "15px").attr("alignment-baseline", "middle");

    FRAME1.append("circle").attr("cx", 100).attr("cy", 80).attr("r", 6).style("fill", "#4daf4a");
    FRAME1.append("text").attr("x", 120).attr("y", 80).text("R").style("font-size", "15px").attr("alignment-baseline", "middle");

    FRAME1.append("circle").attr("cx", 100).attr("cy", 100).attr("r", 6).style("fill", "#984ea3");
    FRAME1.append("text").attr("x", 120).attr("y", 100).text("TV-14").style("font-size", "15px").attr("alignment-baseline", "middle");

    FRAME1.append("circle").attr("cx", 100).attr("cy", 120).attr("r", 6).style("fill", "#ff7f00");
    FRAME1.append("text").attr("x", 120).attr("y", 120).text("TV-MA").style("font-size", "15px").attr("alignment-baseline", "middle");

    FRAME1.append("circle").attr("cx", 100).attr("cy", 140).attr("r", 6).style("fill", "grey");
    FRAME1.append("text").attr("x", 120).attr("y", 140).text("TV-PG").style("font-size", "15px").attr("alignment-baseline", "middle");

  });

}

build_line_plot();

function produce_tickets(rating) {
  //build frame for bar chart
  const FRAME2 = d3.select("#vis2")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");



  d3.csv("DONE.csv").then(function(data) {

    const X_SCALE3 = d3.scaleBand()
      .domain(data.map((d) => {
        return d.rating
      }))
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

    //r set up tickets with complexity scores being able to be clicked
    switch (rating) {
      case "G": {
        document.getElementById("G-score").style.display = "block";
        document.getElementById("G-score-value").innerHTML = mean_complexity_scores['G'];
        document.getElementById("button").style.display = "block";
        break;
      }
      case "PG": {
        document.getElementById("PG-score").style.display = "block";
        document.getElementById("PG-score-value").innerHTML = mean_complexity_scores['PG'];
        document.getElementById("button").style.display = "block";
        break;
      }
      case "PG-13": {
        document.getElementById("PG-13-score").style.display = "block";
        document.getElementById("PG-13-score-value").innerHTML = mean_complexity_scores['PG-13'];
        document.getElementById("button").style.display = "block";
        break;
      }
      case "R": {
        document.getElementById("R-score").style.display = "block";
        document.getElementById("R-score-value").innerHTML = mean_complexity_scores['R'];
        document.getElementById("button").style.display = "block";
        break;
      }
      case "NR": {
        document.getElementById("NR-score").style.display = "block";
        document.getElementById("button").style.display = "block";
        document.getElementById("NR-score-value").innerHTML = mean_complexity_scores['NR'];
        break;
      }
      default: {
        document.getElementById("G-score").style.display = "none";
        document.getElementById("PG-score").style.display = "none";
        document.getElementById("PG-13-score").style.display = "none";
        document.getElementById("R-score").style.display = "none";
        document.getElementById("NR-score").style.display = "none";
        document.getElementById("button").style.display = "none";
      }

    }

  });

}

// create frames
const FRAME_8 = d3.select("#vis4")
  .append("svg")
  .attr("height", FRAME_HEIGHT)
  .attr("width", FRAME_WIDTH + 200)
  .attr("id", "spsvg")
  .attr("class", "frame");


const FRAME_9 = d3.select("#vis5")
  .append("svg")
  .attr("height", FRAME_HEIGHT)
  .attr("width", FRAME_WIDTH)
  .attr("id", "spsvg")
  .attr("class", "frame");

// load in CSV
d3.csv("DONE.csv").then((data) => {


  // setting maxes, vizualizations, and scalings
  const MAX_Y_BAR = 130;

  const X_SCALE3 = d3.scaleBand()
    .domain(data.map((d) => {
      return d.rating
    }))
    .range([0, VIS_WIDTH]);


  const Y_SCALE3 = d3.scaleLinear()
    .domain([0, MAX_Y_BAR + 10])
    //take height as first parameter as coordinates start from top left
    .range([VIS_HEIGHT, 0]);

  // get max x and y values
  const MAX_X = d3.max(data, d => {
    return parseInt(d.duration)
  });
  const MAX_Y = d3.max(data, d => {
    return parseInt(d.complexity)
  });
  // scaling functions
  const X_SCALE = d3.scaleLinear()
    .domain([0, (MAX_X + 1.0)])
    .range([0, VIS_WIDTH + 200]);


  const Y_SCALE = d3.scaleLinear()
    .domain([0, (MAX_Y + 1.0)])
    .range([(VIS_HEIGHT), 0]);


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
      .html("Movie Count: " + d.rat_counts + "\n" + "Average Duration: " + d.avg_dur)
      .style("left", (d3.pointer(event)[0] + 500) + "px")
      .style("top", (d3.pointer(event)[1] + 1800) + "px");
  }

  // mouseleave makes tooltip transparent when outside a bar.
  let mouseleave_bar = function(d) {
    Tooltip_bar
      .style("opacity", 0);
  }

  // plot scatterplot
  let mycirc1 = FRAME_8.selectAll(".point")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => {
      return X_SCALE(parseFloat(d.duration))
    })
    .attr("cy", d => {
      return Y_SCALE(parseFloat(d.complexity)) + MARGINS.top
    })
    .attr("r", 5)
    .attr("class", "point")
    .attr("opacity", .75)
    .attr("fill", function(d) {
      if (d.rating === "G") {
        return "pink"
      } else if (d.rating === "PG") {
        return "darkorange"
      } else if (d.rating === "PG-13") {
        return "lightgreen"
      } else if (d.rating === "R") {
        return "gold"
      } else {
        return "silver"
      }


    })

    .attr("id", d => {
      return d.rating
    });



  // plot bar plot
  let mybar = FRAME_9.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => {
      return (X_SCALE3(d.rating) + MARGINS.left)
    })
    .attr("y", (d) => {
      return Y_SCALE3(d.avg_dur) + MARGINS.top
    })
    .attr("width", X_SCALE3.bandwidth() - 5)
    .attr("height", (d) => {
      return VIS_HEIGHT - Y_SCALE3(d.avg_dur)
    })
    .attr("id", d => {
      return d.rating
    })
    .on("mouseover", mouseover_bar)
    .on("mousemove", mousemove_bar)
    .on("mouseleave", mouseleave_bar)
    .on("click", mouseClickEvent)
    .attr("fill", function(d) {
      if (d.rating === "G") {
        return "pink"
      } else if (d.rating === "PG") {
        return "darkorange"
      } else if (d.rating === "PG-13") {
        return "lightgreen"
      } else if (d.rating === "R") {
        return "gold"
      } else {
        return "silver"
      }


    });

  // axes and texts
  FRAME_8.append("g")
    .attr("transform", "translate(" +
      MARGINS.left + "," + (MARGINS.top + VIS_HEIGHT) + ")")
    .call(d3.axisBottom(X_SCALE).ticks(8));

  FRAME_8.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20)
    .attr("x", -300)
    .style("fill", "black")
    .text("Complexity");


  FRAME_8.append("text")
    .attr("x", (VIS_WIDTH / 2) + 150)
    .attr("y", X_SCALE(0) + 490)
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("Duration (Minutes)");

  FRAME_8.append("g")
    .attr("transform", "translate(" +
      MARGINS.left + "," + (MARGINS.top) + ")")
    .call(d3.axisLeft(Y_SCALE).ticks(15));

  FRAME_8.append("text")
    .attr("x", LINEVIS_WIDTH / 3)
    .attr("y", 30)
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("Complexity and Duration for All Movies");


  FRAME_8.call(d3.brush()
    .extent([
      [0, 0],
      [FRAME_WIDTH + 200, FRAME_HEIGHT]
    ])
    .on("start brush", updateChart)
  )

  FRAME_9.append("g")
    .attr("transform", "translate(" +
      MARGINS.left + "," + (MARGINS.top + VIS_HEIGHT) + ")")
    .call(d3.axisBottom(X_SCALE3).ticks(10));

  //Create Y axis label
  FRAME_9.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20)
    .attr("x", -300)
    .text("Duration (Minutes)");

  // create y-axis
  FRAME_9.append("g")
    .attr("transform", "translate(" +
      MARGINS.left + "," + (MARGINS.top) + ")")
    .call(d3.axisLeft(Y_SCALE3));

  FRAME_9.append("text")
    .attr("x", VIS_WIDTH / 2)
    .attr("y", Y_SCALE3(0) + 90)
    .style("text-anchor", "middle")
    .text("Rating");

  FRAME_9.append("text")
    .attr("x", LINEVIS_WIDTH / 3)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .text("Average Duration for Each Rating");



  // brushing function
  function updateChart(event) {
    const extent = event.selection;
    // change the class of each point or bar if corresponding was brushed
    mycirc1.classed("selected", function(d) {
      return isBrushed(extent,
        (X_SCALE(d.duration)), (Y_SCALE(d.complexity) + MARGINS.top))
    })
    mybar.classed("selected", function(d) {
      return isBrushed(extent,
        (X_SCALE(d.duration) + MARGINS.left), (Y_SCALE(d.complexity) + MARGINS.top))
    })


    // brushing function, returns true or false if point is in selection area
    function isBrushed(brush_coords, cx, cy) {

      var x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1
    }; // returns TRUE or FALSE


  };
});

// Legends for linked bar chart and scatter plot
FRAME_8.append("circle").attr("cx", 80).attr("cy", 40).attr("r", 6).style("fill", "pink");
FRAME_8.append("text").attr("x", 100).attr("y", 40).text("G").style("font-size", "15px").attr("alignment-baseline", "middle").attr("fill", "black");

FRAME_8.append("circle").attr("cx", 80).attr("cy", 60).attr("r", 6).style("fill", "darkorange");
FRAME_8.append("text").attr("x", 100).attr("y", 60).text("PG").style("font-size", "15px").attr("alignment-baseline", "middle").attr("fill", "black");

FRAME_8.append("circle").attr("cx", 80).attr("cy", 80).attr("r", 6).style("fill", "lightgreen");
FRAME_8.append("text").attr("x", 100).attr("y", 80).text("PG-13").style("font-size", "15px").attr("alignment-baseline", "middle").attr("fill", "black");

FRAME_8.append("circle").attr("cx", 80).attr("cy", 100).attr("r", 6).style("fill", "gold");
FRAME_8.append("text").attr("x", 100).attr("y", 100).text("R").style("font-size", "15px").attr("alignment-baseline", "middle").attr("fill", "black");

FRAME_8.append("circle").attr("cx", 80).attr("cy", 120).attr("r", 6).style("fill", "silver");
FRAME_8.append("text").attr("x", 100).attr("y", 120).text("NR").style("font-size", "15px").attr("alignment-baseline", "middle").attr("fill", "black");

FRAME_9.append("circle").attr("cx", 80).attr("cy", 40).attr("r", 6).style("fill", "pink");
FRAME_9.append("text").attr("x", 100).attr("y", 40).text("G").style("font-size", "15px").attr("alignment-baseline", "middle").attr("fill", "black");

FRAME_9.append("circle").attr("cx", 80).attr("cy", 60).attr("r", 6).style("fill", "darkorange");
FRAME_9.append("text").attr("x", 100).attr("y", 60).text("PG").style("font-size", "15px").attr("alignment-baseline", "middle").attr("fill", "black");

FRAME_9.append("circle").attr("cx", 80).attr("cy", 80).attr("r", 6).style("fill", "lightgreen");
FRAME_9.append("text").attr("x", 100).attr("y", 80).text("PG-13").style("font-size", "15px").attr("alignment-baseline", "middle").attr("fill", "black");

FRAME_9.append("circle").attr("cx", 80).attr("cy", 100).attr("r", 6).style("fill", "gold");
FRAME_9.append("text").attr("x", 100).attr("y", 100).text("R").style("font-size", "15px").attr("alignment-baseline", "middle").attr("fill", "black");

FRAME_9.append("circle").attr("cx", 80).attr("cy", 120).attr("r", 6).style("fill", "silver");
FRAME_9.append("text").attr("x", 100).attr("y", 120).text("NR").style("font-size", "15px").attr("alignment-baseline", "middle").attr("fill", "black");


// clicks for creating tickets based on rating selected.
let hasBeenClickedG, hasBeenClickedPG, hasBeenClickedPG13, hasBeenClickedR, hasBeenClickedNR = false;

function mouseClickEvent(event, d) {
  switch (d.rating) {
    case "G":
      if (!hasBeenClickedG) {
        hasBeenClickedG = true;
        produce_tickets(d.rating);
      }
      break;
    case "PG":
      if (!hasBeenClickedPG) {
        hasBeenClickedPG = true;
        produce_tickets(d.rating);
      }
      break;
    case "PG-13":
      if (!hasBeenClickedPG13) {
        hasBeenClickedPG13 = true;
        produce_tickets(d.rating);
      }
      break;
    case "R":
      if (!hasBeenClickedR) {
        hasBeenClickedR = true;
        produce_tickets(d.rating);
      }
      break;
    case "NR":
      if (!hasBeenClickedNR) {
        hasBeenClickedNR = true;
        produce_tickets(d.rating);
      }
      break;
    default:
  }
}

function refreshClick() {
  hasBeenClickedG = false;
  hasBeenClickedPG = false;
  hasBeenClickedPG13 = false;
  hasBeenClickedR = false;
  hasBeenClickedNR = false;
  produce_tickets();
}