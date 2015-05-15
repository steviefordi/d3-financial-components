---
layout: default
title: Gridlines
component: scale/gridlines.js
tags:
  - frontpage

example-code: |
  var gridlines = fc.scale.gridlines()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(gridlines);
---

This component renders horizontal and vertical gridlines. 

{% highlight javascript %}
{{ page.example-code }}
{% endhighlight %}

Which gives the following:

{% include exampleFixture.html %}

You can configure the number of ticks via the `xTicks` and `yTicks` properties.

