const cron = require('node-cron');
const axios = require('axios');
const BetRepository = require('./repositories/bet.repository');
const UserRepository = require('./repositories/user.repository');

async function fetchSchedule() {
    try {
        const response = await axios.get('https://cdn.nba.com/static/json/staticData/scheduleLeagueV2_1.json');
        return response.data.leagueSchedule.gameDates.flatMap(date => date.games);
    } catch (error) {
        console.error('Error fetching schedule: ', error.message);
        return [];
    }
}

async function processBets() {
    try {
        const betRepository = BetRepository;
        const userRepository = UserRepository;
        const schedule = await fetchSchedule();

        const pendingBets = await betRepository.findBetsByState('PENDING');

        console.log(`Processing ${pendingBets.length} pending bets`)

        for (const bet of pendingBets) {
            const match = schedule.find(game => game.gameId === bet.game_id);

            if (match && match.gameStatus === 3) {
                const winningTeam = match.homeTeam.score > match.awayTeam.score ? match.homeTeam.teamId : match.awayTeam.teamId;
                const betWon = winningTeam.toString() === bet.team_id.toString();
                const resultState = betWon ? 'WON' : 'LOST';
                const winnings = Number(bet.currency_bet) * Number(bet.odds_bet_with);

                await betRepository.updateBetState(bet.id, resultState);

                const user = await userRepository.findById(bet.user_id);
                await userRepository.updateUserAfterBet(user.userId, Number(winnings), betWon);

                console.log(`Bet ${bet.id} processed. User ${user.username} ${betWon ? 'won' : 'lost'} ${winnings} currency.`);
            }
        }
    } catch (error) {
        console.error('Error processing bets: ', error.message);
    }
}

const scheduleBetProcessing = async () => {
    await processBets();
    console.log('Initial bet processing task finished.');

    cron.schedule('*/30 * * * *', async () => {
        console.log('Running bet processing task every 30 minutes');
        await processBets();
        console.log('Bet processing task finished.');
    });
}

const scheduleDailyCurrencyUpdate = async () => {
    try {
        await UserRepository.addDailyCurrencyToAllUsers(1000);
        console.log('Initial currency update task finished.');
    } catch (error) {
        console.error('Error during initial currency update: ', error.message);
    }

    cron.schedule('*/30 * * * *', async () => {
        console.log('Running currency update task every 30 minutes');
        try {
            await UserRepository.addDailyCurrencyToAllUsers(100);
            console.log('Currency update task finished.');
        } catch (error) {
            console.error('Error during currency update: ', error.message);
        }
    });
}


// const scheduleBetProcessing = () => {
//     cron.schedule('*/10 * * * * *', async () => {
//         console.log('Running bet processing task every 10 seconds');
//         await processBets();
//         console.log('Bet processing task finished.');
//     });
// };


module.exports = { scheduleBetProcessing, scheduleDailyCurrencyUpdate };