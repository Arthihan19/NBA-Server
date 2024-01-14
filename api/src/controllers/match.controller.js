class MatchController {
    constructor(MatchService) {
        this.MatchService = MatchService;
    }

    asyncWrapper(fn) {
        return (req, res, next) => {
            fn(req, res, next).catch(next);
        };
    }

    getSchedule = this.asyncWrapper(async (req, res) => {
        const { beforeDate, afterDate, page, pageSize, teamName, gameId } = req.query;

        const parsedBeforeDate = beforeDate ? new Date(beforeDate) : undefined;
        const parsedAfterDate = afterDate ? new Date(afterDate) : undefined;
        const parsedPage = page ? parseInt(page, 10) : undefined;
        const parsedPageSize = pageSize ? Math.min(parseInt(pageSize, 10), 100) : undefined;

        const schedule = await this.MatchService.getSchedule({
            beforeDate: parsedBeforeDate,
            afterDate: parsedAfterDate,
            page: parsedPage,
            pageSize: parsedPageSize,
            teamName,
            gameId
        });

        res.status(200).json(schedule);
    });
}

module.exports = MatchController;
