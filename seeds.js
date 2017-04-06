var mongoose            = require("mongoose");
var Thriftstore         = require("./models/thriftstore");
var Comment             = require("./models/comment");

var data = [
    {
        name: "New York Thriftstore",
        image: "http://ecosalon.com/wp-content/uploads/EcoSalon_7ThriftStores-NYC_WGACA.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id molestie massa. Maecenas in orci ex. Mauris non diam ac libero tincidunt blandit. Nullam a turpis pharetra, consequat sem sit amet, commodo justo. Aenean eget aliquet massa. Nulla efficitur rhoncus lorem et tincidunt. Ut vitae nulla tempus, accumsan arcu eu, iaculis elit. Curabitur egestas est eget rutrum pulvinar. Donec pretium metus non accumsan eleifend. Integer malesuada fringilla porttitor. Donec et arcu et purus dapibus feugiat eu at quam. In quis magna hendrerit, dictum nibh in, porta tortor. Vestibulum sed purus id mi eleifend porta."
        
    },
        {
        name: "Rhode Island Thriftstore",
        image: "https://rstatic.savers.com/locations/550067_8493_1165_0003_INT.jpg",
        description: "Vestibulum auctor varius nisl, in dictum lorem porttitor hendrerit. Curabitur facilisis libero metus, eu vestibulum risus molestie id. Mauris condimentum velit orci, a facilisis diam mattis eget. Donec molestie eros eget enim placerat dictum. Sed augue odio, convallis sed convallis ac, rutrum non enim. Nulla rutrum nibh ut ipsum convallis sagittis. Duis ut maximus risus, id feugiat ipsum."
        
    },
        {
        name: "Nashville Thriftstore",
        image: "https://rstatic.savers.com/locations/550067_8495_1165_0002_INT.jpg",
        description: "Aenean vitae varius elit, eu luctus orci. Quisque quis libero facilisis, facilisis arcu a, bibendum justo. Ut egestas laoreet scelerisque. Curabitur vel pretium risus, vel rhoncus dui. Fusce ac sem nec purus porttitor tempus a ut ipsum. Aenean dui urna, hendrerit sit amet aliquet in, imperdiet sed ex. In hendrerit risus molestie risus porttitor tristique nec in purus. Etiam cursus volutpat ligula, et molestie massa dignissim eu. Nam at nunc a erat iaculis tempus."
        
    },
]

    function seedDB(){
        Thriftstore.remove({}, function(err){
        if(err){
            console.log(err);
        } 
        console.log("removed thriftstores!");
            data.forEach(function(seed){
            Thriftstore.create(seed, function(err, thriftstore){
                if(err){
                    console.log(err);
                } else {
                    console.log("added the thriftstore");
                    //create a comment
                    Comment.create(
                        {
                            text: "this place is great, but I wish there was internet!",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                
                                thriftstore.comments.push(comment);
                                thriftstore.save();
                                console.log("created new comment!");
                            }
                            
                        });
                }
            });

    });
    });
    }
    //add a few thriftstores

    //add some comments

module.exports = seedDB;
