var MCBookmarklet = (function(){

    var dependencyState = 0;
    var ContentRoot = "http://localhost:3000";
    
    var waiter, numTries = 0;
    var setup = function() {
      
      loadDependencies();
      if (checkDependencies()) {
        clearInterval(waiter);
        showDialog();
      } else {
        loadDependencies(); 
        waiter = setInterval(setupLoop, 500);
      }
    }
    
    var setupLoop = function() {
      if (checkDependencies()) {
        clearInterval(waiter);
        showDialog();
      } else {
        loadDependencies(); 
        numTries++;
      }
    };
    
    var checkDependencies = function() {
      return (typeof(jQuery) != "undefined") && (typeof(jQuery.ui) != "undefined");
    
    }
    
    var loadDependencies = function() {
      if (dependencyState == 0) {
        // Add CSS
        var l = document.createElement('link');
        l.type = 'text/css'
        l.rel = 'stylesheet';
        l.href = ContentRoot+'/stylesheets/jquery-ui-1.8.14.custom.css';
        document.getElementsByTagName('head')[0].appendChild(l);
        
        // Add jQuery
        createScript('https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js');
        dependencyState = 1;
      }
      if (jQuery().jquery == "1.6.2" && dependencyState < 2) {
        createScript('https://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js');
        dependencyState = 2;
      }
            
    };
    
    var createScript = function(url) {
      var script = document.createElement('script');
      script.type = "text/javascript";
      script.async = true;
      script.src = url;
      var s = document.getElementsByTagName("script")[0]; s.parentNode.appendChild(script);
      return script;
    };
    
    var showDialog = function() {
      var body = document.body;
      var div = document.createElement('div');
      
      
      var f_id = "Wishpot.BM.Form";
    	var d_id = "WishpotDialog";
    	
    	
    	div.setAttribute("id", d_id);
    	div.setAttribute("style", "padding: 0;");
    	
    	var jQ = jQuery.noConflict();
    	
    	//the content of the dialog box - post to "default.aspx" to workaround integrated mode iis bug.
    	var s = [
    	   "<iframe style=\"width:100%; height:500px; margin:0px; padding:0px; border: 0px;\" src=\"about:blank\" id=\"Wishpot.BM.Frame\" name=\"Wishpot.BM.Frame\" frameBorder=\"0\"></iframe>",
          "<div style=\"display:none; position:absolute; visibility:hidden;\"><form id=\"",f_id,"\" name=\"",f_id,"\" target=\"Wishpot.BM.Frame\"",
          " method=\"post\" action=\"",ContentRoot,"/bookmarklet/frame",
          "\"></form></div>"].join('');
      div.innerHTML = s;
      body.appendChild(div);
      
      try{
          jQ("#"+d_id).dialog({
  			    title: 'my title',
  			    width: 655,
  			    modal: true,
  			    zIndex: 10000000, //goes up to 2147483647, but opera/safari don't like it
  			    overlay: {
  				    backgroundColor: '#000',
  				    opacity: 0.5
  			    }
  		    });
          var dialogTitle = document.getElementById("ui-dialog-title-"+d_id);
          if(null == dialogTitle || (typeof(dialogTitle) == "undefined"))
          {
            //hide the div we did create
            jQ("#"+d_id).css("display", "none");
            throw("No dialog created.  Titlebar not found.");
          }
      }catch(e){
          document.getElementById(f_id).setAttribute("target", "_blank");
      }
      
      jQ("#"+d_id).dialog("open");
      
      
            
      var form = document.getElementById(f_id);
      form.submit(); 
    
    };
    
    setup();
    /*
         
    */
    //this.Dialog = this.WPJQ("#"+d_id);
          
    /*if (document.domain == "localhost" || document.domain == "radiant-light-454.heroku.com") {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = document.location.origin + "/users/confirm_bookmarklet"
        var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(script, s);
        
    } else {
        window.alert(['Price: ', getPrice(), '\n', 'Title: ', getTitle(), '\n', 'Image: ', getGenericImageData()[0].src].join('\n'));
        var ga = document.createElement("script");
        ga.type = "text/javascript";
        ga.async = true;
        var base = "http://localhost:3000/wishlists/1/products/new";
        var qs = "?title="+encodeURIComponent(getTitle())+"&image="+encodeURIComponent(getGenericImageData()[0].src)+"&price="+encodeURIComponent(getPrice())+"&url="+encodeURIComponent(window.location.href);
        ga.src = base + qs;
        var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ga, s);
    }*/
})();