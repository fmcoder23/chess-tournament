const { registerSchema, loginSchema } = require('../schema/auth.schema');
const { prisma } = require('../utils/connection');
const { createToken } = require('../utils/jwt');
const bcrypt = require('bcrypt')

const register = async (req, res, next) => {
    try {
        const { fullname, email, password, age, country } = req.body;
        const { error } = registerSchema(req.body);
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
            }
        });

        const token = createToken({ id: user.id, isAdmin: user.isAdmin })

        res.status(201).json({ message: "User registered successfully", token });

    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { error } = loginSchema(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = createToken({ id: user.id, isAdmin: user.isAdmin })

        res.json({ message: "User logged in successfully", token });
    } catch (error) {
        next(error)
    }
}


module.exports = {
    register,
    login,
}