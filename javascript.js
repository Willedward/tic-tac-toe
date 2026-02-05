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

    function returncoord(num){
        let list_of_coord = [[0,0], [0,1], [0,2], [1,0], [1,1], [1,2], [2,0], [2,1], [2,2]];
        return list_of_coord[num-1];
    }

    function count(){
        let counter = 0;
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(board[i][j] != ''){
                    counter += 1;
                }
            }
        }
        return counter;
    }
    return {
        reset,
        set_cell,
        get_board,
        show_board,
        check_avail,
        checkwinner,
        returncoord,
        count
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

//gamecontroller.playround();

const displaycontroller = (function (){
    const form = document.querySelector('form');
    let gameactive = null;
    let player1 = null;
    let player2 = null;
    let currentplayer = null; 
    let otherplayer = null;
    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const p1 = document.getElementById('p1');
        const p2 = document.getElementById('p2');
        console.log(p1.value);
        player1 = createPlayers(p1.value, 'X');
        player2 = createPlayers(p2.value, 'O');
        console.log("player1: ",player1.name);
        gameboard.reset();
        const t3title = document.querySelector('.t3-title');
        currentplayer = player1;
        t3title.textContent = `${currentplayer.name}'s turn! [${currentplayer.sign}]`;
        gameactive = true;
    });

    const buttons = document.querySelectorAll('.square');
    buttons.forEach((button) => {
        button.addEventListener('click', () =>{
            if(gameactive == false) return;
            const idx = gameboard.returncoord(button.id);
            
            const turns = gameboard.count();
            if(turns%2 == false) {currentplayer = player1; otherplayer = player2;}
            else{currentplayer = player2; otherplayer = player1;}
            

            turntiles(currentplayer, button.id, idx);
            gameboard.show_board();
            console.log("gameboardcounter", gameboard.count());
            
            let winner = null;
            if(gameboard.checkwinner()[0] == true){
                //win
                if(gameboard.checkwinner()[1] == 'X') winner = player1;
                else winner = player2;
                displaywin(winner, "win");
                gameactive = false;
            }else if(gameboard.count() == 9){
                //draw
                displaywin(winner, "draw")
                gameactive = false;
            }else{
            //after check if not win.
            const t3title = document.querySelector('.t3-title');
            t3title.textContent = `${otherplayer.name}'s turn! [${otherplayer.sign}]`;
            }
        });
    });


    function turntiles(player, btnid, idx){
        const btn = document.getElementById(btnid);
        let txt = document.createElement('div');
        txt.classList.add('signed'); 
        btn.appendChild(txt);
        if(checkoccupied(btn)){
            const t3title = document.querySelector('.t3-title');
            t3title.textContent = `Sorry ${otherplayer.name}, it is occupied!`;
        }else{
            gameboard.set_cell(player.sign, idx);
            appendtiles(btn, player.sign, txt);
        }
    }
    function appendtiles(btn, sign, txt){
        txt.textContent = sign;
        btn.classList.add('active');
        if(sign == 'X') btn.classList.add('activeblue');
        else btn.classList.add('activered');
    }

    function checkoccupied(btn){
        if(btn.classList.contains('active')){
            return true;
        }else return false;
    }

    function displaywin(winner, condition){
        const t3title = document.querySelector('.t3-title');
        if(condition == "win"){
        t3title.textContent = `${winner.name} wins!`; 
        }else{
            t3title.textContent = 'DRAW!';
        }
        cleartiles();
    }

    function cleartiles(){
        const buttons = document.querySelectorAll('.square');
        buttons.forEach((button) =>{
            const signed = button.querySelector('.signed')
            if(signed){
                signed.remove();
            }
            button.classList.remove('active', 'activered', 'activeblue');
        });
        gameboard.reset();
        form.reset();
    };

    const reset = document.querySelector('#resetbtn');
    reset.addEventListener('click', (e)=>{
        e.preventDefault();
        cleartiles();
        gameactive = false;
    });

})();
