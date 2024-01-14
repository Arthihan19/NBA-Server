const express = require('express');
const matchRouter = express.Router();

module.exports = function(matchControllerInstance) {
    matchRouter.get("/schedule", matchControllerInstance.getSchedule);

    return matchRouter;
};
