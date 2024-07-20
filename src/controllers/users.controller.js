const { usersSchema } = require("../schema/users.schema");
const bcrypt = require('bcrypt')
const { prisma } = require('../utils/connection');

const create = async (req, res, next) => {
    try {
        const { fullname, email, password, age, country, isAdmin } = req.body;
        const { error } = usersSchema(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const findUser = await prisma.users.findUnique({ where: { email } });
        if (findUser) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.users.create({
            data: {
                fullname,
                email,
                password: hashedPassword,
                age,
                country,
                isAdmin,
            },
        });
        res.json({ message: "User created successfully", user });

    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { fullname, email, age, country, isAdmin } = req.body;

        const findUser = await prisma.users.findUnique({ where: { id } });
        if (!findUser) return res.status(404).json({ message: "User not found" });
        const updatedUser = await prisma.users.update({
            where: { id },
            data: {
                fullname,
                email,
                age,
                country,
                isAdmin,
            },
        });
        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        next(error);
    }
}

const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const findUser = await prisma.users.findUnique({ where: { id } });
        if (!findUser) return res.status(404).json({ message: "User not found" });
        await prisma.users.delete({ where: { id } });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
}

const getUsers = async (req, res, next) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                fullname: true,
                email: true,
                password: true,
                age: true,
                country: true,
                rating: true,
                isAdmin: true,
                created_at: true,
                tournaments: {
                    select: {
                        tournament: {
                            select: {
                                name: true,
                                matches: true
                            }
                        }
                    }
                }
            }
        });
        res.json(users);
    } catch (error) {
        next(error);
    }
}



const getLeaderboard = async (req, res, next) => {
    try {
        const leaderboard = await prisma.users.findMany({
            select: {
                id: true,
                fullname: true,
                rating: true,
            },
            orderBy: {
                rating: 'desc'
            }
        });

        res.json({ leaderboard });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    getLeaderboard,
    create,
    update,
    remove
}