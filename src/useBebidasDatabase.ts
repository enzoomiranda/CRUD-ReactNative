import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

export type Bebida = {
    id: number;
    nome: string;
};

export function useBebidasDatabase() {
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
    const [bebidas, setBebidas] = useState<Bebida[]>([]);

    useEffect(() => {
        async function setupDatabase() {
            const database = await SQLite.openDatabaseAsync('estoque.db');
            await database.execAsync(
                'CREATE TABLE IF NOT EXISTS bebidas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL);'
            );
            setDb(database);
            fetchBebidas(database);
        }
        setupDatabase();
    }, []);

    async function fetchBebidas(database: SQLite.SQLiteDatabase) {
        const result = await database.getAllAsync<Bebida>('SELECT * FROM bebidas ORDER BY id DESC');
        setBebidas(result);
    }

    async function addBebida(nome: string) {
        if (!db || nome.trim() === '') return;
        await db.runAsync('INSERT INTO bebidas (nome) VALUES (?)', nome);
        await fetchBebidas(db);
    }

    async function updateBebida(id: number, novoNome: string) {
        if (!db || novoNome.trim() === '') return;
        await db.runAsync('UPDATE bebidas SET nome = ? WHERE id = ?', novoNome, id);
        await fetchBebidas(db);
    }

    async function deleteBebida(id: number) {
        if (!db) return;
        await db.runAsync('DELETE FROM bebidas WHERE id = ?', id);
        await fetchBebidas(db);
    }

    return { bebidas, addBebida, updateBebida, deleteBebida, isReady: !!db };
}

//
// CÓDIGO PRA TESTE NA WEB 
// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓


// import { useState, useEffect } from 'react';
// import { Platform } from 'react-native';
// import * as SQLite from 'expo-sqlite';

// export type Bebida = {
//   id: number;
//   nome: string;
// };

// export function useBebidasDatabase() {
//   const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
//   const [bebidas, setBebidas] = useState<Bebida[]>([]);
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     async function setup() {
//       if (Platform.OS === 'web') {
//         console.log("Rodando em modo Web (Simulação)");
//         setIsReady(true);
//         return;
//       }

//       try {
//         const database = await SQLite.openDatabaseAsync('estoque_bebidas.db');
//         await database.execAsync(
//           'CREATE TABLE IF NOT EXISTS bebidas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL);'
//         );
//         setDb(database);
//         const result = await database.getAllAsync<Bebida>('SELECT * FROM bebidas ORDER BY id DESC');
//         setBebidas(result);
//         setIsReady(true);
//       } catch (error) {
//         console.error("Erro ao iniciar banco:", error);
//       }
//     }
//     setup();
//   }, []);

//   // CREATE
//   async function addBebida(nome: string) {
//     if (!nome.trim()) return;

//     if (Platform.OS === 'web') {
//       const novaBebida = { id: Date.now(), nome };
//       setBebidas([novaBebida, ...bebidas]);
//     } else if (db) {
//       await db.runAsync('INSERT INTO bebidas (nome) VALUES (?)', nome);
//       const result = await db.getAllAsync<Bebida>('SELECT * FROM bebidas ORDER BY id DESC');
//       setBebidas(result);
//     }
//   }

//   // UPDATE
//   async function updateBebida(id: number, novoNome: string) {
//     if (!novoNome.trim()) return;

//     if (Platform.OS === 'web') {
//       setBebidas(bebidas.map(b => b.id === id ? { ...b, nome: novoNome } : b));
//     } else if (db) {
//       await db.runAsync('UPDATE bebidas SET nome = ? WHERE id = ?', novoNome, id);
//       const result = await db.getAllAsync<Bebida>('SELECT * FROM bebidas ORDER BY id DESC');
//       setBebidas(result);
//     }
//   }

//   // DELETE
//   async function deleteBebida(id: number) {
//     if (Platform.OS === 'web') {
//       setBebidas(bebidas.filter(b => b.id !== id));
//     } else if (db) {
//       await db.runAsync('DELETE FROM bebidas WHERE id = ?', id);
//       const result = await db.getAllAsync<Bebida>('SELECT * FROM bebidas ORDER BY id DESC');
//       setBebidas(result);
//     }
//   }

//   return { bebidas, addBebida, updateBebida, deleteBebida, isReady };
// }