const Project = require('../models/Project');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

exports.getDashboardStats = catchAsync(async (req, res, next) => {
    const managerId = req.user.id;

    const totalProjects = await Project.countDocuments({ manager: managerId });
    const currentProjects = await Project.countDocuments({ manager: managerId, status: 'Current' });
    const completedProjects = await Project.countDocuments({ manager: managerId, status: 'Completed' });
    const remainingProjects = await Project.countDocuments({ manager: managerId, status: { $in: ['Pending', 'Delayed'] } });
    const delayedProjects = await Project.countDocuments({ manager: managerId, status: 'Delayed' });

    //total employees and team leads are count
    const totalEmployees = await User.countDocuments({ active: true, role: { $ne: 'manager' } });
    const totalTls = await User.countDocuments({ active: true, role: 'team_lead' });

    const incomeStats = await Project.aggregate([
        {
            $match: { manager: managerId, status: 'Completed' }
        },
        {
            $group: {
                _id: null,
                totalIncome: { $sum: '$projectValue' }
            }
        }
    ]);

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const lastMonthIncomeStats = await Project.aggregate([
         {
            $match: {
                manager: managerId,
                status: 'Completed',
                completionDate: { $gte: lastMonth }
            }
        },
        {
            $group: {
                _id: null,
                lastMonthIncome: { $sum: '$projectValue' }
            }
        }
    ]);
    
    const totalIncome = incomeStats.length > 0 ? incomeStats[0].totalIncome : 0;
    const lastMonthIncome = lastMonthIncomeStats.length > 0 ? lastMonthIncomeStats[0].lastMonthIncome : 0;
    
    const totalClientReceived = totalProjects;
    const totalImportData = 0; 

    const stats = {
        totalProjects,
        currentProjects,
        completedProjects,
        remainingProjects,
        totalEmployees,
        totalTls,
        totalIncome,
        lastMonthIncome,
        totalClientReceived,
        delayedProjects,
        totalImportData
    };

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});