const Team = require("../models/Team")
const User = require("../models/User")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

exports.getAllTeams = catchAsync(async (req, res, next) => {
  const teams = await Team.find()

  res.status(200).json({
    status: "success",
    results: teams.length,
    data: {
      teams,
    },
  })
})

exports.createTeam = catchAsync(async (req, res, next) => {
  // Only managers can create teams
  if (req.user.role !== "manager") {
    return next(new AppError("Only managers can create teams", 403))
  }

  const { name, description, teamLeads, executives } = req.body

  const newTeam = await Team.create({
    name,
    description,
    manager: req.user._id,
    teamLeads: teamLeads || [],
    executives: executives || [],
  })

  res.status(201).json({
    status: "success",
    data: {
      team: newTeam,
    },
  })
})

exports.getTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id)

  if (!team) {
    return next(new AppError("No team found with that ID", 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      team,
    },
  })
})

exports.updateTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id)

  if (!team) {
    return next(new AppError("No team found with that ID", 404))
  }

  // Only the team manager can update the team
  if (team.manager._id.toString() !== req.user._id.toString() && req.user.role !== "manager") {
    return next(new AppError("You can only update teams you manage", 403))
  }

  const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: "success",
    data: {
      team: updatedTeam,
    },
  })
})

exports.deleteTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id)

  if (!team) {
    return next(new AppError("No team found with that ID", 404))
  }

  // Only the team manager can delete the team
  if (team.manager._id.toString() !== req.user._id.toString() && req.user.role !== "manager") {
    return next(new AppError("You can only delete teams you manage", 403))
  }

  await Team.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: "success",
    data: null,
  })
})

exports.addTeamMember = catchAsync(async (req, res, next) => {
  const { userId, role } = req.body
  const team = await Team.findById(req.params.id)

  if (!team) {
    return next(new AppError("No team found with that ID", 404))
  }

  // Only the team manager can add members
  if (team.manager._id.toString() !== req.user._id.toString()) {
    return next(new AppError("Only team managers can add members", 403))
  }

  const user = await User.findById(userId)
  if (!user) {
    return next(new AppError("User not found", 404))
  }

  if (role === "team_lead") {
    if (!team.teamLeads.includes(userId)) {
      team.teamLeads.push(userId)
    }
  } else if (role === "executive") {
    if (!team.executives.includes(userId)) {
      team.executives.push(userId)
    }
  }

  await team.save()

  res.status(200).json({
    status: "success",
    data: {
      team,
    },
  })
})
