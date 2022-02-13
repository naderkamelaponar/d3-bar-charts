var sW = 900,
  sH = 500;
var tt = d3
  .select(".svg")
  .append("div")
  .attr("id", "tooltip")
  .attr("class", "overlay")
  .style("opacity", 0);
var svg = d3
  .select(".svg")
  .append("svg")
  .attr("width", sW)
  .attr("height", sH)
  .attr("class", "bg-dark")
  .attr("class", "text-info");

d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"
).then((data) => {
  var minW = sW - sW / 1.1,
    maxW = sW / 1.1,
    minH = sH - sH / 1.05,
    maxH = sH / 1.2;
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", function () {
      return minW - maxW / 1.75;
    })
    .attr("y", function () {
      return minH * 1.1;
    })
    .text("Gross Domestic Product  Bilion $")
    .attr("class", "txt-danger h5");
  svg
    .append("text")
    .attr("x", minW * 1.1)
    .attr("y", maxH * 1.1)
    .text("Gross Domestic Product Years")
    .attr("class", "txt-danger h5");
  var dYears = data.data.map((a) => {
    return new Date(a[0]);
  });
  var xMax = new Date(d3.max(dYears));
  xMax.setMonth(xMax.getMonth() + 3);
  var xScale = d3
    .scaleTime()
    .domain([d3.min(dYears), xMax])
    .range([minW, maxW]);
  var xAxis = d3.axisBottom().scale(xScale);
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + maxH + ")");
  var gdp = data.data.map((a) => a[1]);
  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(gdp)])
    .range([maxH, 0]);
  var yAxis = d3.axisLeft().scale(yScale);
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + minW + ", 0)");
  var lineScale = d3
    .scaleLinear()
    .domain([0, d3.max(gdp)])
    .range([0, maxH]);
  var gdps = data.data.map((a) => {
    return lineScale(a[1]);
  });
  var quarters = data.data.map(function (i) {
    var q;
    var temp = i[0].substring(5, 7);
    if (temp === "01") {
      q = "Q1";
    } else if (temp === "04") {
      q = "Q2";
    } else if (temp === "07") {
      q = "Q3";
    } else if (temp === "10") {
      q = "Q4";
    }

    return i[0].substring(0, 4) + " " + q;
  });
  var ttScale = d3
    .scaleLinear()
    .domain([0, gdps.length - 1])
    .range([minW, maxW - sW / 4]);
  var bW = (maxW - minW) / gdps.length;
  svg
    .selectAll("rect")
    .data(gdps)
    .enter()
    .append("rect")
    .attr("data-gdp", (d, i) => {
      return gdp[i];
    })
    .attr("data-date", (d, i) => {
      return data.data[i][0];
    })
    .attr("class", "bar")
    .attr("x", (d, i) => {
      return xScale(dYears[i]);
    })
    .attr("y", (d) => maxH - d)
    .attr("height", (d) => d)
    .attr("width", bW)
    .attr("index", (d, i) => i)
    .on("mouseover", function (e) {
      var i = this.getAttribute("index");
      console.log(e);
      tt.transition().style("opacity", 0.9);
      tt.html(
        quarters[i] +
          "<br>" +
          "$" +
          data.data[i][1].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
          " Billion"
      )
        .attr("data-date", data.data[i][0])
        .attr("data-gdp", gdp[i])
        .style("left", ttScale(i) + "px")
        .style("transform", "translateY(150px)")
        .style("width", sW / 4 + "px");
    })
    .on("mouseout", function () {
      tt.transition().duration(100).style("opacity", 0);
    });
});
