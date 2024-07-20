const { tournamentSchema, assignSchema } = require("../schema/tournaments.schema");
const { prisma } = require("../utils/connection");

const create = async (req, res, next) => {
    try {
        const { name } = req.body;
        const { error } = tournamentSchema(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const findTournament = await prisma.tournaments.findUnique({ where: { name } });
        if (findTournament) return res.status(400).json({ message: "Tournament already exists" });

        const tournament = await prisma.tournaments.create({
            data: { name }
        });
        res.status(201).json({ message: "Success", tournament })
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const { error } = tournamentSchema(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const findTournament = await prisma.tournaments.findUnique({ where: { id } });
        if (!findTournament) return res.status(404).json({ message: "Tournament not found" });
        const updatedTournament = await prisma.tournaments.update({
            where: { id },
            data: { name }
        });
        res.json({ message: "Success", tournament: updatedTournament })
    } catch (error) {
        next(error);
    }
}

const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const findTournament = await prisma.tournaments.findUnique({ where: { id } });
        if (!findTournament) return res.status(404).json({ message: "Tournament not found" });
        await prisma.tournaments.delete({ where: { id } });
        res.json({ message: "Success" })
    } catch (error) {
        next(error);
    }
}

const show = async (req, res, next) => {
    try {
        const tournaments = await prisma.tournaments.findMany({
            select: {
                id: true,
                name: true,
                start_date: true,
                end_date: true,
                matches: true,
                participants: true
            }
        });
        res.json({ tournaments })
    } catch (error) {
        next(error);
    }
}

const showPersonal = async (req, res, next) => {
    try {
        const personalTournaments = await prisma.tournamentPlayers.findMany(
            {
                where: { user_id: req.user.id },
                select: {
                    tournament: {
                        select: {
                            id: true,
                            name: true,
                            start_date: true,
                            end_date: true,
                            matches: true
                        }
                    }
                }
            }
        )
        res.json({ personalTournaments })
    } catch (error) {
        next(error);
    }
}

const assignPlayer = async (req, res, next) => {
    try {
        const { user_id, tournament_id } = req.body;
        const { error } = assignSchema(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const findUser = await prisma.users.findUnique({ where: { id: user_id } });
        if (!findUser) return res.status(404).json({ message: "User not found" });
        const findTournament = await prisma.tournaments.findUnique({ where: { id: tournament_id } });
        if (!findTournament) return res.status(404).json({ message: "Tournament not found" });

        const findTournamentPlayer = await prisma.tournamentPlayers.findFirst({ where: { user_id, tournament_id } });
        if (findTournamentPlayer) return res.status(400).json({ message: "User already assigned to this tournament" });

        const participants = await prisma.tournaments.findUnique({
            where: { id: tournament_id }, select: {
                _count: {
                    select: {
                        participants: true
                    }
                },
                participants: true
            }
        });

        if (participants._count.participants == 8) {
            return res.status(400).json({ message: "Tournament has reached the participants limit" });
        }

        const tournamentPlayer = await prisma.tournamentPlayers.create({
            data: { user_id, tournament_id }
        });
        res.json({ message: "Success", data: tournamentPlayer })
    } catch (error) {
        next(error);
    }
}

const startTournament = async (req, res, next) => {
    try {
        const { tournament_id } = req.params;

        const findTournament = await prisma.tournaments.findUnique({ where: { id: tournament_id } });
        if (!findTournament) return res.status(404).json({ message: "Tournament not found" });

        const tournamentNotStartedOrEnded = await prisma.tournaments.findFirst({ 
            where: { id: tournament_id, start_date: null, end_date: null } 
        });

        if (!tournamentNotStartedOrEnded) return res.status(400).json({ message: "Tournament has already started or already ended" });

        const participants = await prisma.tournaments.findUnique({
            where: { id: tournament_id },
            select: {
                _count: {
                    select: { participants: true }
                },
                participants: {
                    select: { user_id: true }
                }
            }
        });

        if (participants._count.participants !== 8) {
            return res.status(400).json({ message: "The tournament must have 8 participants to start" });
        }

        await prisma.tournaments.update({
            where: { id: tournament_id },
            data: { start_date: new Date() }
        });

        // Shuffle participants to randomize initial pairings
        const shuffledParticipants = participants.participants.sort(() => Math.random() - 0.5);

        for (let i = 0; i < shuffledParticipants.length / 2; i++) {
            const player1 = shuffledParticipants[i];
            const player2 = shuffledParticipants[i + 4];

            await prisma.matches.create({
                data: {
                    player1_id: player1.user_id,
                    player2_id: player2.user_id,
                    tournament_id: findTournament.id,
                }
            });
        }

        res.json({ message: "Tournament is started. Matches are ready!" });
    } catch (error) {
        next(error);
    }
}

const getLeaderboard = async (req, res, next) => {
    try {
        const {tournament_id} = req.params;
        const leaderboard = await prisma.tournamentPlayers.findMany({
            where: {
                tournament_id,
            },
            select: {
                user: true,
                user_tournament_score: true
            },
            orderBy: {
                user_tournament_score: 'desc'
            }
        });

        res.json({ leaderboard });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    create, 
    update, 
    remove, 
    show, 
    showPersonal, 
    assignPlayer,
    startTournament,
    getLeaderboard
};