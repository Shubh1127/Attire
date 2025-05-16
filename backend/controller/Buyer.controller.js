
const BuyerModel = require('../Model/BuyerModel');
const ProductModel=require('../Model/ProductModel')
const cloudinary = require('../Config/CloudnaryConfig');
const jwt = require('jsonwebtoken');
const Fuse=require('fuse.js');
module.exports.register = async (req, res) => {
  const { name, email, phoneNumber, provider = 'local' } = req.body;

  try {
    let buyer = await BuyerModel.findOne({ email });

    if (buyer) {
      // If user exists and provider is Google, treat it as login
      if (provider === 'google') {
        const token = buyer.generateAuthToken();
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'None',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.status(200).json({ message: 'User logged in successfully', token, buyer });
      }
      // For local provider, block duplicate registration
      return res.status(400).json({ message: 'User already exists' });
    }

    // Register new user
    const newBuyerData = { name, email, phoneNumber, provider };

    if (provider === 'local') {
      if (!req.body.password) {
        return res.status(400).json({ message: 'Password is required for local signup' });
      }
      newBuyerData.password = await BuyerModel.hashPassword(req.body.password);
    }

    const newBuyer = new BuyerModel(newBuyerData);
    await newBuyer.save();

    const token = newBuyer.generateAuthToken();
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: 'User registered successfully', token, buyer: newBuyer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const buyer = await BuyerModel.findOne({ email });
    if (!buyer) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    const isMatch = await buyer.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    const token = buyer.generateAuthToken();
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // 
    // .log(buyer._id)
    return res.status(200).json({ token, buyer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.logout=async (req, res) => {
  // Clear cookies
  res.clearCookie('token');
  res.clearCookie('tokenTimestamp');
  
  // Set cache headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  
  // Send response
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports.getProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Please login first' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const buyer = await BuyerModel.findById(decoded._id);
    if (!buyer) {
      return res.status(400).json({ message: 'Buyer not found' });
    }
    return res.status(200).json({
      buyer: {
        _id: buyer._id,
        name: buyer.name,
        email: buyer.email,
        phoneNumber: buyer.phoneNumber,
        provider: buyer.provider,
        addresses: buyer.addresses, 
        profileImageUrl: buyer.profileImageUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.updateProfile = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Please login first' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const buyer = await BuyerModel.findById(decoded._id);
    if (!buyer) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }

    const { name, email, phoneNumber, addresses } = req.body; // Expecting an array of addresses
    console.log(req.body);
    let profileImageUrl = buyer.profileImageUrl;
    if (req.file) {
      if (buyer.profileImageUrl) {
        const publicId = buyer.profileImageUrl.match(/buyers\/ProfilePhotos\/(.*)\./);
        await cloudinary.uploader.destroy(publicId);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'buyer/ProfilePhotos', // Cloudinary folder
      });
      profileImageUrl = result.secure_url;
    }

    // Updating buyer with the new address array and other profile details
    const updatedBuyer = await BuyerModel.findByIdAndUpdate(
      decoded._id,
      {
        name,
        email,
        phoneNumber,
        addresses, // Updating the addresses array
        profileImageUrl,
      },
      { new: true }
    );

    return res.status(200).json({
      buyer: {
        name: updatedBuyer.name,
        email: updatedBuyer.email,
        phone: updatedBuyer.phone,
        profileImageUrl: updatedBuyer.profileImageUrl,
        addresses: updatedBuyer.addresses, // Returning updated addresses
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Something went wrong.' });
  }
};
//address
module.exports.addAddress = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Please login first' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const buyer = await BuyerModel.findById(decoded._id);
    if (!buyer) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }

    const { houseNo, street, city, state, pincode } = req.body;
    const newAddress = { houseNo, street, city, state, pincode };

    buyer.addresses.push(newAddress);
    await buyer.save();

    return res.status(200).json({ message: 'Address added successfully', buyer });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Something went wrong.' });
  }
};

module.exports.updateAddress = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Please login first' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const buyer = await BuyerModel.findById(decoded._id);
    if (!buyer) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }

    const { index } = req.params;
    const { houseNo, street, city, state, pincode } = req.body;

    if (index >= 0 && index < buyer.addresses.length) {
      buyer.addresses[index] = { houseNo, street, city, state, pincode };
      await buyer.save();
      return res.status(200).json({ message: 'Address updated successfully', addresses: buyer.addresses ,buyer});
    } else {
      return res.status(400).json({ message: 'Invalid address index' });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Something went wrong.' });
  }
};

module.exports.deleteAddress = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Please login first' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const buyer = await BuyerModel.findById(decoded._id);
    if (!buyer) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }

    const { index } = req.params;

    if (index >= 0 && index < buyer.addresses.length) {
      buyer.addresses.splice(index, 1);
      await buyer.save();
      return res.status(200).json({ message: 'Address deleted successfully', buyer });
    } else {
      return res.status(400).json({ message: 'Invalid address index' });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Something went wrong.' });
  }
};

