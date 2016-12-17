function goTo(id) {
	document.getElementById(id).scrollIntoView({behavior: 'smooth'});
}

function expand_handler(event, repo){
	var x = event.clientX - 25;
	var y = event.clientY - 25;
	console.log('x '+x+' y '+y);
	console.log(repo);
	var panel = document.createElement('div');
	panel.className = 'back-panel';
	panel.onclick = close_expand;
	document.body.appendChild(panel);
	var ncontainer = document.createElement('div');
	ncontainer.className = 'ncontainer';
		var expandable_container = document.createElement('div');
		expandable_container.className = 'expandable-container';
			var expandable = document.createElement('div');
			expandable.className = 'expandable';
			expandable.style.top = y+'px';
			expandable.style.left = x+'px';
			var progress = document.createElement('div');
			progress.className = 'progress indigo lighten-4';
			progress.innerHTML += '<div class="indeterminate indigo"></div>';
		expandable_container.appendChild(expandable);
		expandable_container.appendChild(progress);
	ncontainer.appendChild(expandable_container);
	document.body.appendChild(ncontainer);

	setTimeout(function(){
		expandable_container.style.visibility = 'visible'
		expandable_container.style.overflow = 'hidden';
		expandable.style.transform = 'scale(50)';
		panel.style.visibility = 'visible';
		panel.style.opacity = '0.2';
		setTimeout(function(){
			expandable_container.style.backgroundColor = '#fff'
		    expandable_container.style.overflowY = 'scroll';
		    expandable_container.style.overflowX = 'auto';
			expandable_container.style.boxShadow = '0 3px 3px rgba(0,0,0,0.3),0 1px 2px rgba(0,0,0,0.24)';
			expandable.style.zIndex = -1;
			$('.expandable').hide();
			progress.style.visibility = 'visible';
			var readme_uri = 'https://api.github.com/repos/hrily/'+repo+'/contents/README.md';
			$.ajax({
				url: readme_uri,
				headers: { 
					'Accept': 'application/vnd.github.html' },
				success: function(results) {
				    console.log("GOT");
				    console.log(results);
					$('.expandable-container .progress').remove();
				    expandable_container.innerHTML += '<div class="container">'+results+'</div>';
				    expandable_container.innerHTML += '<div class="fixed-action-btn"><a id="fab" class="btn-floating btn-large red waves-effect waves-light tooltipped" href="#!" onclick="close_expand()" data-tooltip="Close" data-position="left"><i id="plus" class="large material-icons">add</i></a><ul><li><a class="btn btn-floating red waves-effect waves-light tooltipped " href="https://github.com/Hrily/'+repo+'" data-tooltip="View on GitHub"><img src="images/logo_github_white.png"/>github</a></li><li><a class="btn-floating red waves-effect waves-light tooltipped" href="https://github.com/Hrily/'+repo+'/archive/master.zip" data-tooltip="Download"><i class="material-icons">file_download</i></a></li></ul></div>';
					$('.ncontainer .tooltipped').tooltip({delay: 50, position: 'left'});
				    if($(window).width()<=640){
				    	$('.fixed-action-btn').openFAB();
				    	$('#plus').css('transform', 'rotateZ(45deg) scale(1.3)');
				    }
			}});
		}, 500);
	}, 300);
};

function close_expand(){
	$('.ncontainer .tooltipped').tooltip('remove');
	$('.expandable-container .container').remove();
	$('.expandable-container .fixed-action-btn').remove();
	$('.expandable-container .progress').remove();
	$('.expandable').show();
	expandable_container = (document.getElementsByClassName('expandable-container'))[0];
	expandable = (expandable_container.getElementsByClassName('expandable'))[0];
	panel = (document.getElementsByClassName('back-panel'))[0];
	expandable_container.style.backgroundColor = '';
	expandable_container.style.boxShadow = '';
	expandable_container.style.overflow = 'hidden';
	expandable.style.zIndex = 20;
	expandable.style.transform = 'scale(1)';
	panel.style.opacity = '0';
	setTimeout(function(){$('.ncontainer').remove();$('.back-panel').remove()}, 500);
};

function show(){
	setTimeout(function(){
		$('.logo').css({'top': '260px', 'position': 'absolute'});
		$('.panel').css('height', '540px')
		$('nav').css('visibility', 'visible');
		$('body').css('backgroundColor', '#e9eaed');
		$('#menu-btn').css({'visibility': 'visible', 'opacity': '1'});
		$('.mcontainer').css({'visibility': 'visible', 'opacity': '1', 'margin-top': '0'});
		$('.personalization').css({'visibility': 'visible', 'opacity': '1', 'margin-top': '0'});
		$('.carousel-container').css({'visibility': 'visible', 'opacity': '1'});
		$('.design').css({'visibility': 'visible', 'opacity': '1'});
		$('.button-collapse').sideNav({closeOnClick: true, draggable: true});
		$('.carousel-container .carousel').carousel({dist: 0, padding: 400});
		$('.tooltipped').tooltip({delay: 50});
	}, 500);
}