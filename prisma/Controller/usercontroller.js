import prisma from "../DB/db.config.js";

export const fetchUsers = async (req, res) => {
    const users = await prisma.user.findMany({})

    return res.status(200).json({ data: users, msg: "User Created" });
}
export const createUser = async (req, res) => {  // Add async here
    const { name, email, password } = req.body;

    // Check if user already exists
    const findUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (findUser) {
        return res.status(400).json({ message: "User already exists" });  // Status 400 for existing user
    }

    // Create new user
    const newUser = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: password
        }
    });

    return res.status(200).json({ data: newUser, msg: "User Created" });
};


//update the user

export const updateUser = async (req, res) => {
    const userId = req.params.id
    const { name, email, password } = req.body;

    await prisma.user.update({

        where:{
            id:Number{userId}
        },

        data:{
            name,
            email,
            password
        }
    })

    return res.status(200).json({ data: updateUser, msg: "User Created" });
}