module.exports.setDefaultAddress = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Please login first' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const buyer = await BuyerModel.findById(decoded._id);
    if (!buyer) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }

    const { index } = req.params;

    if (index >= 0 && index < buyer.addresses.length) {
      buyer.addresses.forEach((address, i) => {
        address.isDefault = i === parseInt(index);
      });
      await buyer.save();
      return res.status(200).json({ message: 'Default address set successfully', buyer });
    } else {
      return res.status(400).json({ message: 'Invalid address index' });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Something went wrong.' });
  }
};

//orders and cart

module.exports.SearchItem = async (req, res) => {
  const { query } = req.query;
  // console.log(req.query);

  try {
    // Validate query
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Split the query into terms by space (so user can search for multiple categories/keywords)
    const searchTerms = query.split(' ').map(term => term.trim());

    // Fetch all products from the database (consider limiting records for performance)
    const products = await ProductModel.find();

    // Prepare Fuse.js options for fuzzy search
    const fuseOptions = {
      keys: ['name', 'description', 'category'], // Fields to search in
      threshold: 0.3, // Adjust fuzziness (lower = more fuzzy)
      includeScore: true, // Optionally include score for relevance
    };

    // Initialize Fuse.js with the products and search options
    const fuse = new Fuse(products, fuseOptions);

    // Perform search for each term and collect the results
    let allResults = [];
    for (let term of searchTerms) {
      const searchResults = fuse.search(term); // Search each term
      // Extract the matched products from the search results
      const resultProducts = searchResults.map(result => result.item);
      allResults = [...new Set([...allResults, ...resultProducts])]; // Avoid duplicates by using Set
    }

    // Return the search results
    res.status(200).json(allResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// module.exports.ForgotPassword=async(req,res)=>{
//   const { email } = req.body;

//   // Validate email
//   if (!email) {
//       return res.status(400).json({ message: 'Email is required' });
//   }
//   const buyer=await BuyerModel.findOne({email});
//   if(!buyer){
//       return res.status(404).json({message:'Invalid email'});
//         }
//   const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Convert to string

//   try {
//       const storeOtp = await OTPModel.updateOne(
//           { email },
//           {
//               email,
//               otp,
//               expires: new Date(Date.now() + 600000) // Set expiration to 10 minutes from now
//           },
//           { upsert: true } // Create a new document if it doesn't exist
//       );
//       await sendOTPEmail(email, otp);
//        // Await the email sending function

//       return res.status(200).json({ message: 'OTP sent successfully' });
//   } catch (err) {
//       console.error('Error sending OTP:', err);
//       return res.status(500).json({ message: 'Error sending OTP' });
//   }
// }
// module.exports.VerifyOtp=async(req,res)=>{
//   const {email,otp}=req.body;
//   try{
//       if(!email || !otp){
//           return res.status(400).json({message:'Email and OTP are required'});
//       }
//       const checkOtp=await OTPModel.findOne({email,otp});
//       if(!checkOtp){
          
//           return res.status(400).json({message:'Invalid OTP'});
//       }
//       if (checkOtp.expires < Date.now()) {
//           return res.status(400).json({ message: 'OTP expired' });
//       }
//       return res.status(200).json({message:'OTP verified successfully'});

//   }catch(err){
//       console.error('Error verifying OTP:',err);
//       return res.status(500).json({message:'Error verifying OTP'});
//   }
// }
// module.exports.addNewPassword=async(req,res)=>{
//   const {email,newPassword}=req.body;
//   // console.log(req.body)
//   try{
//     const exisitngBuyer=await BuyerModel.findOne({email});
//     if(!exisitngBuyer){
//       return res.status(404).json({message:'Buyer not found'});
//     }
//     await OTPModel.deleteOne({ email });
//     const hashedPassword=await bcrypt.hash(newPassword,10);
//     exisitngBuyer.password=hashedPassword;
//     await exisitngBuyer.save();
//     return res.status(200).json({message:'Password updated successfully'});
//   }catch(err){

//     console.error(err)
//     return res.status(500).json({message:err.message});
//   }
// }
