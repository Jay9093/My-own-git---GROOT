#!/usr/bin/env node
//for 
//creating own version control system like git 
//this is how git works - git init (folder is initialized), sample file created, git add sample.txt ( we can see under objects - the hash based object file is created), git commit -> can see commit hash too

import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto'; //for hashing SHA-1 HASH like git
import { diffLines } from 'diff'; //can see difference between the info
import chalk from 'chalk'; //for colour
import { Command } from 'commander'; //for terminal based execution

const program = new Command();
class Groot{

    constructor(repoPath = '.'){
        this.repoPath = path.join(repoPath, '.groot');
        this.objectsPath = path.join(this.repoPath, 'objects');
        this.headPath = path.join(this.repoPath, 'HEAD');
        this.indexPath = path.join(this.repoPath, 'index');
        this.init();
    }

    async init(){
        await fs.mkdir(this.objectsPath, {recursive:true});
        try{
            await fs.writeFile(this.headPath, '', {flag: 'wx'});  //open for writing, fails if file exists
            await fs.writeFile(this.indexPath, JSON.stringify([]), {flag: 'wx'});
        } catch(error){
            console.log(".groot already initialized!");
        }
    }
    hashObject(content){
        return crypto.createHash('sha1').update(content, 'utf-8').digest('hex');
    }
    async add(fileToBeAdded){
        const fileData = await fs.readFile(fileToBeAdded, { encoding: 'utf-8'}); //read
        const fileHash = this.hashObject(fileData);  //create hash using content
        console.log(fileHash);
        const newFileHashedObjectPath = path.join(this.objectsPath, fileHash); //store that hash as object file .groot/objects/abc123
        await fs.writeFile(newFileHashedObjectPath, fileData);
        //add to staging area
        await this.updateStagingArea(fileToBeAdded, fileHash);
        console.log(`Added file ${fileToBeAdded}`);
    }

    async updateStagingArea(filePath, fileHash){
        const index = JSON.parse(await fs.readFile(this.indexPath, { encoding: 'utf-8'})); //read index
        index.push({ path : filePath, hash: fileHash }); //add file to index
        await fs.writeFile(this.indexPath, JSON.stringify(index)); //write the updated index file
    }

    //what happens when we commit? staging area -> fully there
    async commit(message){
        const index = JSON.parse(await fs.readFile(this.indexPath, { encoding: 'utf-8'}));
        const parentCommit = await this.getCurrentHead();

        const commitData = {
            timeStamp: new Date().toISOString(),
            message,
            files: index,
            parent: parentCommit
        };
        const commitHash = this.hashObject(JSON.stringify(commitData));
        const commitPath = path.join(this.objectsPath, commitHash);
        await fs.writeFile(commitPath, JSON.stringify(commitData));
        await fs.writeFile(this.headPath, commitHash);  //update head to new commit
        //clear staging area now 
        await fs.writeFile(this.indexPath, JSON.stringify([]));
        console.log("Commit successful!");
    }

    async getCurrentHead(){
        try{
            return await fs.readFile(this.headPath, { encoding: 'utf-8' });
        } catch(error){
            return null;
        }
    }
    async log(){
        let currentCommitHash = await this.getCurrentHead();;
        while(currentCommitHash){
            const commitData = JSON.parse(await fs.readFile(path.join(this.objectsPath, currentCommitHash), { ecnoding: 'utf-8' }));
            console.log(`--------------------\n`);
            console.log(`Commit : ${currentCommitHash}\nDate: ${commitData.timeStamp}\n\n${commitData.message}\n\n`);
            currentCommitHash = commitData.parent;
        }
      
    }

    async showCommitDiff(commitHash){
        const commitData = JSON.parse(await this.getCommitData(commitHash));
        if (!commitData){
            console.log("Commit not found!");
            return;
        }
        console.log("Changes in the last commit are: ");

        for(const file of commitData.files){
        console.log(`File: ${file.path}`);
        const fileContent = await this.getFileContent(file.hash);
        console.log(fileContent);
        if (commitData.parent){
            const parentCommitData = JSON.parse(await this.getCommitData(commitData.parent));
            const getParentFileContent = await this.getParentFileContent(parentCommitData, file.path);
            if(getParentFileContent != undefined){
                console.log('\nDiff:');
                const diff = diffLines(getParentFileContent, fileContent);
                //console.log(diff);
                diff.forEach(part => {
                    if(part.added){
                        process.stdout.write(chalk.green("++" + part.value));
                    } else if(part.removed){
                        process.stdout.write(chalk.red("--" + part.value));
                    } else {
                        process.stdout.write(chalk.grey(part.value));
                    }
                });
                console.log(); 
            } else {
                console.log("New file in this commit");
            }
        } else {
            console.log("First commit");
        }
        }

    }
 
    //lets say you have commit c1 with files f1 and f2, in c2 commit f1, f2, f3 -> we need to check what has changed and print
    async getParentFileContent(parentCommitData, filePath){
        const parentFile = parentCommitData.files.find(file => file.path == filePath);
        if (parentFile){
            //get content from parent
            return await this.getFileContent(parentFile.hash);
        }
    }

    async getCommitData(commitHash){
        const commitPath = path.join(this.objectsPath, commitHash);
        try{
            return await fs.readFile(commitPath, { encoding: 'utf-8'});
        } catch(error){
            console.log("Failed toread commit data", error);
            return null;
        }
    }

    async getFileContent(fileHash){
        const objectPath = path.join(this.objectsPath, fileHash);
        return fs.readFile(objectPath, { encoding: 'utf-8' });
    }
}
//(async () => {
    const groot = new Groot();
    //await groot.add('sample.txt');
    //await groot.add('sample2.txt');
    //await groot.commit("Fourth commit");
    //await groot.log();
    //await groot.showCommitDiff('1b17e9fef9881fc167a9acf6bc5cd9ddfb88d7c9');

//})();

program.command('init').action(async () => {
    const groot = new Groot();
});

program.command('add <file>').action(async (file) => {
    const groot = new Groot();
    await groot.add(file);
});

program.command('commit <message>').action(async (message) => {
    const groot = new Groot();
    await groot.commit(message);
});

program.command('log').action(async () => {
    const groot = new Groot();
    await groot.log();
});

program.command('show <commitHash>').action( async (commitHash) => {
    const groot = new Groot();
    await groot.showCommitDiff(commitHash);
});

program.parse(process.argv); //command line arguments