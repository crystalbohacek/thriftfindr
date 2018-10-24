$(document).ready(function(){

	var pageNumber = 2;

	$("#load-more").click(function(){
	    $.ajax({url: "/api/query-db?perPage=8&page=" + pageNumber, success: function(result){
	       if (pageNumber <= result.pages) {
	       		pageNumber ++;
			
		   var str = "";

	       result.thriftstores.forEach(function(thriftstore){            
            
		           str += '<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">'+
		                '<div class="thumbnail">'+
		                '<a href="/thriftstores/' + thriftstore._id + '">'+
		                    '<div class="thumbnail-img"'
		                         if (thriftstore.image) { 
		                            str += 'style="background-image: url(' + thriftstore.image + ');"'  
		                            	} else { 
		                            str += 'style="background-image: url(\'http://i.imgur.com/kntSEEW.jpg\');"'
		                         } 
		                str += '></div>' + 
		                '</a>' + 
		                    '<div class="store-info">' + 
		                        '<div class="caption">' + 
		                            '<a href="/thriftstores/' + thriftstore._id + '"><h4 class="caption-link">' + thriftstore.name + '</h4></a>' + 
		                            '</div>' 
		                              if (thriftstore.city && thriftstore.state ) {
		                         		str +=  '<div class="city-display">'+ thriftstore.city + ',' +  thriftstore.state + '</div>'
		                               } else if (thriftstore.city && thriftstore.country) { 
		                                str += '<div class="city-display">' + thriftstore.city + ',' + thriftstore.country + '</div>'
		                                 } 
		                              for(i = 0; i < thriftstore.pricegroup; i++) {
		                                str += '<i class="price-display fa fa-usd" aria-hidden="true"></i>'
		                                } 
		                               for(i = thriftstore.pricegroup; i < 5; i++) {
		                                str += '<i class="price-display fa fa-usd fa-usd-gray" aria-hidden="true"></i>'
		                             } 
		                      
		                 str += '</div>' +
		                '</div>' +
		              '</div>'
        	 }); 
	      	
	      	 $("#thriftstore-display").append(str);

	      	 if (pageNumber >= result.pages){
	      	 	$("#load-more").hide();
	      	 }
	       } 
	    }});
	});
});