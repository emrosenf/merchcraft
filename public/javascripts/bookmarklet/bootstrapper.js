var MCBookmarklet = (function(){

    var dependencyState = 0;
    var ContentRoot = "http://dev.dev:3000";
    
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
      if (typeof(jQuery) != "undefined" && jQuery().jquery == "1.6.2" && dependencyState < 2) {
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
  			    },
  			    resizable: false
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
      
      addInput(form, 'price', getPrice());
      addInput(form, 'title', getTitle());
      addInput(form, 'url', document.location.href);
      
      var images = getGenericImageData();
      for (var i = 0; i < images.length; i++) {
        addInput(form, 'images[]', images[i].src);
      }
      
      form.submit(); 
    
    };
    
    var addInput = function(el, key, val) {
      var i = document.createElement('input');
      i.setAttribute('type', 'hidden');
      i.setAttribute('name', key);
      i.setAttribute('value', val);
      el.appendChild(i);
    };
    
    
    var getTitle = function() {
      var title = window.document.title;
        
      
      s = title.split(' - ');
      title = s[0];
      if (s.length > 1) {
        if (s[0].indexOf(".com") > 0) {
            title = s[1];
        }
      }
      s = title.split(' | ');
      title = s[0];
      if (s.length > 1) {
        if (s[0].indexOf(".com") > 0) {
            title = s[1];
        }
      }
      
      if (title[title.length-1] == ')') {
        idx = title.lastIndexOf('(');
        if (idx > 0) {
            title = title.substr(0,idx-1);
        }
      }
      if(document.domain.match(/amazon\.com/)){
        var titleParts = title.split(':');
        if(titleParts[1]){
          title = titleParts[1];
        }
      }
      
      title = title.replace(/\s+/g,' ');
      title = title.replace(/^\s*|\s*$/g,'');
      
      return title;
    };

    var getGenericImageData = function(includeSrc) {
          var imgs = document.getElementsByTagName('img');
          var imageArray = [];
          for (var i=0;i<imgs.length;i++) {
            var pixelCount = imgs[i].height * imgs[i].width;
            var squareness = 1;
            if (imgs[i].id && imgs[i].id == '__uwl_img_copy__'){
               continue;
            }
            if (imgs[i].id && imgs[i].id == 'uwl_logo'){
               continue;
            }
            if (imgs[i].height > imgs[i].width && imgs[i].height > 0) {
              squareness = imgs[i].width / imgs[i].height;
            } else if (imgs[i].width > imgs[i].height && imgs[i].width > 0) {
              squareness = imgs[i].height / imgs[i].width;
            }
    
            if (pixelCount > 1000 && squareness > 0.5 
                || (includeSrc && imgs[i].src == includeSrc)) {
              var imageIndex = imageArray.length;
              imageArray[imageIndex] = {};
              imageArray[imageIndex].src = imgs[i].src;
              imageArray[imageIndex].height = imgs[i].height;
              imageArray[imageIndex].width = imgs[i].width;
            }
          }
    
          var sortFunc = function(a,b) {
            if(includeSrc) {
              if (a.src == includeSrc && b.src != includeSrc) {
                return -1;
              }
              if(a.src != includeSrc && b.src == includeSrc) {
                return 1 ;
              }
            }
            return (b.height*b.width) - (a.height*a.width);
          };
    
          imageArray.sort(sortFunc);
          return imageArray;
    };
    

    /* consider using element.innerText, see:
    *   http://www.newegg.com/Product/Product.aspx?Item=N82E16822136471&cm_sp=ProductSpotlight-_-22-136-471-_-07212011
    */
    var getPrice = function() {
        var startTime = new Date().getTime();
        var nodes = [];
        var nonZeroRe = /[1-9]/;
        var priceFormatRe = /((?:\$|USD|\&pound\;|\&\#163\;|\&\#xa3\;|\u00A3|\&yen\;|\uFFE5|\&\#165\;|\&\#xa5\;|\u00A5|eur|\&\#8364\;|\&\#x20ac\;)\s*\d[0-9\,\.]*)/gi;
        var textNodeRe = /textnode/i;
        var emRe = /em/;
        var priceRangeRe = /^(\s|to|\d|\.|\$|\-|,)+$/; 
        var priceBonusRe = /club|total|price|sale|now|brightred/i;
        var outOfStockRe = /soldout|currentlyunavailable|outofstock/i;
        var tagRe = /^(h1|h2|h3|b|strong|sale)$/i;
        var anchorTagRe = /^a$/i;
    
        var penRe = /original|header|items|under|cart|more|nav|upsell/i;
        
        var last = '';
        var lastNode;
        var outOfStockIndex = -1;
        var foundPositivePriceBeforeOOSMsg = 0;
     
        var getParents = function(node) {
            var parents = [];
            var traverse = node;
            while(traverse.parentNode) {
            parents.push(traverse.parentNode);
            traverse = traverse.parentNode;
            }
            return parents;
        };
        
        var findMutualParent = function(first,second) {
    
            var firstParents = getParents(first);
            var secondParents = getParents(second);
    
            for(var i = 0; i < firstParents.length; i++) {
            for(var j = 0; j < secondParents.length; j++) {
                if(firstParents[i] === secondParents[j]) {
                    return firstParents[i];
                    }
                }
            }
            return undefined;
        };
        
        var getStyleFunc = function(node) {
            if(document.defaultView && document.defaultView.getComputedStyle) {
                var computedStyle = document.defaultView.getComputedStyle(node,null);
                return function(propertyName) {
                    return computedStyle.getPropertyValue(propertyName);
                    };
            } else {
                return function(propertyName) {
    
                    var mapper = {
                        'font-size' : 'fontSize',
                        'font-weight' : 'fontWeight',
    		    'text-decoration' : 'textDecoration'
                    };
                    
                    return node.currentStyle[ mapper[propertyName] ? mapper[propertyName] : propertyName ];
                    };
            }
        };
        
        
        var getWalker = function() {
            if(document.createTreeWalker) {
            return document.createTreeWalker(document.body,
                                           NodeFilter.SHOW_TEXT,
                                           function(node) {
                                               return NodeFilter.FILTER_ACCEPT;
                                           },
                                           false
                                          );
        
            } else {
    
    
            return {
                q : [],
                intialized : 0,
                currentNode : undefined,
                nextNode : function() {
                    if(!this.initialized) {
                        this.q.push(document.body);
                        this.initialized = true;
                    }
                    
                    while(this.q.length) {
                        var working = this.q.pop();
                        if(working.nodeType == 3) {
                            this.currentNode = working;
                            return true;
                        } else if(working.childNodes) {
    
    
                            if(working.style && 
                               (working.style.visibility == 'hidden' || 
                                working.style.display == 'none')) {
                                continue;
                            }
    
                            var children = new Array(working.childNodes.length);
                            for(var i = 0; i < working.childNodes.length; i++) {
                                children[i] = working.childNodes[i];
                            }
                            children.reverse();
                            this.q = this.q.concat(children);
                        }
                    }
                    return false;
                }
            };
            }
        };
    
        var getFontSizePx = function(styleFunc) {
    
            var fontSize = styleFunc('font-size') || '';
            var sizeFactor = emRe.test(fontSize) ? 16 : 1;
    
            fontSize = fontSize.replace(/px|em|pt/,'');
            fontSize -= 0;
    
            if(!isNaN(fontSize)) {
                return fontSize * sizeFactor;
            } else {
                return 0;
            }
        };
    
        var getOffset = function(node) {
    
    	var offset = node.offsetTop;
    
    	while(node.offsetParent) {
    	    node = node.offsetParent;
    	    offset += node.offsetTop;
    	}
    
    	return offset;
        };
    
        var getScore = function(node, index) {
    
            var domNode = node.node;
            var styledNode = domNode.nodeType == 3 ? domNode.parentNode : domNode;
    
            var price = node.price;
            var content = '';
    
            if(domNode.nodeType == 3) {
                content = domNode.data;
            } else {
                content = domNode.innerText || domNode.textContent;
            }
        
            var score = 0;
            var getStyle = getStyleFunc(styledNode);
    	
    	var fontWeight = getStyle('font-weight');
    
            if(getStyle('font-weight') == 'bold') {
                score += 1;
            } 
    
           if(!styledNode.offsetWidth && !styledNode.offsetHeight ||
               getStyle('visibility') == 'hidden' ||
               getStyle('display') == 'none') {
                               score -= 100;
            }
    
            var parentsChildrenContent = (domNode.parentNode.innerText || domNode.parentNode.textContent).replace(/\s/g,'');
    	var strippedContent = content.replace(/\s+/g,'');
    	
    
    
                if(!nonZeroRe.test(price)) {
                    score -= 100;
                }
    
    	var strippedContentNoPrice = strippedContent.replace(/price|our/ig,'');
            if(strippedContentNoPrice.length < price.length * 2 + 4) {
    	    score += 10;
    	}
    
    	if(priceRangeRe.test(strippedContent)) {
    	    score += 2;
    	}
    
    	if(price.indexOf('.') != -1) {
    	    score += 2;
    	}
    
    	score -= Math.abs(getOffset(styledNode) / 500);
    
            score += getFontSizePx(getStyle);
           
            if (penRe.test(content)) { score-=4; }
            if (priceBonusRe.test(content)) { score++; }
            domNode = styledNode;
    
            var parentsWalked = 0;
    
            while (domNode !== null &&
    	       domNode != document.body &&
                   parentsWalked++ < 4 ) {
    
    
    	    if(parentsWalked !== 0) {
    		getStyle = getStyleFunc(domNode);
    	    }
    
                if(getStyle('text-decoration') == 'line-through') {
    		 score -=100;
                }
    
    
    
                for(var i = 0; i < domNode.childNodes.length; i++) {
    
                    if(domNode.childNodes[i].nodeType == 3) {
                        
                        var tnode = domNode.childNodes[i];
                        
                        if(tnode.data) {
                            if(priceBonusRe.test(tnode.data)) {
                                score += 1;
                            }
                            
                            if(penRe.test(tnode.data)) {
                                score -= 1;
                            }
                        }
                    }
                }
    
    	    if(anchorTagRe.test(domNode.tagName)) {
    		score -=5 ;
    	    }
                if (priceBonusRe.test(domNode.getAttribute('class') || 
                                      domNode.getAttribute('className'))) {
                    score+=1;
                }
    
                if (priceBonusRe.test(domNode.id)) {
                    score+=1;
                }
    
                if (tagRe.test(domNode.tagName)) {
                    score += 1;
                }
    
                if (penRe.test(domNode.tagName)) {
                    score -= 1;
                }
    
                if (penRe.test(domNode.id)) {
                    score -= 2;
                }
                
                if (penRe.test(domNode.getAttribute('class') ||
                               domNode.getAttribute('className'))) {
                    score -= 2;
                }
    
                domNode = domNode.parentNode;
    
            }
            
    	
            score -= content.length / 100;
    
            score -= index / 5;
    
            return score;
    
        };
    
        walker = getWalker();
    
    
        while(walker.nextNode() && nodes.length < 100) {
    
            if( nodes.length % 100 === 0 ) {
                if( new Date().getTime() - startTime > 1500 ) {
                    return;
                }
            }
    
            var node = walker.currentNode;
        
            var text = node.data.replace(/\s/g,'');
            priceFormatRe.lastIndex = 0;
            var priceMatch = text.match(priceFormatRe);
            
           //If OutofStockIndex has not been set and we found a OOS string then
           // we set the index to number of price matches found before this match
           if((outOfStockIndex < 0) && outOfStockRe.test(text)) {
                 outOfStockIndex = nodes.length;
            }	
            if(priceMatch) {
    	    
            nodes.push(
                {
                    'node' : node,
                    'price' : priceMatch[0]
                }
            );
            text = '';
            } else if( last !== '' && text !== '') {
            priceMatch = (last + text).match(priceFormatRe);
            if(priceMatch) {
                var mutual = findMutualParent(lastNode,node);
                nodes.push({'node' : mutual, 'price' : priceMatch[0]});
            }
            }
        
            lastNode = node;
            last = text;
        }
    
    
        var max = undefined;
        var maxNode = undefined;
    
        for(var i = 0; i < nodes.length; i++) {
            var score = getScore(nodes[i], i);
            //Trying to see if we found a positive price before we found a OOS match
            if((i < outOfStockIndex) && (score > 0)) {
               foundPositivePriceBeforeOOSMsg = 1;
             }
            if(max === undefined || score > max) {
             max = score;
             maxNode = nodes[i];
            }
        }
    
        if(maxNode && ((outOfStockIndex < 0) || foundPositivePriceBeforeOOSMsg)) {
         return maxNode.price;
        }
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