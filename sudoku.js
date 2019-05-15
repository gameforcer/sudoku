function initSudoku()														//function creating the grid
{
	var Grid = new Array(9);
	var numRange = [1,2,3,4,5,6,7,8,9];
	var i, rotateCeil = Math.floor(Math.random() * 51) + 50;

	for(i=0;i<9;i++)														//init sudoku array + fill 1st row
		Grid[i] = new Array(9);
	Grid[0] = shuffleArr(numRange).slice();
	
	for(i=1;i<9;i++)														//shift around numbers of the first row and use it to fill the other ones
	{
		if(i%3 !== 0) Grid[i] = shiftLine(Grid,3,i-1).slice();
		else Grid[i] = shiftLine(Grid,1,i-1).slice();
	}
	
	for(i=0;i<=rotateCeil;i++)												//rotate the grid 10-20 times to make unique puzzle
	{
		switch(Math.floor(Math.random() * 5))
		{
			case 0:
				Grid=swapNums(Grid);
				break;
			
			case 1:
				Grid=swapRows(Grid);
				break;
			
			case 2:
				Grid=swapCols(Grid);
				break;
				
			case 3:
				Grid=swapsSqrs_V(Grid);
				break;
								
			case 4:
				Grid=swapsSqrs_H(Grid);
				break;
		}
	}
	return Grid;
}


function shuffleArr(arr) 													//shuffles given array randomly
{
	var currentIndex = arr.length, temporaryValue, randomIndex;
	while (currentIndex !== 0)
	{
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = arr[currentIndex];
		arr[currentIndex] = arr[randomIndex];
		arr[randomIndex] = temporaryValue;
	}
	return arr;
}


function shiftLine(grid,shiftVal,lineID)									//returns grid's line (9-element array) but shifted by shiftVal
{
	var shTmp, line=grid[lineID].slice();
	
	while(shiftVal !== 0)
	{
		shiftVal--;
		shTmp=line.shift();
		line.splice(line.length,0,shTmp);		
	}
	return line;
}


function swapNums(array)													//swaps 2 random numbers on the entire grid
{
	var swapV1 = Math.floor(Math.random() * 9) + 1;
	
	do
		var swapV2 = Math.floor(Math.random() * 9) + 1;
	while(swapV1 === swapV2);

	return array.map(row => row.map( x => scheme(x,swapV1,swapV2)));
}


function scheme(x,y,z)														//assist function that is a swapping template for swapNums 
{
	if(x === y) return z;
	else if(x === z) return y;
	else return x;
}


function swapRows(array)													//swaps 2 random rows on the grid
{
	var newArr = array.slice();
	var multi = Math.floor(Math.random() * 3);
	var rowV1 = Math.floor(Math.random() * 3);
	
	do
		var rowV2 = Math.floor(Math.random() * 3);
	while(rowV2 === rowV1);
	rowV1=rowV1+(3*multi);
	rowV2=rowV2+(3*multi);
	
	newArr[rowV1] = array[rowV2].slice();
	newArr[rowV2] = array[rowV1].slice();

	return newArr;
}


function swapCols(array)													//swaps 2 random columns on the grid
{
	var newArr = array.map(arr => arr.slice());
	var multi = Math.floor(Math.random() * 3);
	var tmp, colV1 = Math.floor(Math.random() * 3);
	
	do
		var colV2 = Math.floor(Math.random() * 3);
	while(colV2 === colV1);

	colV1=colV1+(3*multi);
	colV2=colV2+(3*multi);
	
	for(var i=0;i<9;i++)
	{
		tmp = newArr[i].slice()[colV1];
		newArr[i][colV1] = newArr[i].slice()[colV2];
		newArr[i][colV2] = tmp;
	}
	return newArr;
}


function swapsSqrs_V(array)													//swaps 2 random subsquare rows on the grid
{
	var newArr = array.slice();
	var rowV1 = Math.floor(Math.random() * 3);
	
	do
		var rowV2 = Math.floor(Math.random() * 3);
	while(rowV2 === rowV1);

	for(var i=0;i<3;i++)
	{
		newArr[(rowV1*3)+i] = array[(rowV2*3)+i].slice();
		newArr[(rowV2*3)+i] = array[(rowV1*3)+i].slice();
	}
	return newArr;
}


function swapsSqrs_H(array)													//swaps 2 random subsquare columns on the grid
{
	var newArr = array.map(arr => arr.slice());
	var tmp, colV1 = Math.floor(Math.random() * 3);
	
	do
		var colV2 = Math.floor(Math.random() * 3);
	while(colV2 === colV1);

	for(var i=0;i<9;i++)
	{
		for(var j=0;j<3;j++)
		{
			tmp = newArr[i].slice()[(colV1*3)+j];
			newArr[i][(colV1*3)+j] = newArr[i].slice()[(colV2*3)+j];
			newArr[i][(colV2*3)+j] = tmp;
		}
	}
	return newArr;
}


function printSudoku(Grid)													//prints the grid onto website
{
	var i=0,fields = document.getElementsByClassName("cell");
	
	for(var j=0;j<9;j++)
		for(var k=0;k<9;k++)
		{
			if(Grid[j][k] != 0) 
			{
				fields[i].value = Grid[j][k];
				fields[i].disabled = true;
				fields[i].style.color = 'black';	
			}
			else
			{
				fields[i].value = '';
				fields[i].disabled = false;
				fields[i].style.color = 'blue';					
			}
			i++;
		}
}


