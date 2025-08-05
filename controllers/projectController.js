const Project = require("../models/Project");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// This function can be used for both managers and team leads
exports.createProject = catchAsync(async (req, res, next) => {
    // The user creating the project (manager or team lead) is assigned as the manager
    req.body.manager = req.user.id;
    const doc = await Project.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});


// This function needs to be updated to show a team lead only their projects
exports.getAllProjects = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.user.role === 'manager') {
        // Managers see all projects they created
        filter = { manager: req.user.id };
    } else if (req.user.role === 'team_lead') {
        // Team leads see projects where they are the manager
        filter = { manager: req.user.id };
    }

    const doc = await Project.find(filter);

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            data: doc
        }
    });
});

exports.getProjectPayout = catchAsync(async (req, res, next) => {
    const projects = await Project.find({ manager: req.user.id });
    const payouts = projects.map(project => ({
        companyName: project.companyName,
        invoiceNumber: project.invoiceNumber,
        serviceName: project.serviceName,
        ammount: project.projectValue,
        endDate: project.endDate,
    }));

    res.status(200).json({
        status: 'success',
        data: {
            payouts
        }
    });
});


// This function handles getting a single project
exports.getProject = catchAsync(async (req, res, next) => {
    const doc = await Project.findById(req.params.id);

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    // A team lead can view a project if they are the manager.
    if (doc.manager.id.toString() !== req.user.id.toString()) {
         return next(new AppError('You do not have permission to view this resource', 403));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});


// This function needs to be updated to reflect task-level changes and team lead permissions.
exports.updateProject = catchAsync(async (req, res, next) => {
    let doc = await Project.findById(req.params.id);
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    // Only the project's manager can update the project
    if (doc.manager.id.toString() !== req.user.id.toString()) {
         return next(new AppError('You do not have permission to update this resource', 403));
    }

    if (req.body.status === 'Completed' && doc.status !== 'Completed') {
        req.body.completionDate = Date.now();
    }
    
    // The previous update logic needs to be changed to handle task-level updates.
    // Instead of findByIdAndUpdate, you would need to iterate through tasks.
    if (req.body.tasks && Array.isArray(req.body.tasks)) {
      doc.tasks = req.body.tasks;
    }
    
    // Update other fields as necessary.
    doc = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});


exports.deleteProject = catchAsync(async (req, res, next) => {
    const doc = await Project.findById(req.params.id);
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    // Only the project's manager can delete the project
    if (doc.manager.id.toString() !== req.user.id.toString()) {
         return next(new AppError('You do not have permission to delete this resource', 403));
    }
    await Project.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});


// New controller function for assigning tasks
exports.assignTask = catchAsync(async (req, res, next) => {
    const { taskId, assignedTo } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
        return next(new AppError('No project found with that ID', 404));
    }

    // Ensure the current user has permission to assign tasks for this project
    if (project.manager.toString() !== req.user.id.toString()) {
        return next(new AppError('You do not have permission to assign tasks for this project', 403));
    }

    const task = project.tasks.id(taskId);
    if (!task) {
        return next(new AppError('Task not found in this project', 404));
    }

    task.assignedTo = assignedTo;

    await project.save({ validateBeforeSave: true });

    res.status(200).json({
        status: 'success',
        data: {
            project,
        },
    });
});