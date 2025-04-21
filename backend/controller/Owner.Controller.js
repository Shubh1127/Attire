const Owner = require('../Model/OwnerModel');
const cloudinary = require('../Config/CloudnaryConfig');

module.exports.register = async (req, res) => {
    const { name, email, password, provider = 'local' } = req.body;

    try {
        let user = await Owner.findOne({ email });

        if (user) {
            // If user exists and provider is Google, treat it as login
            if (provider === 'google') {
                const token = user.generateAuthToken();
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
                return res.status(200).json({ message: 'User logged in successfully', token, user });
            }

            // For local provider, block duplicate registration
            return res.status(400).json({ message: 'User already exists' });
        }

        // Register new user
        const newUserData = { name, email, provider };

        if (provider === 'local') {
            if (!password) return res.status(400).json({ message: 'Password is required for local signup' });
            newUserData.password = await Owner.hashPassword(password);
        }

        user = new Owner(newUserData);
        await user.save();

        const token = user.generateAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ message: 'User registered successfully', token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Owner.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.provider !== 'local') {
            return res.status(400).json({ message: 'Use Google login for this account' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = user.generateAuthToken();
        res.cookie('token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7*24 * 60 * 60 * 1000 // 7 day
        })
        res.status(200).json({ message: 'Login successful', token, owner:user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports.logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
    });
    res.status(200).json({ message: 'Logout successful' });
};

module.exports.getProfile = async (req, res) => {
    try {
        const user = await Owner.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Profile Picture

module.exports.updateProfilePicture = async (req, res) => {
    try {
        const { _id } = req.user;
        const owner = await Owner.findById(_id);
        if (!owner) return res.status(404).json({ message: 'Owner not found' });

        if (req.file) {
            // 🔥 Delete the old image if it's not the default placeholder
            if (owner.profileImage && !owner.profileImage.includes('via.placeholder.com')) {
                // Extract public_id from the Cloudinary URL
                const urlParts = owner.profileImage.split('/');
                const fileNameWithExt = urlParts[urlParts.length - 1]; // iz3onb4yuwg7bpw1xxnd.jpg
                const folderIndex = urlParts.findIndex(part => part === 'upload') + 1;
                const publicId = urlParts.slice(folderIndex).join('/').replace(/\.[^/.]+$/, ''); // remove file extension

                await cloudinary.uploader.destroy(publicId); // delete from Cloudinary
            }

            // ✅ Upload new image
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'Owners/ProfilePictures',
            });

            // ✅ Save new image URL
            owner.profileImage = result.secure_url;
            await owner.save();

            return res.status(200).json({
                message: 'Profile picture updated successfully',
                profileImage: owner.profileImage
            });
        } else {
            return res.status(400).json({ message: 'No file uploaded' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Password
module.exports.updatePassword = async (req, res) => {
    try {
        const { _id } = req.user; // Extract user ID from the request
        const { currentPassword, newPassword } = req.body;

        const owner = await Owner.findById(_id);
        if (!owner) return res.status(404).json({ message: 'Owner not found' });

        // Check if the current password matches
        const isMatch = await owner.comparePassword(currentPassword);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        // Hash and update the new password
        owner.password = await Owner.hashPassword(newPassword);
        await owner.save();

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};