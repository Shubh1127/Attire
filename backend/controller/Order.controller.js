module.exports.getOrders = async (req, res) => {
  const token=req.header('Authorization').replace('Bearer ','');
  if(!token){
    return res.status(401).json({message:'Please login first'});
  }
  try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const buyer=await BuyerModel.findById(decoded._id);
    if(!buyer){
      return res.status(401).json({message:'Invalid token or user not found'});
    }
    return res.status(200).json({orders:buyer.orders});
  }
  catch(error){
    console.error(error);
    return res.status(500).json({message:'Something went wrong'});
  }
};


//products
module.exports.getProducts=async(req,res)=>{
  try{
    const products=await ProductModel.find();
    return res.status(200).json({products});
  }catch(error){
    console.error(error);
    return res.status(500).json({message:'Something went wrong'});
  }
}
module.exports.getProduct=async(req,res)=>{
  try{
    const {productId}=req.params;
    const product=await ProductModel.findById(productId);
    if(!product){
      return res.status(404).json({message:'Product not found'});
    }
   
    const farmer=await FarmerModel.findById(product.farmerId);
   
    return res.status(200).json({product:product,farmer:farmer});
  }catch(err){
    return res.status(500).json({message:err.message});
  }
}

module.exports.getCategory=async(req,res)=>{
  const {category}=req.params;
  try{
    const Categoryproducts=await ProductModel.find({category});
    // console.log(Categoryproducts)
    return res.status(200).json({Categoryproducts});
  }catch(error){
    return res.status(500).json({message:error.message});
  }
}