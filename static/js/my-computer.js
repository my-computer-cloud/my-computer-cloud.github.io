
	const CLIENT_ID = '607735316688-0vmqpqnhvvjqk5uen9kpbcngd7q4u5co.apps.googleusercontent.com';
	const API_KEY = 'AIzaSyAOruhghgqwZJ3UFQOLNGoeOgE6xcR400M';

	// Sign In

	var userDiv = $('.Taskbar > a > div.name');

	userDiv.text('Sign In');

	userDiv.on('click', async function() {
		tokenClient.callback = async (resp) => {
		  if (resp.error !== undefined) {
			throw (resp);
		  }
		  $('#root > div > div.Menu').hide();
		  whoami();
		};
		await handleAuthClick();
		userDiv.on('click', function(){});
	});
	
	
	async function runScript(func, params) {
		const runRequest = {
			scriptId:	'AKfycbxAeQTg0vaMTlh_mCW4ThfuCD5UkD3Gk-XzbhOwY053-FTdcSmguqF9WrJUtrVuILuX-A',
			resource: { "function": func, "parameters" :  params}
		};
		response = await gapi.client.script.scripts.run(runRequest);
		return response;
	}
	
	async function whoami() {
		try {
		  let response = await runScript('whoami')
		  userDiv.text(response.result.response.result);
		} catch (err) {
		  console.log('error : ' + err.message);
		  return;
		}
	}
		
	// File Explore
	
	var list;

	$('.window-container').on('DOMNodeInserted', function(evt){
		if(evt.target.classList.contains('FinderWindow')){
			$(event.target).find('.panel')[0].remove();
			$(event.target).find('.panel')[0].remove();
			$(event.target).find('.panel')[0].remove();

			list = $(event.target).find('.panel .list');
			list.on('click', function() {
				exploreFolder(event.target.id);
			});
			
			exploreFolder();
			
		}
	});
	
	async function exploreFolder(id) {
		try {
	
			list.empty();

			let response = await runScript('exploreFolder', [id])			
			var items = response.result.response.result;
			
			for(i=0; i < items.length; i++ ) {
				var item = items[i];
				
				var bg
				if(item.mimeType == 'application/vnd.google-apps.folder' ) {
					bg = '/static/media/finder.c696b25a.png';
				} else {
					bg = '/static/media/resume.4a72917d.png';
				}
				
				list.append($('<div class="dir" id="'+item.id+'"><div class="Icon icon" style="background-image: url(&quot;'+ bg +'&quot;);"></div><div class="name" id="'+item.id+'">' + item.title + '</div></div>'));

			}

		} catch (err) {
		  console.log('error : ' + err.message);
		  return;
		}
	}
	
	// Web Browser
	
	$('.window-container').on('DOMNodeInserted', function(evt){
		if(evt.target.classList.contains('BrowserWindow')) {
			
			$('.link-external').remove();
			$('.button-refresh').remove();
			
			var urlDiv = $(event.target).find('.url');
			var urlText = $('<input class="url"></input>');
			$(urlDiv).replaceWith(urlText);
			
			urlText.on('change', async function(){
				browse(event.target.value);
			});
			urlText.on('keyup', async function(){
				if(event.key == 'Enter'){
					browse(event.target.value);
				}
			});
		}
	});
	
	async function browse(url) {
		$('.iframe').attr('srcdoc', '');
		try {
			let response = await runScript('browse', [url]);
			var content = response.result.response.result;
			$('.iframe').attr('srcdoc', content);
		} catch (err) {
		  console.log('error : ' + err.message);
		  return;
		}
	}

	// Menu

	$('.Screen').on('DOMNodeInserted', function(evt){
		if(evt.target.classList.contains('Menu')){
			$(event.target).hide();
		}
	});

	// Miscs / Links

	$('.forkme').remove();
	$('.app-container a')[5].remove(); // Insta
	$('.app-container a')[5].remove(); // Paypal
	$('.app-container a')[6].remove(); // Resume
	$('.app-container a')[7].remove(); // Versions
	
	$($('.app-container a')[5]).attr('href', 'https://github.com/vinodpahuja'); // GitHub
	
	$($('.app-container a')[6]).attr('href', '#/browser'); // Browser
	$($('.app-container a')[6]).attr('target', ''); // Browser
	$($('.app-container .Icon')[6]).attr('style', 'background-image: url("/static/media/browser.85c4af4e.png");'); 
	$($('.app-container a .name')[6]).text('Browser');
	
	$('.shortcut-container a')[2].remove(); // Insta
	$('.shortcut-container a')[2].remove(); // Paypal
	$('.shortcut-container a')[2].remove(); // Versions
	$('.shortcut-container a')[2].remove(); // Attributations
	
	$('.shortcut-container a').addClass('pinned'); // Browser