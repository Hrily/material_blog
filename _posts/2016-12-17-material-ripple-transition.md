---
layout: post
title: "Material Ripple Transition"
description: "Material Ripple Transition using CSS and JS"
tags: ["HTML", "CSS", "JS", "Material Design"]
---

Hie,

I love [Material Design](material.io). It is the design language developed by Google which is based on principles of paper. The theme is flat, but real enough to visualize the depth.

<br>
<p class="image"><img src="{{ site.baseurl }}/images/material_design_paper.png"/></p>

<br>
There are couple of libraries which can be used to make Material Style Web Pages. Google has it's own [Material Design Lite](getmdl.io) library. But I personally like [Materialize CSS](materializecss.com), for no specific reason.

<br>
The only thing missing in these libraries is Animations. The animations in Material Design are more life-like. They start slow, speed up and decelerate gradually. The animation which I like the most is the Ripple Transition. Following are some examples:

<br>

<p align="center">
	<p align="center" style="position: relative; display: inline-block; height: 400px; width: 49% !important; overflow: hidden;">
		<img src="{{ site.baseurl }}/images/app_drawer_loop.gif" style="position: absolute; left: 50%; transform: translateX(-50%); height: 100% !important;">
	</p>
	<p align="center" style="position: relative; display: inline-block; height: 400px; width: 50% !important;">
		<img  src="{{ site.baseurl }}/images/calling_loop.gif" style="position: absolute; left: 50%; transform: translateX(-50%); height: 100% !important;">
	</p>
</p>

<br>
So, lets start making this using CSS and JS! 

If you look closely, the animation starts by circle popping at the point of touch. Then the circle expands and fills the whole container.

We will simulate the same. First we will define a container, with some bounds. Lets call it `expandable-container`.

{% highlight html %}
<div class="expandable-container"></div>
{% endhighlight %}

Let's define CSS for the `expandable-container`

{% highlight css %}
.expandable-container {
	position: relative;
	width: 400px;
	height: 200px;
	border-radius: 1px;
}
{% endhighlight %}

I have kept the `position: relative` which I'll expain later.

<br>
Now, lets define the CSS for the circle which will pop out. We'll call it `expandable`

{% highlight css %}
.expandable {
	display: inline-block;
	position: absolute;
	vertical-align: middle;
	width: 50px;
	height: 50px;
	border-radius: 50px;
	-webkit-transition: transform .4s ease-in-out;
	     -o-transition: transform .4s ease-in-out;
	        transition: transform .4s ease-in-out;
	background-color: #fff;
}
{% endhighlight %}

<br>
Now, using JS, we'll dynamically add a circle and expand it. Lets define a JS method to do this.

{% highlight javascript %}
function expand_handler(event){
	expandable_container = (document.getElementsByClassName('expandable-container'))[0];
	expandable_container.body.innerHTML += '<div class="expandable"></div>';
	expandable_container.style.overflow = 'hidden';
	expandable = (expandable_container.getElementsByClassName('expandable'))[0];
	var x = event.clientX;
	var y = event.clientY;
	x -= expandable.parentElement.offsetLeft;
	y -= expandable.parentElement.offsetTop;
	expandable.style.top = y-25+'px';
	expandable.style.left = x-25+'px';
	expandable.style.transform = 'scale(50)';
	setTimeout(function(){
		expandable_container.style.backgroundColor = '#fff'
		expandable_container.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12),0 1px 2px rgba(0,0,0,0.24)';
		expandable.style.zIndex = -1;
	}, 500);
};
{% endhighlight %}

Let us understand what's happening. 

<br>
First we added the circle to the container.

`expandable_container.body.innerHTML += '<div class="expandable"></div>';`

<br>
Then we applied `overflow: hidden` property to the container. Because, we want the circle to fill the container and not to cover it.

<br>
Then we set the position of circle where the mouse click happened. `event.clientX` and `event.clientY` will give the coordinates of click event.

Remember, we had kept `position: relative` for `expandable-container`, the reason is, we want the position of circle w.r.t. the expandable container. The quick hack to do this is to keep `position: relative` for parent element and to keep `position: absolute` for child.

But there's more to positioning, the positioning is done w.r.t. top left corner of the screen, but we are doing it w.r.t. top left corner of container. The coordinates we get from the click event are w.r.t. screen. To convert them w.r.t. container, we'll subtract the left and top margins of the container.

`x -= expandable.parentElement.offsetLeft;`

`y -= expandable.parentElement.offsetTop;`

<br>
Now we'll apply the coordinates to circle using CSS `top` and `left` property. We'll subtract `25` from each values because the circle is `50x50px`, so we'll have the center of circle on click position.

`expandable.style.top = y-25+'px';`

`expandable.style.left = x-25+'px';`

<br>
Now the real part, expanding the circle. Using CSS transform `scale()` method, we'll expand the circle to fill the container.

`expandable.style.transform = 'scale(50)';`

<br>
That's it, the animation is complete!

<br>
There is some post-processing done after the animation is complete, like changing background color of container same as circle, removing circle out of view, etc.

So, how to close the container. Pretty easy, just follow the steps for opening in reverse order. Following code snippet illustrates it:

{% highlight javascript %}
function close(){
	expandable_container = (document.getElementsByClassName('expandable-container'))[0];
	expandable = (expandable_container.getElementsByClassName('expandable'))[0];
	expandable_container.style.backgroundColor = '';
	expandable_container.style.boxShadow = '';
	expandable.style.zIndex = 20;
	expandable.style.transform = 'scale(1)';
	setTimeout(function(){
		expandable_container.removeChild(expandable_container);
	}, 500);
};
{% endhighlight %}

<br>
That's it, we're done here!

<br>
<a href="https://hrily.github.io/MaterialRippleTransition">
	<button class="btn pink waves-effect waves-light" name="action">View in Action
		<i class="material-icons right">visibility</i>
	</button>
</a>

<br>
<a href="https://github.com/Hrily/MaterialRippleTransition">
	<button class="btn pink waves-effect waves-light" name="action">View on Github
		<i class="material-icons right">send</i>
	</button>
</a>

<br>