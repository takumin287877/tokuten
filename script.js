const japaneseColors = [
  '#E6B8A2', // 桜
  '#B3424A', // 紅
  '#D7C4BB', // 桜鼠
  '#7F5A58', // 梅鼠
  '#B7A19E', // 桜餅
  '#8E453F', // 鴇
  '#A96360', // 宍
  '#C69C6D', // 灰桜
  '#F2C9AC', // 肌
  '#F4A7B9', // 撫子
  '#D0104C', // 紅赤
  '#9F353A', // 赤茶
  '#A8516E', // 似紫
  '#734338', // 栗梅
  '#D1A380', // 砂
  '#F3EACD', // 白茶
];

function addPlayer() {
  const scoreContainer = document.getElementById('scoreContainer');
  const addPlayerButton = document.getElementById('addPlayerButton');
  const playerCount = scoreContainer.childElementCount;

  if (playerCount < 16) {
    const newPlayer = document.createElement('div');
    newPlayer.className = 'player';

    const nameContainer = document.createElement('div');
    nameContainer.className = 'name-container';

    const newPlayerName = document.createElement('div');
    newPlayerName.className = 'name';
    newPlayerName.textContent = `Player ${playerCount + 1}`;
    newPlayerName.setAttribute('contenteditable', 'true');
    newPlayerName.setAttribute('data-original-name', `Player ${playerCount + 1}`);
    newPlayerName.addEventListener('focus', clearPlayerName);
    newPlayerName.addEventListener('blur', updatePlayerName);
    nameContainer.appendChild(newPlayerName);

    const colorButton = document.createElement('div');
    colorButton.className = 'color-button';
    colorButton.addEventListener('click', function () {
      showColorPalette(newPlayer);
    });
    nameContainer.appendChild(colorButton);

    newPlayer.appendChild(nameContainer);

    const newPlayerScore = document.createElement('div');
    newPlayerScore.className = 'score';
    newPlayerScore.textContent = '0';
    newPlayerScore.setAttribute('contenteditable', 'true');
    newPlayerScore.setAttribute('inputmode', 'numeric');
    newPlayerScore.addEventListener('keypress', handleScoreKeyPress);
    newPlayerScore.addEventListener('paste', handleScorePaste);
    newPlayerScore.addEventListener('blur', updateScore);
    newPlayer.appendChild(newPlayerScore);

    scoreContainer.appendChild(newPlayer);

    updateRemovePlayerButton();
  }

  if (playerCount === 15) {
    addPlayerButton.disabled = true;
  }
}

function removePlayer() {
  const scoreContainer = document.getElementById('scoreContainer');
  const addPlayerButton = document.getElementById('addPlayerButton');

  if (scoreContainer.lastChild) {
    scoreContainer.removeChild(scoreContainer.lastChild);
    updateRemovePlayerButton();
  }

  addPlayerButton.disabled = false;
}

function updateRemovePlayerButton() {
  const scoreContainer = document.getElementById('scoreContainer');
  const removePlayerButton = document.getElementById('removePlayerButton');
  removePlayerButton.disabled = (scoreContainer.childElementCount <= 1);
}

function clearPlayerName(event) {
  if (event.target.textContent === 'Player Name') {
    event.target.textContent = '';
  }
}

function updatePlayerName(event) {
  const newName = event.target.textContent.trim();

  if (newName === '') {
    event.target.textContent = event.target.getAttribute('data-original-name');
  } else {
    event.target.setAttribute('data-original-name', newName);
  }
}

function handleScoreKeyPress(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
}

function handleScorePaste(event) {
  event.preventDefault();
  const pastedData = event.clipboardData.getData('text/plain');
  const newScore = convertToHalfWidth(pastedData.replace(/[^0-9]/g, ''));
  document.execCommand('insertText', false, newScore);
}

function convertToHalfWidth(score) {
  return score.replace(/[０-９]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

function updateScore(event) {
  const input = event.target.textContent;
  const newScore = parseInt(convertToHalfWidth(input));

  if (isNaN(newScore)) {
    alert('スコアは数値で入力してください');
    event.target.textContent = event.target.getAttribute('data-original-score') || '0';
  } else {
    event.target.textContent = newScore;
    event.target.setAttribute('data-original-score', newScore);
  }
}

function showColorPalette(player) {
  const colorPalette = player.querySelector('.color-palette');

  if (!colorPalette) {
    const newColorPalette = document.createElement('div');
    newColorPalette.className = 'color-palette';

    japaneseColors.forEach(color => {
      const colorOption = document.createElement('div');
      colorOption.className = 'color-option';
      colorOption.style.backgroundColor = color;

      colorOption.addEventListener('click', function () {
        player.style.backgroundColor = color;
        newColorPalette.remove();
      });

      newColorPalette.appendChild(colorOption);
    });

    player.insertBefore(newColorPalette, player.firstChild);
    adjustColorPalettePosition(player, newColorPalette);
  } else {
    colorPalette.remove();
  }
}

function adjustColorPalettePosition(player, colorPalette) {
  const playerRect = player.getBoundingClientRect();
  const colorPaletteRect = colorPalette.getBoundingClientRect();
  const windowWidth = window.innerWidth;

  if (playerRect.left + colorPaletteRect.width > windowWidth) {
    colorPalette.style.left = 'auto';
    colorPalette.style.right = '0';
  } else {
    colorPalette.style.left = '50%';
    colorPalette.style.right = 'auto';
  }
}