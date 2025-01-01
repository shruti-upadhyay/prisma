import {PrismaClient} from "@prisma/client"
import { log } from "console"
import { query } from "express"

const prisma = new PrismaClient ({
    log:["query"],
});

export default prisma;