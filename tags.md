---
layout: default
title: Tags
---

<h2>Tags</h2>
{% for tag in site.tags %}
  {% assign t = tag | first %}
  {% assign posts = tag | last %}
<ul class="tag-post-list" id="{{ t | downcase }}">
<a class="tag pink-text" href="#{{ t | downcase }}"><b>{{ t }}</b></a>
{% for post in posts %}
  {% if post.tags contains t %}
  <li class="row">
    <span class= "col s12 m8 l8"><a href="{{ site.baseurl }}{{ post.url }}"><h5>{{ post.title }}</h5></a></span>
    <span class="post-meta col s12 m4 l4">{{ post.date | date: "%B %-d, %Y"  }}</span>
  </li>
  {% endif %}
{% endfor %}
</ul>
{% endfor %}