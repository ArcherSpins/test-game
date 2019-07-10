class Game4inRowItem {
  constructor(index, width) {
    this.x = index % width;
    this.y = index / width | 0;
    this.index = index;
    this.selected = false;
  }
}
class Game4inRow {
  constructor(options) {
    this.options = {
      width: 8,
      height: 6,
      rowLength: 4,
      
      ...options
    };
    
    this.rowLength = this.options.rowLength;
    this.width = this.options.width;
    this.height = this.options.height;
    this.elem = this.options.elem;
  
    this.state = "wait";
  
    this.gameItems = [];
    this.createGameItems();
    
    this.createElems();
    
    this.playerClassList_Selected = [
      "item-selected-0",
      "item-selected-1",
      "item-selected-2",
      "item-selected-3",
    ];
    this.classWin = "item-win";
    
    this.players = [];
    this.currentPlayerIndex = 0;
    this.currentPlayer = null;
  }

  createGameItems() {
    for(let i = 0; i < this.width*this.height; i++) {
      this.gameItems.push(new Game4inRowItem(i, this.width));
    }
  }
  createElems() {
    for(let i = 0; i < this.width*this.height; i++) {
      const div = document.createElement("div");
      div.classList.add("item");
      this.elem.appendChild(div);
      
      const gameItem = this.gameItems[i];
      gameItem.elem = div;
      gameItem.onClick = () => this.onClickGameItem(gameItem);
      div.addEventListener("click", gameItem.onClick);
    }
  }
  
  start(players) {
    this.players = players;
    this.currentPlayerIndex = -1;
    this.nextPlayer();
    
    this.state = "game";
  }
  nextPlayer() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.currentPlayer = this.players[this.currentPlayerIndex];
    this.setLabel(`Now the player's '${this.currentPlayer}' turn`);
  }

  onClickGameItem(gameItem) {
    if ( this.state !== "game" )
      return;
    
    if ( gameItem.selected )
      return;

    gameItem.selected = this.currentPlayer;
    gameItem.elem.classList.add(
      this.playerClassList_Selected[this.currentPlayerIndex % this.playerClassList_Selected.length]
    );
    
    const winInfo = this.getWinInfo(gameItem);
    if ( winInfo ) {
      winInfo.map(gi => gi.elem.classList.add(this.classWin));
      this.state = "win";
      this.setLabel(`Player '${this.currentPlayer}' win!`);
      return;
    }
    
    this.nextPlayer();
  }
  
  getWinInfo(gameItem) {
    const arr = [
      [...this.getSame(gameItem, {x: -1, y:  0}), gameItem, ...this.getSame(gameItem, {x: 1, y:  0})],
      [...this.getSame(gameItem, {x:  0, y: -1}), gameItem, ...this.getSame(gameItem, {x: 0, y:  1})],
      [...this.getSame(gameItem, {x: -1, y: -1}), gameItem, ...this.getSame(gameItem, {x: 1, y:  1})],
      [...this.getSame(gameItem, {x: -1, y:  1}), gameItem, ...this.getSame(gameItem, {x: 1, y: -1})],
    ].sort((l, r) => r.length - l.length);
    if ( arr[0].length >= this.rowLength )
      return arr[0];
    
    return null;
  }
  
  GI(x, y) {
    return this.gameItems[y * this.width + x];
  }
  getSame(gameItem, rule) {
    let arr = [];
    let {x,y} = gameItem;
    while(1) {
      x += rule.x;
      y += rule.y;
      const gi2 = this.GI(x, y);
      if ( !gi2 || gi2.selected !== gameItem.selected )
        return arr;
      arr.push(gi2);
    }
  }
  
  
  setLabel(text) {
    const elem = document.querySelector(".player");
    elem.textContent = text;
  }
}


const game = new Game4inRow({
  elem: document.querySelector("#mainBlock")
})

game.start(["cat max", "cat barsik"]);