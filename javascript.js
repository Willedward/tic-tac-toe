//start

//factory for player

function createPlayers(name, sign){
    return {name, sign}
}

const gameboard = (function() {
    let board = [["", "", ""], ["", "", ""], ["", "", ""]];
    function reset(){
        board = [["", "", ""], ["", "", ""], ["", "", ""]];
    }

    function set_cell(sign, pos){
        board[pos[0]][pos[1]] = sign;
        console.log(board);
    }

    function get_board(){
        return board;
    }

    function show_board(){
        for(let i = 0; i < 3; i++){
            console.log(`${board[i][0]} ${board[i][1]} ${board[i][2]}`);
        }
    }
    function check_avail(coord){
        if(board[coord[0]][coord[1]] != '') return false;
        else return true;
    }

    function checkwinner(){
        //check horizontal
        for(let i  = 0; i < 3; i++){
            if(board[i][0] === board[i][1] && board[i][1]=== board[i][2] && board[i][0] != ''){
                return [true, board[i][0]];
            }
            if(board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] != ''){
                return [true, board[0][i]];
            }
    }
    if(board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] != ''){
                return [true, board[0][0]];
    }
    if(board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[1][1] != ''){
        return [true, board[0][2]];
    }
    return [false];

    }
    return {
        reset,
        set_cell,
        get_board,
        show_board,
        check_avail,
        checkwinner
    };
})();



const gamecontroller = (function(){
    
    let player1 = createPlayers("player1", "X")
    let player2 = createPlayers("player2", "O")
    
    const players = [player1, player2];
    
    
    function playround(){
        gameboard.reset();
        let turns = 0;
        while(gameboard.checkwinner()[0] == false){
            gameboard.show_board();
            let idx = turns%2;
            let curr_player = players[idx];
            console.log();
            console.log(curr_player.name, "Plays");

            let x = prompt(`${curr_player.name} Please enter x-coord: `);
            let y = prompt(`${curr_player.name} Please enter y-coord: `);
            while(gameboard.check_avail([x, y]) == false){
                x = prompt(`${curr_player.name} Please enter x-coord: `);
                y = prompt(`${curr_player.name} Please enter y-coord: `);
            }
            gameboard.set_cell(curr_player.sign, [x, y]);

            const decide = gameboard.checkwinner();
            let winner = player1
            if(decide[0] == true){
                if(decide[1] === 'X') winner = player1;
                else winner = player2;
                console.log('Game Over')
                gameboard.show_board();
                console.log(`${winner.name} Wins!`)
                break;
            }
            turns+=1;
            if(turns == 9){
                console.log('DRAW');
                return;
            }
        }   
    }
    return {playround};
})();

gamecontroller.playround();



