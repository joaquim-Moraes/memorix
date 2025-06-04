
    const flashcards = [
      { id: 1, title: 'História', content: 'aaaaaaaaaaaaaaaaaaaaaaaaa', category: 'historia' },
      { id: 2, title: 'Inglês', content: 'bbbbbbbbbbbbbbbbbbbbbbb', category: 'ingles' },
      { id: 3, title: 'Geografia', content: 'ccccccccccccccccccccccc', category: 'geografia' }
    ];

    const listView = document.getElementById('main-view');
    const singleView = document.getElementById('single-view');
    const listContainer = document.getElementById('flashcard-list');
    const singleCard = document.getElementById('single-card');

    function renderCards() {
      listContainer.innerHTML = '';
      flashcards.forEach(card => {
        const div = document.createElement('div');
        div.className = `card ${card.category}`;
        div.innerHTML = `<div class="header">${card.title}</div><div>${card.content}</div>`;
        div.onclick = () => showCard(card);
        listContainer.appendChild(div);
      });
    }

    function showCard(card) {
      listView.style.display = 'none';
      singleView.style.display = 'block';
      singleCard.innerHTML = `
        <div class="header ${card.category}">${card.title}</div>
        <div>${card.content}</div>
        <div class="actions">
          <button class="delete-btn" onclick="deleteCard(${card.id})">🗑️</button>
          <button class="edit-btn" onclick="editCard(${card.id})">✎️</button>
        </div>
      `;
    }

    function deleteCard(id) {
      const index = flashcards.findIndex(f => f.id === id);
      if (index !== -1) {
        flashcards.splice(index, 1);
        backToList();
      }
    }

    function editCard(id) {
      const newContent = prompt("Editar conteúdo do flashcard:");
      const card = flashcards.find(f => f.id === id);
      if (card && newContent) {
        card.content = newContent;
        showCard(card);
      }
    }

    function backToList() {
      singleView.style.display = 'none';
      listView.style.display = 'block';
      renderCards();
    }

    document.getElementById('add-btn').onclick = () => {
      const title = prompt("Matéria:");
      const content = prompt("Conteúdo:");
      const category = prompt("Categoria (historia, ingles, geografia):");
      if (title && content && category) {
        flashcards.push({
          id: Date.now(),
          title,
          content,
          category
        });
        renderCards();
      }
    };

    document.getElementById('back-btn').onclick = backToList;

    renderCards();