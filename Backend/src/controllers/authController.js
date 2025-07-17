import User from '../models/user.js';
import SessionDao from "../dao/sessionDao.js";
import {raw} from "express";

export const sessions = {};

export const register = async (req, res) => {
    try {
        const {email, password, username} = req.body;
        const user = await User.create({email, password, username});
        res.status(201).json({message: 'User registered successfully', userId: user.id});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findByEmail(email);
        if (!user || !(await user.verifyPassword(password, user.password))) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const activeApiKey = await SessionDao.getActiveApiKey(user.id);

        if (!activeApiKey) {
            console.log("Creating new API key");
            const createdAt = new Date();
            const expiresAt = new Date(createdAt);
            expiresAt.setDate(createdAt.getDate() + 30);
            const expiresAtString = expiresAt.toISOString().replace('T', ' ').substring(0, 19);

            const apiKey = await SessionDao.create(user.id, createdAt.toISOString().replace('T', ' ').substring(0, 19), expiresAtString);
            sessions[apiKey] = user.id;
            res.cookie('apiKey', apiKey, {httpOnly: true});
            return res.json({message: 'Login successful', user_id: user.id});
        }

        sessions[activeApiKey] = user.id;
        res.cookie('apiKey', activeApiKey, {httpOnly: true});
        res.json({message: 'Login successful', user_id: user.id});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Login failed'});
    }
};

export const logout = (req, res) => {
    const apiKey = req.cookies.apiKey;
    // console.log(apiKey)
    SessionDao.delete(apiKey);
    res.clearCookie('apiKey');
    res.json({message: 'Logout successful'});
};

export const deleteApiKey = async (req, res) => {
    try {
        const { userId, apiKey, isActive } = req.body;
        console.log(apiKey);
        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const isValidApiKey = await SessionDao.getApiKeyByUserId(userId, apiKey);

        if(!isValidApiKey) {
            return res.status(404).json({message: 'API not found in user'});
        }

        if (apiKey) {
            if (isActive) {
                return res.status(409).json({message: 'Cannot delete API key while it is active.'});
            }
            await SessionDao.delete(apiKey);
            return res.json({message: 'Api Key deleted successfully'});
        }
        res.status(404).json({error: 'API Key not found'});
    } catch (error) {
        res.status(500).json({error: 'Deletion failed'});
    }
}

export const createNewApiKey = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const createdAt = new Date();
        const expiresAt = new Date(createdAt);

        expiresAt.setDate(createdAt.getDate() + 30);
        const expiresAtString = expiresAt.toISOString().replace('T', ' ').substring(0, 19);

        const apiKey = await SessionDao.create(userId, createdAt.toISOString().replace('T', ' ').substring(0, 19), expiresAtString);
        sessions[apiKey] = userId;
        res.cookie('apiKey', apiKey, {httpOnly: true});
        res.json({message: 'New API Key created', user_id: userId});
    } catch (error) {
        res.status(500).json({error: 'Error creating API Key'});
    }
}