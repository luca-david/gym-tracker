import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sql from '../db.js';

const migrationsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

//every migration that has already run is recorded here, so re-running the script is a no-op
const createMigrationsTable = `
    CREATE TABLE IF NOT EXISTS schema_migrations (
        name       TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
`;

//Neon's HTTP driver sends one statement per request, so a .sql file has to be split up first.
//a naive split on ';' would cut a semicolon that sits inside a string, an identifier or a
//comment, so walk the file once and only break on semicolons found at the top level
function splitStatements(fileContents: string): string[] {
    const statements: string[] = [];
    let current = '';
    let i = 0;

    while (i < fileContents.length) {
        const char = fileContents[i]!;
        const next = fileContents[i + 1];

        //-- line comment: skip to the end of the line
        if (char === '-' && next === '-') {
            const newline = fileContents.indexOf('\n', i);
            i = newline === -1 ? fileContents.length : newline;
            continue;
        }

        /* block comment: skip to the closing marker */
        if (char === '/' && next === '*') {
            const end = fileContents.indexOf('*/', i + 2);
            i = end === -1 ? fileContents.length : end + 2;
            continue;
        }

        //'string literal' or "quoted identifier": copy it across verbatim, doubled quotes escape
        if (char === "'" || char === '"') {
            const quote = char;
            current += char;
            i++;
            while (i < fileContents.length) {
                const inner = fileContents[i]!;
                current += inner;
                i++;
                if (inner === quote) {
                    if (fileContents[i] === quote) {
                        current += quote;
                        i++;
                        continue;
                    }
                    break;
                }
            }
            continue;
        }

        //$$ / $tag$ dollar quoted body (function definitions), copied across verbatim
        if (char === '$') {
            const tag = /^\$[A-Za-z_]*\$/.exec(fileContents.slice(i));
            if (tag) {
                const marker = tag[0];
                const end = fileContents.indexOf(marker, i + marker.length);
                const stop = end === -1 ? fileContents.length : end + marker.length;
                current += fileContents.slice(i, stop);
                i = stop;
                continue;
            }
        }

        //a top level semicolon ends the statement
        if (char === ';') {
            if (current.trim()) {
                statements.push(current.trim());
            }
            current = '';
            i++;
            continue;
        }

        current += char;
        i++;
    }

    //a trailing statement without a closing semicolon still counts
    if (current.trim()) {
        statements.push(current.trim());
    }

    return statements;
}

export async function runMigrations(): Promise<string[]> {
    await sql.query(createMigrationsTable);

    const applied = (await sql`SELECT name FROM schema_migrations`) as { name: string }[];
    const alreadyApplied = new Set(applied.map((row) => row.name));

    //file names are zero padded (0001_, 0002_, ...) so a plain sort is the run order
    const files = (await readdir(migrationsDir))
        .filter((file) => file.endsWith('.sql'))
        .sort();

    const justApplied: string[] = [];

    for (const file of files) {
        if (alreadyApplied.has(file)) {
            console.log('- ' + file + ' (already applied)');
            continue;
        }

        const contents = await readFile(path.join(migrationsDir, file), 'utf8');
        const statements = splitStatements(contents);

        //the whole file plus its bookkeeping row goes in one transaction: a migration that
        //fails halfway leaves the database exactly as it was
        await sql.transaction([
            ...statements.map((statement) => sql.query(statement)),
            sql`INSERT INTO schema_migrations (name) VALUES (${file})`,
        ]);

        console.log('+ ' + file + ' (' + statements.length + ' statements)');
        justApplied.push(file);
    }

    return justApplied;
}

//only run when this file is the entry point, so importing it from elsewhere is safe
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    const applied = await runMigrations();
    console.log(
        applied.length === 0
            ? 'Database is already up to date'
            : 'Applied ' + applied.length + ' migration(s)'
    );
}
