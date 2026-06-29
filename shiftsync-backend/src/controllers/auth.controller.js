import { User } from '../models/index.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.util.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, name, phone, role, specializations, licenseNumber } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return sendError(res, 'Email already registered', 400);

    const user = await User.create({
      email,
      passwordHash: password,
      name,
      phone,
      role,
      specializations,
      licenseNumber,
    });

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await user.update({ refreshToken });

    return sendSuccess(res, {
      user: { id: user.id, email: user.email, name: user.name, role: user.role, profilePhoto: user.profilePhoto },
      accessToken,
      refreshToken,
    }, 'Registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return sendError(res, 'Invalid credentials', 401);

    const isValid = await user.comparePassword(password);
    if (!isValid) return sendError(res, 'Invalid credentials', 401);

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await user.update({ refreshToken });

    return sendSuccess(res, {
      user: { id: user.id, email: user.email, name: user.name, role: user.role, profilePhoto: user.profilePhoto },
      accessToken,
      refreshToken,
    }, 'Logged in successfully');
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, 'Refresh token required', 400);

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findByPk(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return sendError(res, 'Invalid refresh token', 401);
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    await user.update({ refreshToken: newRefreshToken });

    return sendSuccess(res, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, profilePhoto: user.profilePhoto },
    }, 'Token refreshed');
  } catch {
    return sendError(res, 'Invalid refresh token', 401);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.update({ refreshToken: null }, { where: { id: req.user.id } });
    return sendSuccess(res, null, 'Logged out');
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['passwordHash', 'refreshToken'] },
    });
    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
};
