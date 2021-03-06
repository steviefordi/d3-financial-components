(function(d3, fc) {
    'use strict';

    var data = fc.dataGenerator().startDate(new Date(2014, 1, 1))(50);
    data.crosshairs = [];

    var width = 600, height = 250;

    var container = d3.select('#crosshairs')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Calculate the scale domain
    var day = 8.64e7, // One day in milliseconds
        dateFrom = new Date(d3.min(data, function(d) { return d.date; }).getTime() - day),
        dateTo = new Date(d3.max(data, function(d) { return d.date; }).getTime() + day),
        priceFrom = d3.min(data, function(d) { return d.low; }),
        priceTo = d3.max(data, function(d) { return d.high; });

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .discontinuityProvider(fc.scale.discontinuity.skipWeekends())
        .domain([dateFrom, dateTo])
        .range([0, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain([priceFrom, priceTo])
        .range([height, 0])
        .nice();

    var color = d3.scale.category10();

    // Create the bar series
    var bar = fc.series.bar()
        .xScale(dateScale)
        .yScale(priceScale)
        .yValue(function(d) { return d.close; })
        .decorate(function(sel) {
            sel.style('fill', function(d) { return color(d.date.getDay()); });
        })
        .barWidth(9);

    // Create a crosshairs tool
    var crosshairs = fc.tools.crosshairs()
        .xScale(dateScale)
        .yScale(priceScale)
        .snap(fc.utilities.seriesPointSnap(bar, data))
        .xLabel(function(d) { return d.datum && d3.time.format('%a, %e %b')(d.datum.date); })
        .yLabel(function(d) { return d.datum && d3.format('.2f')(d.datum.close); })
        .padding(8)
        .decorate(function(selection) {
            selection.enter()
                .append('rect')
                .attr('class', 'example')
                .attr('width', 50)
                .attr('height', 50)
                .style('opacity', 0.5);
            selection.select('rect.example')
                .attr('x', function(d) { return d.x - 25; })
                .attr('y', function(d) { return d.y - 25; })
                .style('fill', function(d) { return color(d.datum ? d.datum.date.getDay() : 0); });
        });

    // Add it to the chart
    var multi = fc.series.multi()
        .xScale(dateScale)
        .yScale(priceScale)
        .series([bar, crosshairs])
        .mapping(function(data, series) {
            switch (series) {
                case bar:
                    return data;
                case crosshairs:
                    return data.crosshairs;
            }
        });

    container.datum(data)
        .call(multi);

})(d3, fc);
