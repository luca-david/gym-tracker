import type { Request, Response } from "express";
import db from "../db.js";

//statements
const insertCategoryStatement = db.prepare(`
    INSERT OR IGNORE INTO categories (name) VALUES (?)
`);

const getAllCategoriesStatement = db.prepare(`
    SELECT * FROM categories   
`)

//GET for all categories
export const getAllCategories = (req: Request, res: Response) => {
    const result = getAllCategoriesStatement.all() as { id: number, name: string }[];
    //const categoryNames = result.map(cat => cat.name); //keep only the name of the category(discard the id)

    console.log(result);

    return res.status(200).json({
        'message': 'Succesfully returned all categories',
        'data': result
    });
}

//POST for creating a new category
export const createNewCategory = (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        if (!name.data) {
            return res.status(400).json({
                error: 'New category must have a name'
            });
        }

        const result = insertCategoryStatement.run(name);

        console.log('New cateogry to be inserted: ' + result.changes.toString)

        return res.status(200).json({
            message: 'Successfully inserted new category',
            data: result
        })

    } catch (error) {
        return res.status(400).json({
            error: 'Error while creating ' + name + ' category'
        });
    }
}