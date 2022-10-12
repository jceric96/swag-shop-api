var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db =mongoose.connect('mongodb://localhost/swag-shop');

var Product =require('./model/product');
var WishList =require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//fix 'Access-Control-Allow-Origin' problem
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.post('/product',function(request,response){
    var product = new Product(request.body);
    product.text = request.body.text;
    product.price = request.body.price;
    product.imgUrl = request.body.imgUrl;
    product.save(function(err,savedProduct){
        if(err){
            response.status(500).send({error:"Could not save product"});
        }else{
            response.status(200).send(savedProduct);
        }
    });
});

app.get('/product', function(request, response){

    Product.find({},function(err, products){
        if(err){
            response.status(500).send({error: "Could not fetch products"})
        }else{
            response.send(products);
        }
    });
});

app.delete('/product/id', function(request, response){
    var deleteId = new Product(request.body.id);
})

app.get('/wishlist', function(request,response){
//    WishList.find({}, function(err, wishLists){
//       response.send(wishLists); 
//    });
    WishList.find({}).populate({path:'products', model:'Product'}).exec(function(err, wishLists){
        if(err){
            response.status(500).send({error:"Could not fetch wishlists"})
        }else{
            response.status(200).send(wishLists);
        }
    })
});

app.post('/wishlist', function(request, response){
    var wishList = new WishList();
    wishList.text =request.body.text;
    
    wishList.save(function(err, newWishList){
        if(err){
            response.status(500).send({error:"Could not create wishlist"});
        }else{
            response.send(newWishList);
        }
    });
});

app.put('/wishlist/product/add', function(request,response){
    Product.findOne({_id: request.body.productId},function(err, product){
        if(err){
            response.status(500).send({error:"Could not add item to wishlist"});
        }else{
           WishList.update({_id:request.body.wishListId},{$addToSet:{products:product._id}},function(err, wishList){
               if(err){
                   response.status(500).send({error:"Could not add item to wishlist"});
               }else{
//                   response.send(wishList);
                   response.send("Successfully added to wishlist");
               }
            });
        }
    });
});


app.listen(3004, function(){
    console.log("Swag Shop API running on port 3004...");
});