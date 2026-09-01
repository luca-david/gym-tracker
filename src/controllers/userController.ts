import type { Request, Response } from "express";
import sql from "../db.js";

export const createNewUser = async (req: Request, res: Response) => {
    const { name } = req.body;
    console.log('name: ' + name);

    if (!name) {
        return res.status(400).json({
            'error': 'Name is mandatory'
        });
    }

    try {
        const rows = await sql`
            INSERT INTO users (name) VALUES (${name}) RETURNING id
        ` as { id: number }[];

        const userId = rows[0]?.id;

        return res.status(201).json({
            userId
            //'message': 'Created new user ' + name + ' with id ' + userId
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            'error': 'Could not create the user ' + name
        });
    }
}