function initSudokuCookie(Grid, name)												//makes a cookie out of given grid
{
	var strGrid = GridToStr(Grid);
	printSudoku(Grid);
	var expDate = new Date();
	expDate.setTime(expDate.getTime() + (365*24*60*60*1000));
	var expires = "expires=" + expDate.toUTCString();
	document.cookie = name + "=" + strGrid + ";" + expires + ";path=/";
}


function getCookie(cname)															//stock function to get cookie by name
{
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
		c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
		}
	}
	return "";
}


function deleteCookies()													//deletes all cookies; stackoverflow-made
{
	var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) 
	{
        var d = window.location.hostname.split(".");
        while (d.length > 0) 
		{
            var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
            var p = location.pathname.split('/');
            document.cookie = cookieBase + '/';
            while (p.length > 0) 
			{
                document.cookie = cookieBase + p.join('/');
                p.pop();
            }
            d.shift();
        }
    }
}


function Initialize()														//main function creating a puzzle					
{
	if(document.cookie == "") 
		{
			fullGrid = initSudoku();
			initSudokuCookie(fullGrid,"completeGrid");
			initSudokuCookie(GridCut(fullGrid),"sudoku");
		}
	else
	{
		var strGrid = getCookie("sudoku");
		printSudoku(StrToGrid(strGrid));
	}
	console.log(document.cookie);
}


function newGame()															//function resetting the puzzle
{
	deleteCookies();
	Initialize();
}


function GridToStr(Grid)													//makes string out of given grid
{
	var str="";
	for(var i=0;i<9;i++)
		for(var j=0;j<9;j++)
			str += Grid[i][j].toString(); 
	return str;
}


function StrToGrid(strGrid)													// makes grid out of given string
{
	var c=0;
	var Grid = new Array(9);
	
	for(var i=0;i<9;i++)
		Grid[i] = new Array(9);
	
	for(var i=0;i<9;i++)
		for(var j=0;j<9;j++)
		{
			Grid[i][j] = strGrid[c];
			c++;
		}
	return Grid;
}


function GridCut(Grid)														//makes holes in a complete grid
{																			//can create less holes than intended due to lack of potential positions for them
	var difficulty = document.getElementById("difficulty");
	var tries =0;
	var holeGrid = new Array(81);
		for(var i=0;i<81;i++) holeGrid[i] = i;
	holeGrid = shuffleArr(holeGrid).slice();
	
	switch(difficulty.value)
	{
		case "1":
			var cutCount = Math.floor(Math.random() * 2) + 32;
			break;
		case "2":
			var cutCount = Math.floor(Math.random() * 2) + 40;
			break;
		case "3":
			var cutCount = Math.floor(Math.random() * 2) + 49;
			break;
		case "4":
			var cutCount = Math.floor(Math.random() * 2) + 58;
	}
	for(var i=0;i<81;i++)
	{
		var random = holeGrid[i];
		
		var col = random % 9;
		var row = Math.floor(random/9);
		if(Grid[row][col] != 0 && cutCount > 0)
		{
			var canCut = chckForHoles(row,col,Grid);
			
			if(canCut == 0)
			{
				Grid[row][col] = 0;
				cutCount--;
			}
		}
	}
	return Grid;
}


function chckForHoles(row,col,Grid)											//side function for GridCut
{																			//checks if a hole can be made on given position
	var ceil = getHoleCeil();
	var x = getSqrXY(row);
	var y = getSqrXY(col);
	var cnt = new Array(3).fill(0);
	
	for(var i=x;i<x+3;i++)
		for(var j=y;j<y+3;j++)
			if(Grid[i][j] == 0) cnt[0]++;
	for(var i=0;i<9;i++)
		if(Grid[row][i] == 0) cnt[1]++;	
	for(var i=0;i<9;i++)
		if(Grid[i][col] == 0) cnt[2]++;
	if(cnt[0] >= ceil || cnt[1] >= ceil || cnt[2] >= ceil) return true;
	return false;
}



function getHoleCeil()														//side function to chckForHoles
{																			//returns max number of holes that can exist in a subsquare/column/row for according difficulty lvl
	var difficulty = document.getElementById("difficulty");
	
	switch(difficulty.value)
	{
		case "1":
			return 4;
		case "2":
			return 5;
		case "3":
			return 6;
		case "4":
			return 7;
	}
}


function getSqrXY(x)														//cute little function that returns position of a first element in a subsquare for given column and/or row
{
	return Math.floor(x/3)*3;
}


function chckSudoku()													//checks if game has been completed correctly
{
	var i=0, correctCnt = 0, fields = document.getElementsByClassName("cell");
	var strGrid = getCookie("completeGrid");
	for(var j=0;j<9;j++)
		for(var k=0;k<9;k++)
		{
			if(fields[i].value == strGrid[i])
				correctCnt++;
			i++;
		}
	if(correctCnt == 81)
		console.log("gg WP");
	else
		console.log("Misson failed!");
}