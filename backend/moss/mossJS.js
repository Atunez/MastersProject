var express = require('express');
var router = express.Router();
const { spawn } = require('child_process');

const content = "import java.util.Scanner;public class Main{public static void main(String[] args) {Scanner kb = new Scanner(System.in);String tester = \"Make sure this works...\";String line = kb.nextLine();System.out.println(line);}}"
const content2 = "import java.util.Scanner;public class Main{public static void main(String[] args) {Scanner kb = new Scanner(System.in);}}"
var moss;
moss = spawn('python', ['mossclient.py', 1, "testfile1.java", content])
moss.stdout.on('data', e => {console.log(e.toString())})


const mossid = 250133102
moss = spawn('python', ['mossclient.py', 1, "testfile2.java", content])
moss.stdout.on('data', e => {console.log(e.toString())})

moss = spawn('python', ['mossclient.py', 1, "testfile3.java", content2])
moss.stdout.on('data', e => {console.log(e.toString())})

moss = spawn('python', ['mossclient.py', 2, mossid])

moss.stdout.on('data', e => {console.log(e.toString())})

