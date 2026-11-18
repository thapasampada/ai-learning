import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { sendPasswordResetEmail } from '../utils/sendEmail.js'

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] })

        if (userExists) {
            return res.status(400).json({
                success: false,
                error:
                   userExists.email === email
                        ? 'Email already exists'
                        : 'Username already taken',
                statusCode: 400,
            })
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
        })

        // Generate token
        const token = generateToken(user._id)

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                    createdAt: user.createdAt,
                },
                token,
            },
            message: 'User registered successfully',
        })

    } catch (error) {
        next(error)
    }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password',
                statusCode: 400,
            })
        }

        // Check for user (include password for comparison)
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
                statusCode: 401,
            })
        }

        // Check password
        const isMatch = await user.matchPassword(password)

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
                statusCode: 401,
            })
        }

        // Generate token
        const token = generateToken(user._id)

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                },
                token,
                message: 'User logged in successfully',
        })

    } catch (error) {
        next(error)
    }
}

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Please provide an email address',
                statusCode: 400,
            })
        }

        const user = await User.findOne({ email: email.toLowerCase() })

        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If that email is registered, we have sent a password reset link.',
            })
        }

        const resetToken = crypto.randomBytes(20).toString('hex')
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

        user.resetPasswordToken = hashedToken
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000
        await user.save({ validateBeforeSave: false })

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`

        try {
            await sendPasswordResetEmail({
                email: user.email,
                resetUrl,
                username: user.username,
            })
        } catch (emailError) {
            console.error('Password reset email failed:', emailError.message)
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined
            await user.save({ validateBeforeSave: false })

            return res.status(500).json({
                success: false,
                error: 'Could not send reset email right now. Please try again later.',
                statusCode: 500,
            })
        }

        res.status(200).json({
            success: true,
            message: 'If that email is registered, we have sent a password reset link.',
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a reset token and a new password',
                statusCode: 400,
            })
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        })

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired reset token',
                statusCode: 400,
            })
        }

        user.password = password
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()

        res.status(200).json({
            success: true,
            message: 'Password reset successfully. Please log in with your new password.',
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const { username, email, profileImage } = req.body

        const user = await User.findById(req.user._id)

        if(username) user.username = username
        if(email) user.email = email
        if(profileImage) user.profileImage = profileImage

        await user.save()

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
            message: 'Profile updated successfully',
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Change user password
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body

        if(!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Please provide current and new password',
                statusCode: 400,
            })
        }

        const user = await User.findById(req.user.id).select('+password')

        // Check current password
        const isMatch = await user.matchPassword(currentPassword)

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: 'Current password is incorrect',
                statusCode: 400,
            })
        }

        // Update password
        user.password = newPassword
        await user.save()

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        })

    } catch (error) {
        next(error)
    }
}