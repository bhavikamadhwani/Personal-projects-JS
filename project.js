//1. Deposit some money
//2. Determiine number of lines to bet on 
//3. Collect a bet amount
//4. Spin the slot machine
//5. Check if the user won
//6. give user their winning amt
//7. Play again or handle where user has no money left

// this is how we import package here, () in js is like creating a class instance
const prompt= require("prompt-sync")();

const ROWS=3;
const COLS=3;

const SYMBOLS_COUNT={
    A: 2,
    B: 4,
    C: 6,
    D: 8
}
const SYMBOLS_VALUES={
    A: 5,
    B: 4,
    C: 3,
    D: 2
}
//function to get deposit function
const deposit =()=>{
    while(true){
        const depositAmount= prompt("Enter a deposit amount: "); //by-default prompt returns string 
        const numDepositAmount = parseFloat(depositAmount); //"12.9" -> 12.9, "Hello"-> Nan
        
        if(isNaN(numDepositAmount) || numDepositAmount<=0){
            console.log("Invalid deposit amount, try again");
        }else{
            return numDepositAmount;
        }
    }
};



//function to get no. of lines to be bet on by user
const getNumberofLines =()=>{
    while(true){
        const lines= prompt("Enter a number of lines to be bet on (1-3): "); //by-default prompt returns string 
        const numberOfLines = parseFloat(lines); //"12.9" -> 12.9, "Hello"-> Nan
        
        if(isNaN(numberOfLines) || numberOfLines<=0 || numberOfLines>3){
            console.log("Invalid number of lines, try again");
        }else{
            return numberOfLines;
        }
    }
};

const getBet =(balance,lines)=>{
    while(true){
        const bet= prompt("Enter the bet per line: "); //by-default prompt returns string 
        const numberbet = parseFloat(bet); //"12.9" -> 12.9, "Hello"-> Nan
        
        if(isNaN(numberbet) || numberbet<=0 || numberbet> (balance/lines)){
            console.log("Invalid number of bets, try again");
        }else{
            return numberbet;
        }
    }
};

const spin =()=>{
    const symbols= []; //array ia reference datatype -> manipulate without changing the reference to that array
    for (const [symbol,count] of Object.entries(SYMBOLS_COUNT)){ //object.entries converts in into array like [ ["A", 2], ["B", 3], ["C", 1] ]
        for(let i=0; i<count;i++){
            symbols.push(symbol); // same like python's append
        }
    }

    const reels=[]
    for(let i=0;i<COLS;i++){
        reels.push([]);
        const reelSymbols=[...symbols]; //copies the symbols array to another array
        for(let j=0;j<ROWS;j++){
            const randomIndex= Math.floor(Math.random() * reelSymbols.length); // math floor so that we can round down instead of up (which is a possibility).
            const selectedSymbol= reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex,1);
        }
    }
    return reels;
};
// now reels looks like [[A,B,C], [A,A,B],[B,A,C]], each inner list is a column/reel (vertical) 
const transpose=(reels)=>{
    const rows=[];
    for (let i=0; i<ROWS; i++){
        rows.push([]);
        for(let j=0;j<COLS;j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const printRows =(rows)=>{
    for(const row of rows){   
        let rowString= "";
        for(const [i,symbol] of row.entries()){ //[i,symbol] -> index,element
            rowString+= symbol
            if(i!= row.length-1){
                rowString+=" | "
            }
        }
        console.log(rowString)
    }
}
const getWinnings=(rows,bet,lines)=>{
    let winnings=0;
    for(let row=0;row<lines;row++){
        const symbols= rows[row];
        let allSame=true;
        for (const symbol of symbols){
            if(symbol!=symbols[0]){
                allSame = false;
                break;
            }
        }
        if(allSame){
            winnings+= bet*SYMBOLS_VALUES[symbols[0]];
        }
    }
    return winnings;
}

const game =() =>{
    let balance= deposit(); // let instead of  const so that you can change later
    
    while(true){
    console.log("You have a balance of $" + balance)
    const numberOfLines=getNumberofLines();
    const bet= getBet(balance,numberOfLines);
    balance-=bet * numberOfLines;
    const reels=spin();
    const rows=transpose(reels);
    printRows(rows);
    const winnings= getWinnings(rows,bet,numberOfLines)
    balance+=winnings;
    console.log("You won, $"  +winnings.toString());

    if(balance<=0){
        console.log("You ran out of money");
        break;
    }

    const playAgain =  prompt("do u wanna play again (y/n)?")
    if(playAgain != "y") break;
    }
};
game();