import type { Request, Response } from "express";
import sql from "../db.js";

//GET for all categories
export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const result = await sql`
            SELECT id, name, user_id FROM categories ORDER BY id
        ` as { id: number, name: string }[];

        console.log(result);

        return res.status(200).json({
            'message': 'Succesfully returned all categories',
            'data': result
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            'error': 'Error while reading the categories'
        });
    }
}

//POST for creating a new category
export const createNewCategory = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({
                error: 'New category must have a name'
            });
        }

        //ON CONFLICT DO NOTHING is the Postgres spelling of INSERT OR IGNORE: a name that is
        //already taken returns no row instead of raising a unique violation
        const rows = await sql`
            INSERT INTO categories (name) VALUES (${name})
            ON CONFLICT DO NOTHING
            RETURNING id, name, user_id
        ` as { id: number, name: string }[];

        console.log('New category inserted: ' + rows.length);

        return res.status(200).json({
            message: 'Successfully inserted new category',
            data: rows[0] ?? null
        })

    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: 'Error while creating ' + name + ' category'
        });
    }
}
