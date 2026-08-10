import type { Request, Response } from "express";
import db from "../db.js";

const insertUserStatement = db.prepare(`
    INSERT INTO users (name) VALUES (?)    
`)



export const createNewUser = (req: Request, res: Response) => {
    const { name } = req.body;
    console.log('name: ' + name);

    if (!name) {
        return res.status(400).json({
            'error': 'Name is mandatory'
        });
    }

    const info = insertUserStatement.run(name);

    const userId = info.lastInsertRowid;

    return res.status(401).json({
        'message': 'Created new user ' + name + ' with id ' + userId
    });
}