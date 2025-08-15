function loadPosts(){ return JSON.parse(localStorage.getItem('mini-blog') || '[]'); }
function savePosts(posts){ localStorage.setItem('mini-blog', JSON.stringify(posts)); }

let posts = loadPosts();
let currentPage = 1;
const postsPerPage = 5;
let searchQuery = "";

// Render posts
function render(){
  const container = document.getElementById('posts');
  container.innerHTML = '';

  // Filter
  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(searchQuery) ||
    p.content.toLowerCase().includes(searchQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(searchQuery))
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / postsPerPage);
  if (currentPage > totalPages) currentPage = totalPages || 1;
  const start = (currentPage - 1) * postsPerPage;
  const paginated = filtered.slice(start, start + postsPerPage);

  paginated.slice().reverse().forEach(p => {
    const el = document.createElement('div'); el.className = 'post';
    el.innerHTML = `<h3>${p.title}</h3>
      <div>${(p.content || '').slice(0,200)}${p.content.length>200?'...':''}</div>
      <div>Tags: ${p.tags.join(', ')}</div>
      <button data-id="${p.id}" class="read btn">Read</button>`;
    container.appendChild(el);
  });

  renderPagination(totalPages);
}

// Render pagination buttons
function renderPagination(totalPages) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
    btn.onclick = () => { currentPage = i; render(); };
    pagination.appendChild(btn);
  }
}

// Publish post
document.getElementById('publish').onclick = ()=>{
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const tags = document.getElementById('tags').value.split(',').map(s=>s.trim()).filter(Boolean);
  if(!title || !content) return alert('Title and content required');
  posts.push({id:'p'+Date.now(), title, content, tags, created:Date.now()});
  savePosts(posts); render();
  document.getElementById('title').value=''; 
  document.getElementById('content').value=''; 
  document.getElementById('tags').value='';
};

// Search
document.getElementById('search').addEventListener('input', e => {
  searchQuery = e.target.value.toLowerCase();
  currentPage = 1;
  render();
});

// Read
document.addEventListener('click', e=>{
  if(e.target.matches('.read')){
    const id = e.target.dataset.id;
    const p = posts.find(x=>x.id===id);
    alert(`Title: ${p.title}\n\n${p.content}`);
  }
});

render();
