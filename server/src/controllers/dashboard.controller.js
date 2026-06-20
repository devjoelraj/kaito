import { getDashboardDataService, getProfileService } from "../services/dashboard.service.js";

export const getDashboardController = async (req, res) => {
  try {
    const { date, month, year } = req.query;

    if (!date || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Date, month, and year are required",
      });
    }

    const dashboardData = await getDashboardDataService(
      req.user.id,
      date,
      month,
      year
    );

    return res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfileController = async (req, res) => {
  try {
    const profileData = await getProfileService(req.user.id);
    if (!profileData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
